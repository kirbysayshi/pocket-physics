import { sub, v2, Vector2 } from "./v2";
import { segmentIntersection } from "./segmentintersection";

import Debug from "debug";
import { Integratable } from "./common-types";

const debug = Debug("pocket-physics:rewind-to-collision-point");

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

  debug("hasTunneled %s", hasTunneled);

  // Translate point3 to tunnelPoint
  sub(offset, point3.cpos, tunnelPoint);
  debug("offset %o", offset);
  debug("point3.cpos %o", point3.cpos);
  debug("point3.ppos %o", point3.ppos);

  sub(point3.cpos, point3.cpos, offset);
  sub(point3.ppos, point3.ppos, offset);
  debug("corrected point3.cpos %o", point3.cpos);
  debug("corrected point3.ppos %o", point3.ppos);
}

function debuggerIfNaN(point: Vector2) {
  if (isNaN(point.x) || isNaN(point.y)) {
    debugger;
  }
}
