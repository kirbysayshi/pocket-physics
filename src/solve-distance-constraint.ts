import { add, distance2, set, sub, v2, magnitude, scale } from "./v2";
import { Integratable } from "./common-types";

// negative or zero mass implies a fixed or "pinned" point
export function solveDistanceConstraint(
  p1: Integratable,
  p1mass: number,
  p2: Integratable,
  p2mass: number,
  goal: number,
  // number between 0 and 1
  stiffness = 1,
  // If false, correct the previous position in addition to the current position
  // when solving the constraint. While unnatural looking, this will prevent
  // "energy" (velocity) from being spontaneously created in the constraint
  // system.
  impartEnergy = true
): void {
  const mass1 = p1mass > 0 ? p1mass : 1;
  const mass2 = p2mass > 0 ? p2mass : 1;
  const imass1 = 1 / (mass1 || 1);
  const imass2 = 1 / (mass2 || 1);
  const imass = imass1 + imass2;

  // Current relative vector
  const delta = sub(v2(), p2.cpos, p1.cpos);
  const deltaMag = magnitude(delta);

  // nothing to do.
  if (deltaMag === 0) return;

  // Difference between current distance and goal distance
  const diff = (deltaMag - goal) / deltaMag;

  // TODO: is this even correct? Should mass come into effect here?
  // approximate mass
  scale(delta, delta, diff / imass);

  // TODO: not sure if this is the right place to apply stiffness.
  const p1correction = scale(v2(), delta, imass1 * stiffness);
  const p2correction = scale(v2(), delta, imass2 * stiffness);

  // Add correction to p1, but only if not "pinned".
  // If it's pinned and p2 is not, apply it to p2.
  if (p1mass > 0) {
    add(p1.cpos, p1.cpos, p1correction);
    if (!impartEnergy) add(p1.ppos, p1.ppos, p1correction);
  } else if (p2mass > 0) {
    sub(p2.cpos, p2.cpos, p1correction);
    if (!impartEnergy) sub(p2.ppos, p2.ppos, p1correction);
  }

  // Add correction to p2, but only if not "pinned".
  // If it's pinned and p1 is not, apply it to p1.
  if (p2mass > 0) {
    sub(p2.cpos, p2.cpos, p2correction);
    if (!impartEnergy) sub(p2.ppos, p2.ppos, p2correction);
  } else if (p1mass > 0) {
    add(p1.cpos, p1.cpos, p2correction);
    if (!impartEnergy) add(p1.ppos, p1.ppos, p2correction);
  }
}
