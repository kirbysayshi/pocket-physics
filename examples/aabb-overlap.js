import scihalt from 'science-halt';
import {
  add,
  copy,
  normalize,
  scale,
  sub,
  v2,
} from '../v2';
import accelerate from '../accelerate2d';
import inertia from '../inertia2d';
import gravitation from '../gravitation2d';
import overlapAABB2 from '../overlapaabbaabb2';

const cvs = document.createElement('canvas');
const ctx = cvs.getContext('2d');
cvs.width = cvs.height = 800;
cvs.style.border = '1px solid gray';
document.body.appendChild(cvs);

const box1 = {
  cpos: v2(100, 500),
  ppos: v2(90, 500),
  acel: v2(),
  w: 100,
  h: 150,
}

const box2 = {
  cpos: v2(500, 500),
  ppos: v2(510, 500),
  acel: v2(),
  w: 100,
  h: 150,
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

    // move to non-overlapping position
    // should the overlap also return the half vectors so both can be moved?
    add(box2.cpos, box2.cpos, collision.resolve);
    add(box2.ppos, box2.ppos, collision.resolve);

    // for debugging
    //render(points, ctx);

    // reverse the velocity in the collision normal direction
    const reverseVel1 = sub(v2(), box1.ppos, box1.cpos);
    reverseVel1.x *= collision.normal.x;
    reverseVel1.y *= collision.normal.y;
    sub(box1.ppos, box1.cpos, reverseVel1);

    // for debugging
    //render(points, ctx);

    // reverse the velocity in the collision normal direction
    const reverseVel2 = sub(v2(), box2.ppos, box2.cpos);
    reverseVel2.x *= collision.normal.x;
    reverseVel2.y *= collision.normal.y;
    sub(box2.ppos, box2.cpos, reverseVel2);

    // for debugging
    //render(points, ctx);
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