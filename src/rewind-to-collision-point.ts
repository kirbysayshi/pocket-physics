import { sub, v2, Vector2, scale, normalize, add } from "./v2";
import { segmentIntersection } from "./segment-intersection";
import { Integratable } from "./common-types";

const tunnelPoint = v2();
const offset = v2();

const v = v2();
const direction = v2();
const radiusSegment = v2();
const cposIncludingRadius = v2();

export function rewindToCollisionPoint(
  point3: Integratable,
  radius3: number,
  point1: Integratable,
  point2: Integratable
): boolean {
  // detect if a collision has occurred but would have been missed due to
  // point3 moving beyond the edge in one time step.
  
  // TODO: this should accept some sort of manifold or collision contact object,
  // not randum args (radius, etc). Without a manifold it's imposible to know 
  // if the point "tunneled" due to a collision or the result of _resolving_
  // a collision!

  // Compute where the cpos would be if the segment actually included the
  // radius.
  // Without this, we would rewind to the point3 center, and the direction
  // of two points colliding with each other exactly is undefined.
  sub(v, point3.cpos, point3.ppos);
  normalize(direction, v);
  scale(radiusSegment, direction, radius3);
  add(cposIncludingRadius, radiusSegment, point3.cpos);

  const hasTunneled = segmentIntersection(
    cposIncludingRadius,
    point3.ppos,
    point1.cpos,
    point2.cpos,
    tunnelPoint
  );

  if (!hasTunneled) return false;

  // Translate point3 to tunnelPoint, including the radius of the point.
  sub(offset, cposIncludingRadius, tunnelPoint);
  
  sub(point3.cpos, point3.cpos, offset);
  sub(point3.ppos, point3.ppos, offset);
  return true;
}

function debuggerIfNaN(point: Vector2) {
  if (isNaN(point.x) || isNaN(point.y)) {
    debugger;
  }
}
