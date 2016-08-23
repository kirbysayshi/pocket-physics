import scihalt from 'science-halt';
import {
  add,
  copy,
  dot,
  magnitude,
  normalize,
  scale,
  sub,
  v2,
} from '../v2';
import accelerate from '../accelerate2d';
import inertia from '../inertia2d';
import gravitation from '../gravitation2d';
import overlapAABB2 from '../overlapaabbaabb2';
import collisionResponseAABB from '../collision-response-aabb';

const cvs = document.createElement('canvas');
const ctx = cvs.getContext('2d');
cvs.width = cvs.height = 800;
cvs.style.border = '1px solid gray';
document.body.appendChild(cvs);

const box1 = {
  cpos: v2(350, 90),
  ppos: v2(349, 80),
  acel: v2(),
  w: 100,
  h: 150,
  mass: 10,
}

const box2 = {
  cpos: v2(350, 600),
  ppos: v2(350, 600),
  acel: v2(),
  w: 100,
  h: 150,
  mass: 10,
}

const points = []
const collision = {};

points.push(box1, box2);

let running = true;
scihalt(() => running = false);

(function step () {
  const dt = 1;
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    accelerate(point, dt);
  }

  const isOverlapping = overlapAABB2(
    box1.cpos.x, box1.cpos.y, box1.w, box1.h,
    box2.cpos.x, box2.cpos.y, box2.w, box2.h,
    collision
  );

  if (isOverlapping) {

    // for debugging
    render(points, ctx);

    // move to non-overlapping position
    const overlapHalf = scale(v2(), collision.resolve, 0.5);
    add(box2.cpos, box2.cpos, overlapHalf);
    add(box2.ppos, box2.ppos, overlapHalf);
    sub(box1.cpos, box1.cpos, overlapHalf);
    sub(box1.ppos, box1.ppos, overlapHalf);

    // for debugging
    render(points, ctx);

    const box1v = v2();
    const box2v = v2();

    const restitution = 0;
    const staticFriction = 0;
    const dynamicFriction = 0;

    collisionResponseAABB(
      box1.cpos, box1.ppos, box1.mass, restitution, staticFriction, dynamicFriction,
      box2.cpos, box2.ppos, box2.mass, restitution, staticFriction, dynamicFriction,
      box1v, box2v
    );

    // Apply the new velocity
    sub(box1.ppos, box1.cpos, box1v);
    sub(box2.ppos, box2.cpos, box2v);

    // for debugging
    render(points, ctx);
  }

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    inertia(point, dt);
  }

  render(points, ctx);
  if (!running) return;
  window.requestAnimationFrame(step);
}());

function render (points, ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (let i = 0; i < points.length; i++) {
    const point = points[i];

    ctx.fillStyle = 'red';
    ctx.fillRect(
      point.ppos.x - point.w / 2,
      point.ppos.y - point.h / 2,
      point.w,
      point.h
    );

    ctx.fillStyle = 'black';
    ctx.fillRect(
      point.cpos.x - point.w / 2,
      point.cpos.y - point.h / 2,
      point.w,
      point.h
    );
  }
}