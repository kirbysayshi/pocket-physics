import { add, scale, sub, v2 } from "./v2";
import { Integratable } from "./common-types";

export function solveSpringConstraint(
  follower: Integratable,
  followerMass: number,
  target: Integratable,
  targetMass: number,
  stiffness: number,
  damping: number
) {
  const p1 = follower;
  const p2 = target;
  const p1mass = followerMass;
  const p2mass = targetMass;

  const imass1 = 1 / (p1mass || 1);
  const imass2 = 1 / (p2mass || 1);
  const imass = imass1 + imass2;

  // Current relative vector
  const delta = sub(v2(), p2.cpos, p1.cpos);

  //scale(delta, delta, stiffness * damping * imass2);
  scale(delta, delta, stiffness * damping * imass1);

  add(p1.acel, p1.acel, delta);
}
