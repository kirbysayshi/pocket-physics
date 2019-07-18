import {
  add,
  dot,
  magnitude,
  normalize,
  scale,
  set,
  copy,
  sub,
  v2,
  Vector2
} from "./v2";

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

// TODO: Put this somewhere...
const EPSILON = 0.0001;

// TODO: change this API to accept numbers (x, y) instead of vectors

// friction calc: sqrt(friction1*friction2)
// restitution: box2d: https://github.com/erincatto/Box2D/blob/6a69ddbbd59b21c0d6699c43143b4114f7f92e21/Box2D/Box2D/Dynamics/Contacts/b2Contact.h#L42-L47
// Math.max(restitution1, restitution2);

export const collisionResponseAABB = (
  cpos1: Vector2,
  ppos1: Vector2,
  mass1: number,
  restitution1: number,
  staticFriction1: number,
  dynamicFriction1: number,
  cpos2: Vector2,
  ppos2: Vector2,
  mass2: number,
  restitution2: number,
  staticFriction2: number,
  dynamicFriction2: number,
  collisionNormal: Vector2,
  vel1out: Vector2,
  vel2out: Vector2
) => {
  // blank out all preallocated vectors.
  set(basis, 0, 0);
  set(basisNeg, 0, 0);
  set(vel1, 0, 0);
  set(vel1x, 0, 0);
  set(vel1y, 0, 0);
  set(vel2, 0, 0);
  set(vel2x, 0, 0);
  set(vel2y, 0, 0);
  set(newVel1, 0, 0);
  set(newVel2, 0, 0);
  set(t1, 0, 0);
  set(t2, 0, 0);
  set(u1, 0, 0);
  set(u2, 0, 0);

  // If collisionNormal is provided, use it. Otherwise, use midpoint between
  // current positions as axis of collision. Midpoint will model a circular
  // collision if used.
  if (collisionNormal && (collisionNormal.x !== 0 || collisionNormal.y !== 0)) {
    set(basis, collisionNormal.x, collisionNormal.y);
  } else {
    sub(basis, cpos1, cpos2);
    normalize(basis, basis);
  }

  scale(basisNeg, basis, -1);

  //const friction;
  // Take max of restitutions, like box2d does.
  // https://github.com/erincatto/Box2D/blob/6a69ddbbd59b21c0d6699c43143b4114f7f92e21/Box2D/Box2D/Dynamics/Contacts/b2Contact.h#L42-L47
  // "for example, a superball bounces on everything"
  const restitution = restitution1 > restitution2 ? restitution1 : restitution2;
  const massTotal = mass1 + mass2;
  const e = 1 + restitution;

  // I = (1+e)*N*(Vr • N) / (1/Ma + 1/Mb)
  // Va -= I * 1/Ma
  // Vb += I * 1/Mb
  //sub(vel1, cpos1, ppos1);
  //sub(vel2, cpos2, ppos2);
  //const relativeVelocity = sub(vel1, vel2);
  //const I = v2();
  //scale(I, normal, (1 + restitution) * dot(relativeVelocity, normal));
  //scale(I, I, 1 / (1/mass1 + 1/mass2));

  // "x" and "y" in the following sections are shorthand for:
  // x: component of the box velocity parallel to the collision normal
  // y: the rest of the collision velocity

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

  // equations of motion for box1
  scale(t1, vel1x, (mass1 - mass2) / massTotal);
  scale(t2, vel2x, (e * mass2) / massTotal);
  add(newVel1, t1, t2);
  add(newVel1, newVel1, vel1y);

  // equations of motion for box2
  scale(u1, vel1x, (e * mass1) / massTotal);
  scale(u2, vel2x, (mass2 - mass1) / massTotal);
  add(newVel2, u1, u2);
  add(newVel2, newVel2, vel2y);

  // new relative velocity
  const rv = add(v2(), newVel1, newVel2);

  // tangent to relative velocity vector
  const reg1 = v2();
  scale(reg1, basis, dot(rv, basis));
  const tangent = sub(v2(), rv, reg1);
  normalize(tangent, tangent);

  // magnitude of relative velocity in tangent direction
  let jt = -dot(rv, tangent);
  jt /= 1 / (mass1 + mass2); // not sure about this...
  // https://github.com/RandyGaul/ImpulseEngine/blob/d12af9c95555244a37dce1c7a73e60d5177df652/Manifold.cpp#L103

  const jtMag = Math.abs(jt);

  // only apply significant friction
  if (jtMag > EPSILON) {
    // magnitudes of velocity along the collision tangent, hopefully.
    const vel1ymag = magnitude(vel1y);
    const vel2ymag = magnitude(vel2y);

    // compute Coulumb's law (choosing dynamic vs static friction)
    const frictionImpulse1 = v2();
    const frictionImpulse2 = v2();

    // TODO: may need to use Math.max(Math.abs(vel1ymag, vel2ymag)) when
    // choosing to incorporate velocity magnitude into the friction calc.
    // A stationary box getting hit currently receives perfect energy
    // transfer, since its vel2ymag is 0.

    if (jtMag < vel1ymag * staticFriction1) {
      scale(frictionImpulse1, tangent, staticFriction1);
    } else {
      scale(frictionImpulse1, tangent, -vel1ymag * dynamicFriction1);
    }

    if (jtMag < vel2ymag * staticFriction2) {
      scale(frictionImpulse2, tangent, staticFriction2);
    } else {
      scale(frictionImpulse2, tangent, -vel2ymag * dynamicFriction2);
    }

    add(newVel1, newVel1, frictionImpulse1);
    add(newVel2, newVel2, frictionImpulse2);
  }

  // output new velocity of box1 and box2
  copy(vel1out, newVel1);
  copy(vel2out, newVel2);
};
