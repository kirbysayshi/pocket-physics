import {
  add,
  distance2,
  set,
  sub,
  v2,
  dot,
  scale,
  distance,
  copy,
  normalize
} from './v2';
import collideCircleCircle from './collidecirclecircle';
const debug = require('debug')('pocket-physics:collide-circle-edge');

// Preallocations
const edgeDir = v2();
const edge = v2();
const prevEdge = v2();
const hypo = v2();
const epDiff = v2();
const correction = v2();
const collisionPoint = v2();
const tunnelPoint = v2();

const ep = {
  cpos: v2(),
  ppos: v2()
};

const epBefore = {
  cpos: v2(),
  ppos: v2()
};

export default function collide(
  point3, radius3, mass3,
  point1, mass1,
  point2, mass2,
  preserveInertia, damping
) {
  debug('point3 %o', point3);
  debug('endpoint1 %o', point1);
  debug('endpoint2 %o', point2);

  // Edge direction (edge in local space)
  sub(edge, point2.cpos, point1.cpos);

  // Normalize collision edge (assume collision axis is edge)
  normalize(edgeDir, edge);

  // Vector from endpoint1 to particle
  sub(hypo, point3.cpos, point1.cpos);

  debug('edge %o', edge);
  debug('hypo %o', hypo);
  debug('edgeDir %o', edgeDir);

  // Where is the particle on the edge, before, after, or on?
  // Also used for interpolation later.
  const projection = dot(edge, hypo);
  const maxDot = dot(edge, edge);
  const edgeMag = Math.sqrt(maxDot);

  debug('projection %d', projection);
  debug('maxDot %d', maxDot);
  debug('edgeMag %d', edgeMag);

  // Colliding beyond the edge...
  if (projection < 0 || projection > maxDot) return;

  // Create interpolation factor of where point closest
  // to particle is on the line.
  const t = projection / maxDot;
  const u = 1 - t;

  debug('t %d, u %d', t, u);

  // Find the point of collision on the edge.
  scale(collisionPoint, edgeDir, t * edgeMag);
  add(collisionPoint, collisionPoint, point1.cpos);
  const dist = distance(collisionPoint, point3.cpos);

  debug('collision distance %d, radius %d', dist, radius3);

  // Bail if point and edge are too far apart.
  if (dist > radius3) return;

  // Distribute mass of colliding point into two fake points
  // and use those to collide against each endpoint independently.

  const standinMass1 = u * mass3;
  const standinMass2 = t * mass3;

  debug('standinMass 1,2 %d,%d', standinMass1, standinMass2);

  const standin1 = {
    cpos: v2(),
    ppos: v2()
  };

  const standin2 = {
    cpos: v2(),
    ppos: v2()
  };

  // Slide standin1 along edge to be in front of endpoint1
  scale(standin1.cpos, edgeDir, t * edgeMag);
  sub(standin1.cpos, point3.cpos, standin1.cpos);
  scale(standin1.ppos, edgeDir, t * edgeMag);
  sub(standin1.ppos, point3.ppos, standin1.ppos);

  // Slide standin2 along edge to be in front of endpoint2
  scale(standin2.cpos, edgeDir, u * edgeMag);
  add(standin2.cpos, point3.cpos, standin2.cpos);
  scale(standin2.ppos, edgeDir, u * edgeMag);
  add(standin2.ppos, point3.ppos, standin2.ppos);

  debug('standin1 %o', standin1);
  debug('standin2 %o', standin2);

  const standin1Before = {
    cpos: v2(),
    ppos: v2()
  };

  const standin2Before = {
    cpos: v2(),
    ppos: v2()
  };

  // Stash state of standins
  copy(standin1Before.cpos, standin1.cpos);
  copy(standin1Before.ppos, standin1.ppos);
  copy(standin2Before.cpos, standin2.cpos);
  copy(standin2Before.ppos, standin2.ppos);

  const edgeRadius = 0;

  debug('collide standin1 with endpoint1');

  // Collide standins with endpoints
  collideCircleCircle(
    standin1, radius3, standinMass1,
    point1, edgeRadius, mass1,
    preserveInertia, damping);

  debug('collide standin2 with endpoint2');

  collideCircleCircle(
    standin2, radius3, standinMass2,
    point2, edgeRadius, mass2,
    preserveInertia, damping);

  const standin1Delta = {
    cpos: v2(),
    ppos: v2()
  };

  const standin2Delta = {
    cpos: v2(),
    ppos: v2()
  };

  // Compute standin1 cpos change
  sub(standin1Delta.cpos, standin1.cpos, standin1Before.cpos);

  // Compute standin2 cpos change
  sub(standin2Delta.cpos, standin2.cpos, standin2Before.cpos);

  scale(standin1Delta.cpos, standin1Delta.cpos, u);
  scale(standin2Delta.cpos, standin2Delta.cpos, t);

  debug('standin1Delta cpos %o', standin1Delta.cpos);
  debug('standin2Delta cpos %o', standin2Delta.cpos);

  // Apply cpos changes to point3
  add(point3.cpos, point3.cpos, standin1Delta.cpos);
  add(point3.cpos, point3.cpos, standin2Delta.cpos);

  debug('new endpoint1.cpos %o', point1.cpos);
  debug('new endpoint2.cpos %o', point2.cpos);
  debug('new point3.cpos %o', point3.cpos);

  if (!preserveInertia) return;

  // TODO: instead of adding diff, get magnitude of diff and scale
  // in reverse direction of standin velocity from point3.cpos because
  // that is what circlecircle does.

  // Compute standin1 ppos change
  sub(standin1Delta.ppos, standin1.ppos, standin1Before.ppos);

  // Compute standin2 ppos change
  sub(standin2Delta.ppos, standin2.ppos, standin2Before.ppos);

  scale(standin1Delta.ppos, standin1Delta.ppos, u);
  scale(standin2Delta.ppos, standin2Delta.ppos, t);

  debug('standin1Delta ppos %o', standin1Delta.ppos);
  debug('standin2Delta ppos %o', standin2Delta.ppos);

  // Apply ppos changes to point3
  add(point3.ppos, point3.ppos, standin1Delta.ppos);
  add(point3.ppos, point3.ppos, standin2Delta.ppos);

  debug('new endpoint1.ppos %o', point1.ppos);
  debug('new endpoint2.ppos %o', point2.ppos);
  debug('new point3.ppos %o', point3.ppos);
};
