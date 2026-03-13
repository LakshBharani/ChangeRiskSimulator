import { useMemo, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useReactFlow,
  type Node,
  type Edge,
  Position,
  MarkerType,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ResourceNode } from "./ResourceNode";
import { FloatingEdge } from "./FloatingEdge";
import { useRadialLayout } from "../hooks/useRadialLayout";
import type { DependencyGraph as GraphData } from "../types";

function FitViewOnLayout({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    if (nodes.length > 0) {
      const t = setTimeout(() => fitView({ padding: 0.35, duration: 300 }), 100);
      return () => clearTimeout(t);
    }
  }, [nodes, edges, fitView]);
  return null;
}

interface DependencyGraphViewProps {
  graph: GraphData;
  impactedResources: string[];
  rootResourceId?: string;
}

export function DependencyGraphView({
  graph,
  impactedResources,
  rootResourceId,
}: DependencyGraphViewProps) {
  const nodeTypes = useMemo(() => ({ resource: ResourceNode }), []);
  const edgeTypes = useMemo(() => ({ floating: FloatingEdge }), []);
  const getLayoutedElements = useRadialLayout();

  const effectiveRoot = useMemo(() => {
    if (rootResourceId && impactedResources.includes(rootResourceId))
      return rootResourceId;
    const targets = new Set(graph.edges.map((e) => e.to));
    const root = graph.nodes.find((n) => !targets.has(n.id));
    return root?.id ?? graph.nodes[0]?.id ?? "";
  }, [rootResourceId, graph, impactedResources]);

  const initialNodes: Node[] = useMemo(() => {
    const set = new Set(impactedResources);
    return graph.nodes.map((n) => ({
      id: n.id,
      type: "resource",
      position: { x: 0, y: 0 },
      data: {
        label: n.id,
        type: n.type,
        impacted: set.has(n.id),
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    }));
  }, [graph.nodes, impactedResources]);

  const initialEdges: Edge[] = useMemo(() => {
    return graph.edges.map((e, i) => ({
      id: `e-${e.from}-${e.to}-${i}`,
      source: e.from,
      target: e.to,
      type: "floating",
      markerEnd: { type: MarkerType.ArrowClosed, color: "#cbd5e1" },
      animated: true,
      style: {
        stroke: "#cbd5e1",
        strokeWidth: 2,
        strokeDasharray: "6 4",
      },
    }));
  }, [graph.edges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const applyLayout = useCallback(() => {
    const layouted = getLayoutedElements(nodes, edges, effectiveRoot);
    setNodes(layouted);
  }, [nodes, edges, getLayoutedElements, setNodes, effectiveRoot]);

  useEffect(() => {
    if (initialNodes.length === 0) return;
    const layouted = getLayoutedElements(initialNodes, initialEdges, effectiveRoot);
    setNodes(layouted);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, getLayoutedElements, setNodes, setEdges, effectiveRoot]);

  if (graph.nodes.length === 0) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center text-slate-400">
        No dependencies for this resource.
      </div>
    );
  }

  return (
    <div className="relative h-[500px] w-full floating-edges">
      <button
        type="button"
        onClick={applyLayout}
        className="absolute right-14 top-4 z-10 rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 shadow-sm transition-colors hover:bg-slate-700"
      >
        Re-layout
      </button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        colorMode="dark"
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={false}
        edgesReconnectable={false}
        fitView
        fitViewOptions={{ padding: 0.35, duration: 300 }}
        minZoom={0.2}
        maxZoom={1.5}
      >
        <FitViewOnLayout nodes={nodes} edges={edges} />
        <Background color="#475569" gap={20} className="opacity-40" />
        <Controls className="!rounded-lg !border !border-slate-600 !bg-slate-800 [&>button]:!bg-slate-800 [&>button]:!border-b [&>button]:!border-slate-600 [&>button:hover]:!bg-slate-700 [&>button]:!fill-slate-300" />
      </ReactFlow>
    </div>
  );
}
