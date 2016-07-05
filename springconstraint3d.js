import v3 from './v3';
const debug = require('debug')('pocket-physics:springconstraint');

export default function solve(follower, followerMass, target, targetMass, stiffness, damping) {
  const p1 = follower;
  const p2 = target;
  const p1mass = followerMass;
  const p2mass = targetMass;

  const imass1 = 1/(p1mass || 1);
  const imass2 = 1/(p2mass || 1);
  const imass = imass1 + imass2;

  // Current relative vector
  const delta = v3.sub(v3(), p2.cpos, p1.cpos);

  debug('target', target)
  debug('delta', delta)

  //v3.scale(delta, delta, stiffness * damping * imass2);
  v3.scale(delta, delta, stiffness * damping * imass1);

  debug('delta * stiffness * damping', delta)

  v3.add(p1.acel, p1.acel, delta);
};

