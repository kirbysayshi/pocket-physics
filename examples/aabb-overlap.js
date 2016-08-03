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
}

const box2 = {
  cpos: v2(350, 600),
  ppos: v2(350, 600),
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

    const basis = sub(v2(), box1.cpos, box2.cpos);
    normalize(basis, basis);
    const basisNeg = scale(v2(), basis, -1);

    // calculate x-direction velocity vector and perpendicular y-vector for box 1
    const vel1 = sub(v2(), box1.cpos, box1.ppos);
    const x1 = dot(basis, vel1);
    const vel1x = scale(v2(), basis, x1);
    const vel1y = sub(v2(), vel1, vel1x);
    const mass1 = 1;

    // calculate x-direction velocity vector and perpendicular y-vector for box 2
    const vel2 = sub(v2(), box2.cpos, box2.ppos);
    const x2 = dot(basisNeg, vel2);
    const vel2x = scale(v2(), basisNeg, x2);
    const vel2y = sub(v2(), vel2, vel2x);
    const mass2 = 1;

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

    // set new velocity of box1 and box2
    sub(box1.ppos, box1.cpos, newVel1);
    sub(box2.ppos, box2.cpos, newVel2);

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