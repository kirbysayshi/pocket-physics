import { dot, normalize, scale, sub, v2, Vector2 } from "./v2";

export const aabbFriction = (
  cpos1: Vector2,
  ppos1: Vector2,
  mass1: number,
  staticFriction1: number,
  dynamicFriction1: number,
  cpos2: Vector2,
  ppos2: Vector2,
  mass2: number,
  staticFriction2: number,
  dynamicFriction2: number,
  collisionNormal: Vector2,
  vel1out: Vector2,
  vel2out: Vector2
) => {
  const vel1 = v2();
  const vel2 = v2();

  // Compute current velocities of each body
  sub(vel1, cpos1, ppos1);
  sub(vel2, cpos2, ppos2);

  // assume collision has already modified velocity
  // Compute relative velocity vector.
  const relativeVelocity = v2();
  sub(relativeVelocity, vel2, vel1);

  // Normalized tangent to the velocity vector
  const tangent = v2();
  const reg1 = v2();
  const impulseScalar = dot(relativeVelocity, collisionNormal);
  scale(reg1, collisionNormal, impulseScalar);
  sub(tangent, relativeVelocity, reg1);
  normalize(tangent, tangent);

  // Magnitude of friction to apply along friction vector
  const jt = dot(relativeVelocity, tangent) / (1 / mass1 + 1 / mass2);

  // Use pythagorean theorum as approximation for friction
  const muStatic = Math.sqrt(
    staticFriction1 * staticFriction1 + staticFriction2 * staticFriction2
  );
  const muDynamic = Math.sqrt(
    dynamicFriction1 * dynamicFriction1 + dynamicFriction2 * dynamicFriction2
  );

  const frictionImpulse = v2();

  // technically impulse scalar should be the relative velocity * normal
  // _before_ the collision is resolved, but let's see what we get here.
  // Since it's perfectly elastic until friction, it might not matter.

  if (Math.abs(jt) < impulseScalar * muStatic) {
    scale(frictionImpulse, tangent, jt);
  } else {
    scale(frictionImpulse, tangent, -frictionImpulse * muDynamic);
  }

  scale(vel1out, frictionImpulse, (1 / mass1) * -1);
  scale(vel2out, frictionImpulse, 1 / mass2);
};
