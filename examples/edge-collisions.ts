import scihalt from 'science-halt';
import {
  add,
  copy,
  normalize,
  scale,
  sub,
  v2,
  accelerate,
  inertia,
  solveGravitation,
  overlapCircleCircle,
  collideCircleCircle,
  collideCircleEdge,
  solveDistanceConstraint,
  rewindToCollisionPoint,
  Vector2,
} from '../src/index';

const cvs = document.createElement('canvas');
const ctx = cvs.getContext('2d')!;
cvs.width = cvs.height = 800;
cvs.style.border = '1px solid gray';
document.body.appendChild(cvs);

type Box = (ReturnType<typeof generateBoxes>)[0];
type Point = Box['points'][0];

// generate a circle of circles
const CENTER = { x: 400, y: 400 };
const GRAVITATIONAL_POINT = {
  cpos: copy(v2(), CENTER),
  ppos: copy(v2(), CENTER),
  acel: v2(),
  radius: 20,
  mass: 1000000
};
const RADIUS = 13;
const DAMPING = 0.5;
const CONSTRAINT_ITERATIONS = 30;
const boxes = generateBoxes(CENTER, RADIUS, 4);
const points = boxes.reduce<Point[]>((all, box) => { all.push(...box.points); return all }, []);
const colliding: Point[] = [];

points.unshift(GRAVITATIONAL_POINT);

let running = true;
scihalt(() => running = false);

(function step () {
  const force = v2();
  const dt = 1;

  for (let i = 0; i < CONSTRAINT_ITERATIONS; i++) {
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      const { points, goals } = box;

      // p1, p1mass, p2, p2mass, goal
      solveDistanceConstraint(points[0], points[0].mass, points[1], points[1].mass, goals[0]);
      solveDistanceConstraint(points[1], points[1].mass, points[2], points[2].mass, goals[1]);
      solveDistanceConstraint(points[2], points[2].mass, points[3], points[3].mass, goals[2]);
      solveDistanceConstraint(points[3], points[3].mass, points[0], points[0].mass, goals[3]);
      solveDistanceConstraint(points[0], points[0].mass, points[2], points[2].mass, goals[4]);
      solveDistanceConstraint(points[1], points[1].mass, points[3], points[3].mass, goals[5]);
    }
  }

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    if (point !== GRAVITATIONAL_POINT) {
      solveGravitation(
        point, point.mass,
        GRAVITATIONAL_POINT, GRAVITATIONAL_POINT.mass
      );
      //sub(force, GRAVITATIONAL_POINT.cpos, point.cpos);
      //normalize(force, force);
      //scale(force, force, 50);
      //add(point.acel, point.acel, force);
    }
    accelerate(point, dt);
  }

  collisionPairs(colliding, points);

  for (let i = 0; i < colliding.length; i += 2) {
    const pointA = colliding[i];
    const pointB = colliding[i+1];
    collideCircleCircle(
      pointA, pointA.radius, pointA.mass,
      pointB, pointB.radius, pointB.mass,
      false, DAMPING);
  }

  collisionEdges(false, points, boxes);

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    inertia(point);
  }

  for (let i = 0; i < colliding.length; i += 2) {
    const pointA = colliding[i];
    const pointB = colliding[i+1];
    collideCircleCircle(
      pointA, pointA.radius, pointA.mass,
      pointB, pointB.radius, pointB.mass,
      true, DAMPING);
  }

  collisionEdges(true, points, boxes);

  render(boxes, points, ctx);
  if (!running) return;
  window.requestAnimationFrame(step);
}());

function collisionPairs (pairs: Point[], points: Point[]) {
  pairs.length = 0;

  for (let i = 0; i < points.length; i++) {
    const pointA = points[i];
    for (let j = i + 1; j < points.length; j++) {
      const pointB = points[j];
      if (
        overlapCircleCircle(
          pointA.cpos.x, pointA.cpos.y, pointA.radius,
          pointB.cpos.x, pointB.cpos.y, pointB.radius
        )
      ) {
        pairs.push(pointA, pointB);
      }
    }
  }

  return pairs;
}

