import { set, Vector2, normalize, v2 } from "./v2";

// https://github.com/noonat/intersect/blob/master/intersect.js

export type AABBOverlapResult = {
  resolve: Vector2;
  hitPos: Vector2;
  normal: Vector2;
};

/**
 * Create a result object to use for overlap tests.
 */
export const createAABBOverlapResult = () => {
  return { resolve: v2(), hitPos: v2(), normal: v2() };
};

/**
 * Compute the "collision manifold" for two AABB, storing the result in `result`.
 * Note: The `normal` is always perpendicular to an AABB edge, which may produce
 * some slighly weird-looking collisions. `collisionResponseAABB()` will compute
 * a normal using the midpoints, which looks more natural.
 */
export const overlapAABBAABB = (
  center1X: number,
  center1Y: number,
  width1: number,
  height1: number,
  center2X: number,
  center2Y: number,
  width2: number,
  height2: number,
  result: AABBOverlapResult
) => {
  const dx = center2X - center1X;
  const px = width2 / 2 + width1 / 2 - Math.abs(dx);
  const dy = center2Y - center1Y;
  const py = height2 / 2 + height1 / 2 - Math.abs(dy);

  if (px <= 0) return null;
  if (py <= 0) return null;

  set(result.resolve, 0, 0);
  set(result.hitPos, 0, 0);
  set(result.normal, 0, 0);

  if (px < py) {
    const sx = dx < 0 ? -1 : 1;
    result.resolve.x = px * sx;
    result.normal.x = sx;
    // Really not sure about these values.
    result.hitPos.x = center1X + (width1 / 2) * sx;
    result.hitPos.y = center2Y;
  } else {
    const sy = dy < 0 ? -1 : 1;
    result.resolve.y = py * sy;
    result.normal.y = sy;
    // Really not sure about these values.
    result.hitPos.x = center2X;
    result.hitPos.y = center1Y + (height1 / 2) * sy;
  }

  return result;
};
