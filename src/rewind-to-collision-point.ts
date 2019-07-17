import { sub, v2, Vector2 } from "./v2";
import { segmentIntersection } from "./segment-intersection";
import { Integratable } from "./common-types";

const tunnelPoint = v2();
const offset = v2();

export function rewindToCollisionPoint(
  point3: Integratable,
  point1: Integratable,
  point2: Integratable
) {
  // detect if a collision has occurred but would have been missed due to
  // point3 moving beyond the edge in one time step.

  const hasTunneled = segmentIntersection(
    point3.cpos,
    point3.ppos,
    point1.cpos,
    point2.cpos,
    tunnelPoint
  );

  if (!hasTunneled) return;

  // Translate point3 to tunnelPoint
  sub(offset, point3.cpos, tunnelPoint);
  
  sub(point3.cpos, point3.cpos, offset);
  sub(point3.ppos, point3.ppos, offset);
}

function debuggerIfNaN(point: Vector2) {
  if (isNaN(point.x) || isNaN(point.y)) {
    debugger;
  }
}
