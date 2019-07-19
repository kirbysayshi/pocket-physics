import { add, distance2, set, sub } from "./v2";
import { VelocityDerivable } from "./common-types";

// Preallocations!
const vel1 = { x: 0, y: 0 };
const vel2 = { x: 0, y: 0 };
const diff = { x: 0, y: 0 };
const move = { x: 0, y: 0 };

// It's very important that this function not do any distance checking.
// It is assumed that if this function is called, then the points are
// definitely colliding, and that after being called with preserveInertia
// === false, another call with === true should be made, even if the first
// calculation has moved the points away from physically touching.

export const collideCircleCircle = (
  p1: VelocityDerivable,
  p1radius: number,
  p1mass: number,
  p2: VelocityDerivable,
  p2radius: number,
  p2mass: number,
  preserveInertia: boolean,
  damping: number
) => {
  const dist2 = distance2(p1.cpos, p2.cpos);
  const target = p1radius + p2radius;
  const min2 = target * target;

  //if (dist2 > min2) return;

  sub(vel1, p1.cpos, p1.ppos);
  sub(vel2, p2.cpos, p2.ppos);

  sub(diff, p1.cpos, p2.cpos);
  const dist = Math.sqrt(dist2);
  let factor = (dist - target) / dist;

  // Avoid division by zero in case points are directly atop each other.
  if (dist === 0) factor = 1;

  const mass1 = p1mass > 0 ? p1mass : 1;
  const mass2 = p2mass > 0 ? p2mass : 1;
  const massT = mass1 + mass2;

  // Move a away
  move.x = diff.x * factor * (mass2 / massT);
  move.y = diff.y * factor * (mass2 / massT);
  if (p1mass > 0) {
    sub(p1.cpos, p1.cpos, move);
  }

  // Move b away
  move.x = diff.x * factor * (mass1 / massT);
  move.y = diff.y * factor * (mass1 / massT);
  if (p2mass > 0) {
    add(p2.cpos, p2.cpos, move);
  }

  if (!preserveInertia) return;

  damping = damping || 1;

  const f1 = (damping * (diff.x * vel1.x + diff.y * vel1.y)) / (dist2 || 1);
  const f2 = (damping * (diff.x * vel2.x + diff.y * vel2.y)) / (dist2 || 1);

  vel1.x += (f2 * diff.x - f1 * diff.x) / (mass1 || 1); // * (mass2 / massT);
  vel2.x += (f1 * diff.x - f2 * diff.x) / (mass2 || 1); // * (mass1 / massT);
  vel1.y += (f2 * diff.y - f1 * diff.y) / (mass1 || 1); // * (mass2 / massT);
  vel2.y += (f1 * diff.y - f2 * diff.y) / (mass2 || 1); // * (mass1 / massT);

  if (p1mass > 0) set(p1.ppos, p1.cpos.x - vel1.x, p1.cpos.y - vel1.y);
  if (p2mass > 0) set(p2.ppos, p2.cpos.x - vel2.x, p2.cpos.y - vel2.y);
};
