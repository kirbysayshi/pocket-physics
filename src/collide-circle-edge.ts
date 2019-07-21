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
  normalize,
  Vector2
} from "./v2";
import { collideCircleCircle } from "./collide-circle-circle";
import { VelocityDerivable } from "./common-types";

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

export function collideCircleEdge(
  point3: VelocityDerivable,
  radius3: number,
  mass3: number,
  point1: VelocityDerivable,
  mass1: number,
  point2: VelocityDerivable,
  mass2: number,
  preserveInertia: boolean,
  damping: number
) {
  // Edge direction (edge in local space)
  sub(edge, point2.cpos, point1.cpos);

  // Normalize collision edge (assume collision axis is edge)
  normalize(edgeDir, edge);

  // Vector from endpoint1 to particle
  sub(hypo, point3.cpos, point1.cpos);

  // Where is the particle on the edge, before, after, or on?
  // Also used for interpolation later.
  const projection = dot(edge, hypo);
  const maxDot = dot(edge, edge);
  const edgeMag = Math.sqrt(maxDot);

  // Colliding beyond the edge...
  if (projection < 0 || projection > maxDot) return;

  // Create interpolation factor of where point closest
  // to particle is on the line.
  const t = projection / maxDot;
  const u = 1 - t;

  // Find the point of collision on the edge.
  scale(collisionPoint, edgeDir, t * edgeMag);
  add(collisionPoint, collisionPoint, point1.cpos);
  const dist = distance(collisionPoint, point3.cpos);

  // Bail if point and edge are too far apart.
  if (dist > radius3) return;

  // Distribute mass of colliding point into two fake points
  // and use those to collide against each endpoint independently.

  const standinMass1 = u * mass3;
  const standinMass2 = t * mass3;

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

  // Collide standins with endpoints
  collideCircleCircle(
    standin1,
    radius3,
    standinMass1,
    point1,
    edgeRadius,
    mass1,
    preserveInertia,
    damping
  );

  collideCircleCircle(
    standin2,
    radius3,
    standinMass2,
    point2,
    edgeRadius,
    mass2,
    preserveInertia,
    damping
  );

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

  // Apply cpos changes to point3
  add(point3.cpos, point3.cpos, standin1Delta.cpos);
  add(point3.cpos, point3.cpos, standin2Delta.cpos);

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

  // Apply ppos changes to point3
  add(point3.ppos, point3.ppos, standin1Delta.ppos);
  add(point3.ppos, point3.ppos, standin2Delta.ppos);
}

type Particle = {
  mass: number;
  radius: number;
} & VelocityDerivable;

function snapshotDebug(
  name: string,
  particles: Particle[] = [],
  points: [string, Vector2][] = []
) {
  const cvs = document.createElement("canvas");
  const ctx = cvs.getContext("2d")!;
  document.body.appendChild(cvs);
  // let minX = Number.MAX_SAFE_INTEGER;
  // let maxX = Number.MIN_SAFE_INTEGER;
  // let minY = Number.MAX_SAFE_INTEGER;
  // let maxY = Number.MIN_SAFE_INTEGER;
  // for (let i = 0; i < particles.length; i++) {
  //   const particle = particles[i];
  //   minX = Math.min(
  //     minX,
  //     particle.cpos.x - particle.radius,
  //     particle.ppos.x - particle.radius
  //   );
  //   maxX = Math.max(
  //     maxX,
  //     particle.cpos.x + particle.radius,
  //     particle.ppos.x + particle.radius
  //   );
  //   minY = Math.min(
  //     minY,
  //     particle.cpos.y - particle.radius,
  //     particle.ppos.y - particle.radius
  //   );
  //   maxY = Math.max(
  //     maxY,
  //     particle.cpos.y + particle.radius,
  //     particle.ppos.y + particle.radius
  //   );
  // }

  // for (let i = 0; i < points.length; i++) {
  //   const [, point] = points[i];
  //   minX = Math.min(minX, point.x, point.x);
  //   maxX = Math.max(maxX, point.x, point.x);
  //   minY = Math.min(minY, point.y, point.y);
  //   maxY = Math.max(maxY, point.y, point.y);
  // }

  // cvs.width = maxX - minX;
  // cvs.height = maxY - minY;

  // ctx.translate(-minX, -minY);

  cvs.width = 800;
  cvs.height = 800;

  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.arc(
      particle.ppos.x,
      particle.ppos.y,
      particle.radius,
      0,
      Math.PI * 2,
      false
    );
    ctx.fill();

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.arc(
      particle.cpos.x,
      particle.cpos.y,
      particle.radius,
      0,
      Math.PI * 2,
      false
    );
    ctx.fill();
  }

  for (let i = 0; i < points.length; i++) {
    const [name, point] = points[i];
    ctx.fillStyle = "purple";
    ctx.fillRect(point.x, point.y, 1, 1);
    ctx.fillText(`${name} (${point.x},${point.y})`, point.x + 1, point.y + 1);
  }

  // ctx.translate(minX, minY);
  ctx.fillStyle = "black";
  ctx.fillText(name, 10, 10);
}
