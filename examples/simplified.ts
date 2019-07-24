// import { add, sub, v2, scale } from "../src";

// // need to have:
// // verlet accelerate
// // collision detection manifold aka overlap (type, normal, penetration depth, bodies(mass, friction))
// //    circle vs circle
// //    circle vs edge (which is actually a circle/point)
// //    circle vs aabb? it's just an edge, really
// // collision response given a manifold, including friction
// // verlet inertia
// // static edges (aka cannot pass through?) vs dynamic body edges

// // ideal step:
// // know what is colliding/overlapping <--- very important for a game-like thing
// // decide if it should be handled in engine or just destroy (for example)
// // ECS friendly

// type Vector2 = {
//   x: 0;
//   y: 0;
// };

// type VelocityDerivable = {
//   cpos: Vector2;
//   ppos: Vector2;
// };

// type Integratable = {
//   acel: Vector2;
// } & VelocityDerivable;

// type Particle = {
//   mass: number;
//   radius: number;
// } & Integratable;

// type ParticleParticleContact = {
//   kind: "p-p";
//   p1: Particle;
//   p2: Particle;
//   point: Vector2; // point of collision
//   depth: number;
//   normal: Vector2;
// };

// type ParticleDynamicEdgeContact = {
//   kind: "p-de";
//   p1: Particle;
//   p2: DynamicEdge;
//   edgeDirection: Vector2;
//   projection: number; // aka t, or how far along the edge the collision occurred
//   depth: number;
//   normal: Vector2;
// };

// type ParticleStaticEdgeContact = {
//   kind: "p-se";
//   p1: Particle;
//   p2: StaticEdge;
//   edgeDirection: Vector2;
//   projection: number; // aka t, or how far along the edge the collision occurred
//   depth: number;
//   normal: Vector2;
// };

// type Contact =
//   | ParticleParticleContact
//   | ParticleDynamicEdgeContact
//   | ParticleStaticEdgeContact;

// type ParticleParticleCorrection = {
//   kind: 'p-p';
//   overlap: ParticleParticleContact;
//   // These are the offsets required to put p1/p2 into non-conflicting positions.
//   p1: VelocityDerivable;
//   p2: VelocityDerivable;
// };

// type ParticleDynamicEdgeCorrection = {
//   kind: 'p-de';
//   overlap: ParticleDynamicEdgeContact;
//   // offset for the particle
//   p: VelocityDerivable;
//   // offsets for the endpoints
//   e1: VelocityDerivable;
//   e2: VelocityDerivable;
// };

// type ParticleStaticEdgeCorrection = {
//   kind: 'p-se';
//   overlap: ParticleStaticEdgeContact;
//   // offset for the particle
//   p: VelocityDerivable;
// };

// type Correction =
//   | ParticleParticleCorrection
//   | ParticleDynamicEdgeCorrection
//   | ParticleStaticEdgeCorrection;


// type DistanceEqualityConstraint = {
//   kind: 'd-e';
//   p1: Particle;
//   p2: Particle;
//   goal: number;
// };

// type Constraint = DistanceEqualityConstraint;

// type DistanceEqualityConstraintResolver = {
//   kind: 'd-e';
//   constraint: DistanceEqualityConstraint;
//   p1: Vector2;
//   p2: Vector2;
// }

// type ConstraintResolver = DistanceEqualityConstraintResolver;

// type DynamicEdge = {
//   p1: Particle;
//   p2: Particle;
// };

// // Not sure if these should be points or have mass, since it's basically the same as a Dynamic Edge
// type StaticEdge = {
//   p1: Vector2;
//   p2: Vector2;
// };

// function accelerate(p1: Particle, dt: number) {}

// function inertia(p1: Particle) {}

// function tick(
//   dt: number,
//   particles: Particle[],
//   constraints: DistanceEqualityConstraint[],
//   dynamicEdges: DynamicEdge[],
//   staticEdges: StaticEdge[],
//   collisionIterationCount: number
// ) {

