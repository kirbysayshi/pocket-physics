import scihalt from "science-halt";
import {
  add,
  distance,
  scale,
  sub,
  v2,
  accelerate,
  inertia,
  solveGravitation,
  overlapAABBAABB,
  collisionResponseAABB,
  AABBOverlapResult,
  copy
} from "../src/index";

export const start = () => {
  const cvs = document.createElement("canvas");
  const ctx = cvs.getContext("2d")!;
  cvs.width = cvs.height = 800;
  cvs.style.border = "1px solid gray";
  document.body.appendChild(cvs);

  type Box = ReturnType<typeof makeBox>;

  const points: Box[] = [];

  for (let count = 30, i = 0; i < count; i++) {
    const centerX = cvs.width / 2;
    const centerY = cvs.height / 2;
    const distance = Math.min(centerX, centerY) * 0.5;
    const cos = Math.cos(i);
    const sin = Math.sin(i);
    const x = centerX + cos * distance;
    const y = centerY + sin * distance;
    points.push(makeBox(x, y));
  }

  const GRAVITATIONAL_POINT = {
    cpos: v2(cvs.width / 2, cvs.height / 2),
    ppos: v2(cvs.width / 2, cvs.height / 2),
    acel: v2(),
    mass: 100000
  };

  let running = true;
  scihalt(() => (running = false));

  (function step() {
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const dist = distance(point.cpos, GRAVITATIONAL_POINT.cpos);
      dist > 100 &&
        solveGravitation(
          point,
          point.mass,
          GRAVITATIONAL_POINT,
          GRAVITATIONAL_POINT.mass
        );
    }

    const dt = 1;
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      accelerate(point, dt);
    }

    const collisions = [];
    const handled = [];
    const collision: AABBOverlapResult = {
      resolve: v2(),
      hitPos: v2(),
      normal: v2()
    };

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const box1 = points[i];
        const box2 = points[j];
        const isOverlapping = overlapAABBAABB(
          box1.cpos.x,
          box1.cpos.y,
          box1.w,
          box1.h,
          box2.cpos.x,
          box2.cpos.y,
          box2.w,
          box2.h,
          collision
        );

        if (
          isOverlapping &&
          handled.indexOf(box1.id + "," + box2.id) === -1 &&
          handled.indexOf(box2.id + "," + box1.id) === -1
        ) {
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

          const restitution = 1;
          const staticFriction = 1;
          const dynamicFriction = 1;

          collisionResponseAABB(
            box1.cpos,
            box1.ppos,
            box1.mass,
            restitution,
            staticFriction,
            dynamicFriction,
            box2.cpos,
            box2.ppos,
            box2.mass,
            restitution,
            staticFriction,
            dynamicFriction,
            collision.normal,
            box1v,
            box2v
          );

          // Apply the new velocity
          sub(box1.ppos, box1.cpos, box1v);
          sub(box2.ppos, box2.cpos, box2v);

          // for debugging
          render(points, ctx);

          handled.push(box1.id + "," + box2.id);
          handled.push(box2.id + "," + box1.id);
        }
      }
    }

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      inertia(point);
    }

    render(points, ctx);
    if (!running) return;
    window.requestAnimationFrame(step);
  })();

  function makeBox(x: number, y: number) {
    return {
      id: "id-" + Math.floor(Math.random() * 10000000),
      cpos: v2(x, y),
      ppos: v2(x, y),
      acel: v2(),
      mass: 10,
      w: 50,
      h: 50
    };
  }

  // function copyCollisionData (output, input) {
  //   output.resolve = v2();
  //   output.hitPos = v2();
  //   output.normal = v2();
  //   copy(output.resolve, input.resolve);
  //   copy(output.hitPos, input.hitPos);
  //   copy(output.normal, input.normal);
  //   return output;
  // }

  function render(points: Box[], ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let i = 0; i < points.length; i++) {
      const point = points[i];

      ctx.fillStyle = "red";
      ctx.fillRect(
        point.ppos.x - point.w / 2,
        point.ppos.y - point.h / 2,
        point.w,
        point.h
      );

      ctx.fillStyle = "black";
      ctx.fillRect(
        point.cpos.x - point.w / 2,
        point.cpos.y - point.h / 2,
        point.w,
        point.h
      );
    }
  }
};
