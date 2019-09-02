import { add, magnitude, normalize, scale, set, v2 } from "./v2";
import { Integratable, VelocityDerivable } from "./common-types";
const accel1 = v2();

export function solveGravitation(
  p1: Integratable,
  p1mass: number,
  p2: VelocityDerivable,
  p2mass: number,
  gravityConstant = 0.99
) {
  // handle either obj not having mass
  if (p1mass <= 0 || p2mass <= 0) return;

  let mag: number;
  let factor: number;

  const diffx = p2.cpos.x - p1.cpos.x;
  const diffy = p2.cpos.y - p1.cpos.y;

  set(accel1, diffx, diffy);
  mag = magnitude(accel1);

  // Prevent divide by zero.
  mag = mag === 0 ? 1 : mag;

  // Newton's Law of Universal Gravitation -- Vector Form!
  factor = gravityConstant * ((p1mass * p2mass) / (mag * mag));

  // scale by gravity acceleration
  normalize(accel1, accel1);
  scale(accel1, accel1, factor);

  // add the acceleration from gravity to p1 accel
  add(p1.acel, p1.acel, accel1);
}