//   for (let i = 0; i < particles.length; i++) {
//     accelerate(particles[i], dt);
//   }

//   for (let i = 0; i < collisionIterationCount; i++) {
//     const m1 = findParticleParticleContacts([], particles);
//     const m2 = findParticleDynamicEdgeContacts(
//       [],
//       particles,
//       dynamicEdges
//     );
//     for (let j = 0; j < m1.length; j++) {
//       const manifold = m1[j];
//       const resolved = resolveContact(manifold);
//       applyResolvedManifold(resolved);
//     }
//     for (let j = 0; j < m2.length; j++) {
//       const manifold = m2[j];
//       const resolved = resolveContact(manifold);
//       applyResolvedManifold(resolved);
//     }
//   }

//   for (let i = 0; i < constraints.length; i++) {
//     const constraint = constraints[i];
//     const resolved = resolveConstraint(constraint);
//     applyResolvedConstraint(resolved);
//   }

//   for (let i = 0; i < particles.length; i++) {
//     inertia(particles[i]);
//   }

//   const m3 = findParticleStaticEdgeContacts([], particles, staticEdges);
//   for (let j = 0; j < m3.length; j++) {
//     const manifold = m3[j];
//     const resolved = resolveContact(manifold);
//     applyResolvedManifold(resolved);
//   }
// }

// function findParticleParticleContacts(
//   manifoldsOut: Contact[],
//   particles: Particle[]
// ): ParticleParticleContact[] {
//   for (let i = 0; i < particles.length; i++) {
//     const p1 = particles[i];
//     for (let j = i + 1; j < particles.length; j++) {
//       const p2 = particles[j];

//       const x = p2.cpos.x - p1.cpos.x;
//       const y = p2.cpos.y - p1.cpos.y;
//       const rad = p1.radius + p2.radius;
//       const overlapping = x * x + y * y < rad * rad;

//       if (!overlapping) continue;

//       // manifoldsOut.push({
//       //   p1, p2,
//       // });
//     }
//   }
// }

// function findParticleDynamicEdgeContacts(
//   manifoldsOut: Contact[],
//   particle: Particle[],
//   edges: DynamicEdge[]
// ): ParticleDynamicEdgeContact[] { return manifoldsOut }

// function findParticleStaticEdgeContacts(
//   manifoldsOut: Contact[],
//   particle: Particle[],
//   edges: StaticEdge[]
// ): ParticleStaticEdgeContact[] {}

// function resolveConstraint(constraint: Constraint): ConstraintResolver {
//   if (constraint.kind === 'd-e') {

//   }
// }

// function applyResolvedConstraint(manifold: ConstraintResolver) {
//   if (manifold.kind === 'd-e') {

//   }
// }

// function resolveContact(manifold: Contact): Correction {
//   if (manifold.kind === "p-p") {
//     // particle-particle
//   } else if (manifold.kind === "p-de") {
//     // particle-dynamic-edge
//   } else if (manifold.kind === "p-se") {
//     // particle-static-edge
//   }
// }

// function applyResolvedManifold(
//   resolved: Correction
// ) {
//   if (resolved.kind === "p-p") {
//     // particle-particle
//     add(resolved.overlap.p1.cpos, resolved.overlap.p1.cpos, resolved.p1.cpos);
//     add(resolved.overlap.p1.ppos, resolved.overlap.p1.ppos, resolved.p1.ppos);
//     add(resolved.overlap.p2.cpos, resolved.overlap.p2.cpos, resolved.p2.cpos);
//     add(resolved.overlap.p2.ppos, resolved.overlap.p2.ppos, resolved.p2.ppos);
//   } else if (resolved.kind === "p-de") {
//     // particle-dynamic-edge
//   } else if (resolved.kind === "p-se") {
//     // particle-static-edge
//   }
// }
