import {
  add,
  distance2,
  set,
  sub,
  v2,
  magnitude,
  scale,
} from './v2';
import { Integratable } from './common-types';

export function solveDistanceConstraint(p1: Integratable, p1mass: number, p2: Integratable, p2mass: number, goal: number) {
  const imass1 = 1/(p1mass || 1);
  const imass2 = 1/(p2mass || 1);
  const imass = imass1 + imass2;

  // Current relative vector
  const delta = sub(v2(), p2.cpos, p1.cpos);
  const deltaMag = magnitude(delta);

  // Difference between current distance and goal distance
  const diff = (deltaMag - goal) / deltaMag;

  // approximate mass
  scale(delta, delta, diff / imass);

  const p1correction = scale(v2(), delta, imass1);
  const p2correction = scale(v2(), delta, imass2);

  if (p1mass) add(p1.cpos, p1.cpos, p1correction);
  if (p2mass) sub(p2.cpos, p2.cpos, p2correction);
};

