import {
  add,
  dot,
  normalize,
  scale,
  sub,
  v2,
} from './v2';

// Registers / Preallocations



export default (
  cpos1, ppos1, mass1,
  cpos2, ppos2, mass2,
  ppos1out, ppos2out
) => {

  const basis = sub(v2(), cpos1, cpos2);
  normalize(basis, basis);
  const basisNeg = scale(v2(), basis, -1);

  // calculate x-direction velocity vector and perpendicular y-vector for box 1
  const vel1 = sub(v2(), cpos1, ppos1);
  const x1 = dot(basis, vel1);
  const vel1x = scale(v2(), basis, x1);
  const vel1y = sub(v2(), vel1, vel1x);

  // calculate x-direction velocity vector and perpendicular y-vector for box 2
  const vel2 = sub(v2(), cpos2, ppos2);
  const x2 = dot(basisNeg, vel2);
  const vel2x = scale(v2(), basisNeg, x2);
  const vel2y = sub(v2(), vel2, vel2x);

  const massTotal = mass1 + mass2;

  const newVel1 = v2();

  // equations of motion for box1
  const t1 = scale(v2(), vel1x, (mass1 - mass2) / massTotal);
  const t2 = scale(v2(), vel2x, (2 * mass2) / massTotal);
  add(newVel1, t1, t2);
  add(newVel1, newVel1, vel1y);

  const newVel2 = v2();

  // equations of motion for box2
  const u1 = scale(v2(), vel1x, (2 * mass1) / massTotal);
  const u2 = scale(newVel2, vel2x, (mass2 - mass1) / massTotal);
  add(newVel2, u1, u2);
  add(newVel2, newVel2, vel2y);

  // output new velocity of box1 and box2
  sub(ppos1out, cpos1, newVel1);
  sub(ppos2out, cpos2, newVel2);
}