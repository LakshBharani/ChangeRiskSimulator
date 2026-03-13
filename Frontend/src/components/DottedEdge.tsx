import { getSmoothStepPath, BaseEdge, type EdgeProps } from '@xyflow/react';

export function DottedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const stroke = (style?.stroke as string) ?? '#94a3b8';
  const strokeWidth = (style?.strokeWidth as number) ?? 2;

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        stroke,
        strokeWidth,
        fill: 'none',
        strokeDasharray: '6 4',
      }}
    />
  );
}
