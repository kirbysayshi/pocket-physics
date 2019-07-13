import {
  add,
  distance2,
  set,
  sub,
  v2,
  magnitude,
  scale,
} from './v2';
const debug = require('debug')('pocket-physics:distanceconstraint');

export default function distanceConstraint2d(p1, p1mass, p2, p2mass, goal) {
  const imass1 = 1/(p1mass || 1);
  const imass2 = 1/(p2mass || 1);
  const imass = imass1 + imass2;

  // Current relative vector
  const delta = sub(v2(), p2.cpos, p1.cpos);
  const deltaMag = magnitude(delta);

  debug('goal', goal)
  debug('delta', delta)

  // Difference between current distance and goal distance
  const diff = (deltaMag - goal) / deltaMag;

  debug('delta mag', deltaMag)
  debug('diff', diff)

  // approximate mass
  scale(delta, delta, diff / imass);

  debug('delta diff/imass', delta)

  const p1correction = scale(v2(), delta, imass1);
  const p2correction = scale(v2(), delta, imass2);

  debug('p1correction', p1correction)
  debug('p2correction', p2correction)

  if (p1mass) add(p1.cpos, p1.cpos, p1correction);
  if (p2mass) sub(p2.cpos, p2.cpos, p2correction);
};

