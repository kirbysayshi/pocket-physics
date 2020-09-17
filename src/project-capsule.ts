import { v2, Vector2, sub, normalize, scale, add } from "./v2";
import { Integratable } from "./common-types";

// preallocations
const v = v2();
const direction = v2();
const radiusSegment = v2();

/**
 * Compute the leading edge of a circular moving object given a radius: cpos + radius in the direction of velocity.
 */
export const projectCposWithRadius = (
  out: Vector2,
  p: Integratable,
  radius: number
) => {
  sub(v, p.cpos, p.ppos);
  normalize(direction, v);
  scale(radiusSegment, direction, radius);
  add(out, radiusSegment, p.cpos);
  return out;
}
