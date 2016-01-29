import scihalt from 'science-halt';
import v2 from '../v2';
import accelerate from '../accelerate2d';
import inertia from '../inertia2d';
import gravitation from '../gravitation2d';
import overlapCircleCircle from '../overlapcirclecircle';
import collideCircleCircle from '../collidecirclecircle';

const cvs = document.createElement('canvas');
const ctx = cvs.getContext('2d');
cvs.width = cvs.height = 800;
cvs.style.border = '1px solid gray';
document.body.appendChild(cvs);

// generate a circle of circles
const CENTER = { x: 400, y: 400 };
const GRAVITATIONAL_POINT = {
  cpos: v2.copy(v2(), CENTER),
  ppos: v2.copy(v2(), CENTER),
  acel: v2(),
  radius: 20,
  mass: 100000
};
const RADIUS = 15;
const DAMPING = 0.1;
const points = generatePoints(CENTER, RADIUS, 40);
const colliding = [];

points.unshift(GRAVITATIONAL_POINT);

let running = true;
scihalt(() => running = false);

(function step () {
  const force = v2();
  const dt = 1;
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    if (point !== GRAVITATIONAL_POINT) {
      gravitation(
        point, point.mass,
        GRAVITATIONAL_POINT, GRAVITATIONAL_POINT.mass
      );
      //v2.sub(force, GRAVITATIONAL_POINT.cpos, point.cpos);
      //v2.normalize(force, force);
      //v2.scale(force, force, 50);
      //v2.add(point.acel, point.acel, force);
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

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    inertia(point, dt);
  }

  for (let i = 0; i < colliding.length; i += 2) {
    const pointA = colliding[i];
    const pointB = colliding[i+1];
    collideCircleCircle(
      pointA, pointA.radius, pointA.mass,
      pointB, pointB.radius, pointB.mass,
      true, DAMPING);
  }

  render(points, ctx);
  if (!running) return;
  window.requestAnimationFrame(step);
}());

function collisionPairs (pairs, points) {
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

function generatePoints (center, baseRadius, num) {
  const all = [];
  const minRadius = 10;
  for (let i = 0; i < num; i++) {
    const x = (Math.cos(i) * center.x) + center.x;
    const y = (Math.sin(i) * center.y) + center.y;
    all.push({
      cpos: {x, y},
      ppos: {x, y},
      acel: {x: 0, y: 0},
      radius: Math.max(Math.abs(Math.cos(i) + Math.sin(i)) * baseRadius, minRadius),
      mass: Math.max(Math.abs(Math.cos(i) + Math.sin(i)) * 1, 1)
    });
  }
  return all;
}

function render (points, ctx) {
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
}