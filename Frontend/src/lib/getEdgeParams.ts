import { Position } from "@xyflow/react";

interface InternalNode {
  measured?: { width: number; height: number };
  internals: { positionAbsolute: { x: number; y: number } };
}

/** Get point on rectangle boundary at given angle (radians, 0 = right, PI/2 = down) */
function getPointOnRectBoundary(
  cx: number,
  cy: number,
  width: number,
  height: number,
  angleRad: number
): { x: number; y: number } {
  const hw = width / 2;
  const hh = height / 2;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  let tMin = Infinity;
  if (Math.abs(cos) > 1e-6) {
    const tRight = hw / cos;
    const yRight = cy + tRight * sin;
    if (tRight > 0 && Math.abs(yRight - cy) <= hh) tMin = Math.min(tMin, tRight);
    const tLeft = -hw / cos;
    const yLeft = cy + tLeft * sin;
    if (tLeft > 0 && Math.abs(yLeft - cy) <= hh) tMin = Math.min(tMin, tLeft);
  }
  if (Math.abs(sin) > 1e-6) {
    const tBottom = hh / sin;
    const xBottom = cx + tBottom * cos;
    if (tBottom > 0 && Math.abs(xBottom - cx) <= hw) tMin = Math.min(tMin, tBottom);
    const tTop = -hh / sin;
    const xTop = cx + tTop * cos;
    if (tTop > 0 && Math.abs(xTop - cx) <= hw) tMin = Math.min(tMin, tTop);
  }
  if (tMin === Infinity) tMin = 0;

  return {
    x: cx + tMin * cos,
    y: cy + tMin * sin,
  };
}

function angleToPosition(angleRad: number): Position {
  const deg = (angleRad * 180) / Math.PI;
  if (deg >= -45 && deg < 45) return Position.Right;
  if (deg >= 45 && deg < 135) return Position.Bottom;
  if (deg >= 135 || deg < -135) return Position.Left;
  return Position.Top;
}

export interface EdgeSlot {
  index: number;
  total: number;
}

export function getEdgeParams(
  source: InternalNode,
  target: InternalNode,
  sourceSlot?: EdgeSlot,
  targetSlot?: EdgeSlot
) {
  const sw = source.measured?.width ?? 180;
  const sh = source.measured?.height ?? 56;
  const sp = source.internals.positionAbsolute;
  const scx = sp.x + sw / 2;
  const scy = sp.y + sh / 2;

  const tw = target.measured?.width ?? 180;
  const th = target.measured?.height ?? 56;
  const tp = target.internals.positionAbsolute;
  const tcx = tp.x + tw / 2;
  const tcy = tp.y + th / 2;

  let sourceAngle: number;
  let targetAngle: number;

  if (sourceSlot && sourceSlot.total > 1) {
    const step = (2 * Math.PI) / sourceSlot.total;
    sourceAngle = sourceSlot.index * step - Math.PI / 2;
  } else {
    sourceAngle = Math.atan2(tcy - scy, tcx - scx);
  }

  if (targetSlot && targetSlot.total > 1) {
    const step = (2 * Math.PI) / targetSlot.total;
    targetAngle = targetSlot.index * step - Math.PI / 2;
  } else {
    targetAngle = Math.atan2(scy - tcy, scx - tcx);
  }

  const sourcePoint = getPointOnRectBoundary(scx, scy, sw, sh, sourceAngle);
  const targetPoint = getPointOnRectBoundary(tcx, tcy, tw, th, targetAngle);

  return {
    sx: sourcePoint.x,
    sy: sourcePoint.y,
    tx: targetPoint.x,
    ty: targetPoint.y,
    sourcePos: angleToPosition(sourceAngle),
    targetPos: angleToPosition(targetAngle),
  };
}