function collisionEdges (preserveInertia: boolean, points: Point[], boxes: Box[]) {
  //collidingEdges.length = 0;

  // for each edge, test against each point
  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i];
    for (let j = 0; j < points.length; j++) {
      const point = points[j];
      if (
        point === box.points[0]
        || point === box.points[1]
        || point === box.points[2]
        || point === box.points[3]
      ) { continue; }

      rewindToCollisionPoint(point, box.points[0], box.points[1]);
      rewindToCollisionPoint(point, box.points[1], box.points[2]);
      rewindToCollisionPoint(point, box.points[2], box.points[3]);
      rewindToCollisionPoint(point, box.points[3], box.points[0]);

      collideCircleEdge(
        point, point.radius, point.mass,
        box.points[0], box.points[0].mass,
        box.points[1], box.points[1].mass,
        preserveInertia, DAMPING
      );

      collideCircleEdge(
        point, point.radius, point.mass,
        box.points[1], box.points[1].mass,
        box.points[2], box.points[2].mass,
        preserveInertia, DAMPING
      );

      collideCircleEdge(
        point, point.radius, point.mass,
        box.points[2], box.points[2].mass,
        box.points[3], box.points[3].mass,
        preserveInertia, DAMPING
      );

      collideCircleEdge(
        point, point.radius, point.mass,
        box.points[3], box.points[3].mass,
        box.points[0], box.points[0].mass,
        preserveInertia, DAMPING
      );
    }
  }
}

function generateBoxes (center: Vector2, baseRadius: number, num: number) {
  const all = [];
  const minRadius = 10;
  for (let i = 0; i < num; i++) {
    const x = (Math.cos(i) * center.x) + center.x;
    const y = (Math.sin(i) * center.y) + center.y;
    const group = [];
    const half = Math.max(Math.abs(Math.cos(i) + Math.sin(i)) * baseRadius, minRadius);
    const radius = 5;
    const mass = Math.max(Math.abs(Math.cos(i) + Math.sin(i)) * 1, 1);
    group.push({
      cpos: {x: x - half, y: y - half},
      ppos: {x: x - half, y: y - half},
      acel: v2(), radius, mass
    });
    group.push({
      cpos: {x: x + half, y: y - half},
      ppos: {x: x + half, y: y - half},
      acel: v2(), radius, mass
    });
    group.push({
      cpos: {x: x + half, y: y + half},
      ppos: {x: x + half, y: y + half},
      acel: v2(), radius, mass
    });
    group.push({
      cpos: {x: x - half, y: y + half},
      ppos: {x: x - half, y: y + half},
      acel: v2(), radius, mass
    });
    all.push({
      points: group,
      goals: [
        half*2, half*2, half*2, half*2,
        half*2*Math.SQRT2, half*2*Math.SQRT2
      ]
    });
  }
  return all;
}

function render (boxes: Box[], points: Point[], ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(point.ppos.x, point.ppos.y, point.radius, 0, Math.PI*2, false);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(point.cpos.x, point.cpos.y, point.radius, 0, Math.PI*2, false);
    ctx.fill();
  }

  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i];

    ctx.fillStyle = 'rgba(255,0,0,0.5)';
    ctx.beginPath();
    ctx.moveTo(box.points[0].cpos.x, box.points[0].cpos.y);
    ctx.lineTo(box.points[1].cpos.x, box.points[1].cpos.y);
    ctx.lineTo(box.points[2].cpos.x, box.points[2].cpos.y);
    ctx.lineTo(box.points[3].cpos.x, box.points[3].cpos.y);
    ctx.lineTo(box.points[0].cpos.x, box.points[0].cpos.y);
    ctx.fill();
  }
}