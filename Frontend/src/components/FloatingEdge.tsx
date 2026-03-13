import {
  getBezierPath,
  useInternalNode,
  useEdges,
  type EdgeProps,
} from "@xyflow/react";
import { getEdgeParams, type EdgeSlot } from "../lib/getEdgeParams";

function getEdgeSlots(
  edges: { id: string; source: string; target: string }[],
  source: string,
  target: string,
  edgeId: string
): { sourceSlot?: EdgeSlot; targetSlot?: EdgeSlot } {
  const outEdges = edges
    .filter((e) => e.source === source)
    .sort((a, b) => a.target.localeCompare(b.target));
  const inEdges = edges
    .filter((e) => e.target === target)
    .sort((a, b) => a.source.localeCompare(b.source));

  const sourceIdx = outEdges.findIndex((e) => e.id === edgeId);
  const targetIdx = inEdges.findIndex((e) => e.id === edgeId);

  return {
    sourceSlot:
      outEdges.length > 1 && sourceIdx >= 0
        ? { index: sourceIdx, total: outEdges.length }
        : undefined,
    targetSlot:
      inEdges.length > 1 && targetIdx >= 0
        ? { index: targetIdx, total: inEdges.length }
        : undefined,
  };
}

export function FloatingEdge({
  id,
  source,
  target,
  markerEnd,
  style = {},
}: EdgeProps) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);
  const edges = useEdges();

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sourceSlot, targetSlot } = getEdgeSlots(
    edges as { id: string; source: string; target: string }[],
    source,
    target,
    id
  );

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode as Parameters<typeof getEdgeParams>[0],
    targetNode as Parameters<typeof getEdgeParams>[1],
    sourceSlot,
    targetSlot
  );

  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={typeof markerEnd === "string" ? markerEnd : undefined}
      fill="none"
      style={style}
    />
  );
}
