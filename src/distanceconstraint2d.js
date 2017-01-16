import {
  add,
  distance2,
  set,
  sub,
} from './v2';
const debug = require('debug')('pocket-physics:distanceconstraint');

export default function distanceConstraint2d(p1, p1mass, p2, p2mass, goal) {
  const imass1 = 1/(p1mass || 1);
  const imass2 = 1/(p2mass || 1);
  const imass = imass1 + imass2;

  // Current relative vector
  const delta = v2.sub(v2(), p2.cpos, p1.cpos);
  const deltaMag = v2.magnitude(delta);

  debug('goal', goal)
  debug('delta', delta)

  // Difference between current distance and goal distance
  const diff = (deltaMag - goal) / deltaMag;

  debug('delta mag', deltaMag)
  debug('diff', diff)

  // approximate mass
  v2.scale(delta, delta, diff / imass);

  debug('delta diff/imass', delta)

  const p1correction = v2.scale(v2(), delta, imass1);
  const p2correction = v2.scale(v2(), delta, imass2);

  debug('p1correction', p1correction)
  debug('p2correction', p2correction)

  if (p1mass) v2.add(p1.cpos, p1.cpos, p1correction);
  if (p2mass) v2.sub(p2.cpos, p2.cpos, p2correction);
};

