import { useCallback } from "react";
import type { Node, Edge } from "@xyflow/react";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 56;
const BASE_RADIUS = 240;
const RADIUS_PER_LEVEL = 50;
const PADDING = 24;
const MIN_CENTER_DIST = Math.hypot(NODE_WIDTH, NODE_HEIGHT) + PADDING;

function nudgeApart(
  positions: Map<string, { x: number; y: number }>,
  ids: string[]
): void {
  const minDist = MIN_CENTER_DIST;
  for (let iter = 0; iter < 30; iter++) {
    let moved = false;
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const pi = positions.get(ids[i])!;
        const pj = positions.get(ids[j])!;
        const cix = pi.x + NODE_WIDTH / 2;
        const ciy = pi.y + NODE_HEIGHT / 2;
        const cjx = pj.x + NODE_WIDTH / 2;
        const cjy = pj.y + NODE_HEIGHT / 2;
        const dx = cjx - cix;
        const dy = cjy - ciy;
        const dist = Math.hypot(dx, dy) || 0.01;
        if (dist >= minDist) continue;
        const push = (minDist - dist) / 2;
        const ux = dx / dist;
        const uy = dy / dist;
        pi.x -= ux * push;
        pi.y -= uy * push;
        pj.x += ux * push;
        pj.y += uy * push;
        moved = true;
      }
    }
    if (!moved) break;
  }
}

/**
 * Positions child nodes at angles matching the equidistant edge slots
 * so edges start straight. Adds collision resolution to prevent overlaps.
 */
export function useRadialLayout() {
  const getLayoutedElements = useCallback(
    (nodes: Node[], edges: Edge[], rootId?: string): Node[] => {
      if (nodes.length === 0) return nodes;

      const childrenMap = new Map<string, string[]>();
      for (const e of edges) {
        const list = childrenMap.get(e.source) ?? [];
        if (!list.includes(e.target)) list.push(e.target);
        childrenMap.set(e.source, list);
      }
      childrenMap.forEach((list) => list.sort((a, b) => a.localeCompare(b)));

      const root = rootId ?? nodes[0]?.id ?? "";
      const positions = new Map<string, { x: number; y: number }>();

      function layoutNode(
        id: string,
        parentPos: { x: number; y: number },
        angle: number,
        level: number
      ) {
        if (positions.has(id)) return;
        const radius = BASE_RADIUS + level * RADIUS_PER_LEVEL;
        const x = parentPos.x + radius * Math.cos(angle);
        const y = parentPos.y + radius * Math.sin(angle);
        positions.set(id, { x: x - NODE_WIDTH / 2, y: y - NODE_HEIGHT / 2 });

        const childIds = childrenMap.get(id) ?? [];
        const n = childIds.length;
        const step = n > 1 ? (2 * Math.PI) / n : 0;
        const startAngle = -Math.PI / 2;

        childIds.forEach((childId, i) => {
          const childAngle = n > 1 ? startAngle + i * step : startAngle;
          layoutNode(childId, { x, y }, childAngle, level + 1);
        });
      }

      positions.set(root, { x: -NODE_WIDTH / 2, y: -NODE_HEIGHT / 2 });
      const rootCenter = { x: 0, y: 0 };
      const childIds = childrenMap.get(root) ?? [];
      const n = childIds.length;
      const step = n > 1 ? (2 * Math.PI) / n : 0;
      const startAngle = -Math.PI / 2;

      childIds.forEach((childId, i) => {
        const angle = n > 1 ? startAngle + i * step : startAngle;
        layoutNode(childId, rootCenter, angle, 1);
      });

      for (const node of nodes) {
        if (!positions.has(node.id)) {
          positions.set(node.id, { x: 0, y: 0 });
        }
      }

      nudgeApart(positions, nodes.map((n) => n.id));

      return nodes.map((node) => ({
        ...node,
        position: positions.get(node.id) ?? { x: 0, y: 0 },
      }));
    },
    []
  );

  return getLayoutedElements;
}
