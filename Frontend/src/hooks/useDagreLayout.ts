import { useCallback } from 'react';
import dagre from '@dagrejs/dagre';
import type { Node, Edge } from '@xyflow/react';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 56;

export function useDagreLayout() {
  const getLayoutedElements = useCallback(
    (nodes: Node[], edges: Edge[], direction: 'TB' | 'LR' = 'TB') => {
      const g = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
      g.setGraph({ rankdir: direction, ranksep: 80, nodesep: 60 });

      nodes.forEach((node) => {
        g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
      });

      edges.forEach((edge) => {
        g.setEdge(edge.source, edge.target);
      });

      dagre.layout(g);

      const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = g.node(node.id);
        return {
          ...node,
          position: {
            x: nodeWithPosition.x - NODE_WIDTH / 2,
            y: nodeWithPosition.y - NODE_HEIGHT / 2,
          },
        };
      });

      return layoutedNodes;
    },
    []
  );

  return getLayoutedElements;
}
