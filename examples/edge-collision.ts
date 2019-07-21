import scihalt from "science-halt";
import {
  Vector2,
  v2,
  accelerate,
  inertia,
  add,
  collideCircleEdge,
  rewindToCollisionPoint,
  solveDistanceConstraint
} from "../src";

export const start = () => {
  const cvs = document.createElement("canvas");
  const ctx = cvs.getContext("2d")!;
  cvs.tabIndex = 1; // for keyboard events
  cvs.width = cvs.height = 800;
  cvs.style.border = "1px solid gray";
  document.body.appendChild(cvs);

  type CollidableLine = {
    point1: CollidableCircle;
    point2: CollidableCircle;
    goal: number;
  };

  type CollidableCircle = {
    cpos: Vector2;
    ppos: Vector2;
    acel: Vector2;
    mass: number;
    radius: number;
  };

  const player: CollidableCircle = {
    cpos: v2(600, 0),
    ppos: v2(600, 0),
    acel: v2(0, 0),
    mass: 1,
    radius: 20
  };

  const GRAVITY = 0.8;

  const platform: CollidableLine = {
    point1: {
      cpos: v2(100, 300),
      ppos: v2(100, 300),
      acel: v2(0, 0),
      // mass: 100000000,
      mass: -1,
      radius: 0
    },
    point2: {
      cpos: v2(700, 300),
      ppos: v2(700, 300),
      acel: v2(0, 0),
      // mass: 100000000,
      // mass: -1,
      mass: -1,
      radius: 0
    },
    goal: 500
  };

  const circles: CollidableCircle[] = [
    player,
    platform.point1,
    platform.point2
  ];

  const tunnelPoint = v2();

  let running = true;
  scihalt(() => (running = false));

  // const keys: { [key: string]: boolean } = {};
  // cvs.addEventListener("keydown", e => {
  //   keys[e.key] = true;
  //   e.preventDefault();
  // });
  // document.body.addEventListener("keyup", e => {
  //   keys[e.key] = false;
  //   e.preventDefault();
  // });

  (function step() {
    const dt = 16;

    // gravity!
    add(player.acel, player.acel, v2(0, GRAVITY));

    for (let i = 0; i < circles.length; i++) {
      const box = circles[i];
      accelerate(box, dt);
    }

    rewindToCollisionPoint(player, player.radius, platform.point1, platform.point2);

    collideCircleEdge(
      player,
      player.radius,
      player.mass,
      platform.point1,
      platform.point1.mass,
      platform.point2,
      platform.point2.mass,
      false,
      0.9
    );

    for (let i = 0; i < circles.length; i++) {
      const box = circles[i];
      inertia(box);
    }

    collideCircleEdge(
      player,
      player.radius,
      player.mass,
      platform.point1,
      platform.point1.mass,
      platform.point2,
      platform.point2.mass,
      true,
      0.9
    );

    for (let i = 0; i < 5; i++) {
      solveDistanceConstraint(
        platform.point1,
        platform.point1.mass,
        platform.point2,
        platform.point2.mass,
        platform.goal
      );
    }

    render(circles, [platform], ctx);
    if (!running) return;
    window.requestAnimationFrame(step);
  })();

  function render(
    circles: CollidableCircle[],
    segments: CollidableLine[],
    ctx: CanvasRenderingContext2D
  ) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let i = 0; i < circles.length; i++) {
      const point = circles[i];

      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(point.ppos.x, point.ppos.y, point.radius, 0, Math.PI * 2, false);
      ctx.fill();

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(point.cpos.x, point.cpos.y, point.radius, 0, Math.PI * 2, false);
      ctx.fill();
    }

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.moveTo(segment.point1.ppos.x, segment.point1.ppos.y);
      ctx.lineTo(segment.point2.ppos.x, segment.point2.ppos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.moveTo(segment.point1.cpos.x, segment.point1.cpos.y);
      ctx.lineTo(segment.point2.cpos.x, segment.point2.cpos.y);
      ctx.stroke();
    }
  }
};
