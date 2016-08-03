import {
  add,
  dot,
  normalize,
  scale,
  set,
  sub,
  v2,
} from './v2';

// Registers / Preallocations

const basis = v2();
const basisNeg = v2();

const vel1 = v2();
const vel1x = v2();
const vel1y = v2();

const vel2 = v2();
const vel2x = v2();
const vel2y = v2();

const newVel1 = v2();
const newVel2 = v2();

const t1 = v2();
const t2 = v2();

const u1 = v2();
const u2 = v2();

export default (
  cpos1, ppos1, mass1,
  cpos2, ppos2, mass2,
  ppos1out, ppos2out
) => {

  // blank out all preallocated vectors.
  basis.x = basisNeg.x = vel1.x = vel1x.x = vel1y.x = vel2.x = vel2x.x = vel2y.x = newVel1.x = newVel2.x = t1.x = t2.x = u1.x = u2.x =
  basis.y = basisNeg.y = vel1.y = vel1x.y = vel1y.y = vel2.y = vel2x.y = vel2y.y = newVel1.y = newVel2.y = t1.y = t2.y = u1.y = u2.y = 0;

  sub(basis, cpos1, cpos2);
  normalize(basis, basis);
  scale(basisNeg, basis, -1);

  // calculate x-direction velocity vector and perpendicular y-vector for box 1
  sub(vel1, cpos1, ppos1);
  const x1 = dot(basis, vel1);
  scale(vel1x, basis, x1);
  sub(vel1y, vel1, vel1x);

  // calculate x-direction velocity vector and perpendicular y-vector for box 2
  sub(vel2, cpos2, ppos2);
  const x2 = dot(basisNeg, vel2);
  scale(vel2x, basisNeg, x2);
  sub(vel2y, vel2, vel2x);

  const massTotal = mass1 + mass2;

  // equations of motion for box1
  scale(t1, vel1x, (mass1 - mass2) / massTotal);
  scale(t2, vel2x, (2 * mass2) / massTotal);
  add(newVel1, t1, t2);
  add(newVel1, newVel1, vel1y);

  // equations of motion for box2
  scale(u1, vel1x, (2 * mass1) / massTotal);
  scale(u2, vel2x, (mass2 - mass1) / massTotal);
  add(newVel2, u1, u2);
  add(newVel2, newVel2, vel2y);

  // output new velocity of box1 and box2
  sub(ppos1out, cpos1, newVel1);
  sub(ppos2out, cpos2, newVel2);
}