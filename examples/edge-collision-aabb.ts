import scihalt from "science-halt";
import {
  Vector2,
  v2,
  accelerate,
  inertia,
  add,
  solveDistanceConstraint,
  collisionResponseAABB,
  createPointEdgeProjectionResult,
  projectPointEdge,
  sub,
  segmentIntersection,
  projectCposWithRadius,
  translate,
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
    cpos: v2(600, 100),
    ppos: v2(600, 100),
    acel: v2(0, 0),
    mass: 1,
    radius: 20,
  };

  const GRAVITY = 0.98;

  // Use similar masses because even if the platform is immobile, a huge mass
  // will impart nearly all velocity into the ball, and make restitution and
  // friction nearly meaningless.
  const platform: CollidableLine = {
    point1: {
      cpos: v2(100, 300),
      ppos: v2(100, 300),
      acel: v2(0, 0),
      mass: 1,
      radius: 0,
    },
    point2: {
      cpos: v2(700, 300),
      ppos: v2(700, 300),
      acel: v2(0, 0),
      mass: 1,
      radius: 0,
    },
    goal: 500,
  };

  const circles: CollidableCircle[] = [
    player,
    platform.point1,
    platform.point2,
  ];

  let running = true;
  scihalt(() => (running = false));

  (function step() {
    const dt = 16;

    // gravity!
    add(player.acel, player.acel, v2(0, GRAVITY));

    for (let i = 0; i < circles.length; i++) {
      const box = circles[i];
      accelerate(box, dt);
    }

    // Use the ppos to account for tunneling: if the ppos->cpos vector is
    // intersecting with the edge, and ppos is still <0, that means the circle
    // has collided or even tunneled. But if the similarity is in the opposite
    // direction, that could mean this circle has already collided this frame.
    const projectedResult = createPointEdgeProjectionResult();
    projectPointEdge(
      player.ppos,
      platform.point1.cpos,
      platform.point2.cpos,
      projectedResult
    );

    // Project the cpos using the radius just for the sake of doing a
    // line-intersection. This can be a problem in environments with more than
    // one collision happening per frame.
    const intersectionPoint = v2();
    const cposCapsule = projectCposWithRadius(v2(), player, player.radius);
    const intersected = segmentIntersection(player.ppos, cposCapsule, platform.point1.cpos, platform.point2.cpos, intersectionPoint);

    if (intersected && projectedResult.similarity < 0) {
      // Do our best to prevent tunneling: rewind by the distance from the cpos
      // capsule to the segment intersection point. `Translate` adds, so we have
      // to sub intersectionPoint - capsule, which is slightly counterintuitive.
      const offset = v2();
      sub(offset,intersectionPoint, cposCapsule);
      translate(offset, player.cpos, player.ppos);

      const vout1 = v2();
      const vout2 = v2();

      // 1: nearly perfectly elastic (we still lose some energy due to gravity)
      // 0: dead
      const restitution = 1;

      collisionResponseAABB(
        player.cpos,
        player.ppos,
        player.mass,
        restitution,
        0.9,
        0.1,
        projectedResult.projectedPoint,
        projectedResult.projectedPoint,
        (platform.point1.mass + platform.point2.mass) * projectedResult.u,
        restitution,
        0.9,
        0.1,
        projectedResult.edgeNormal,
        vout1,
        vout2
      );

      sub(player.ppos, player.cpos, vout1);
      // preserve systemic energy by giving the velocity that would have been
      // imparted to the edge (if it were moveable) to the ball instead.
      add(player.ppos, player.ppos, vout2);
    }

    for (let i = 0; i < circles.length; i++) {
      const box = circles[i];
      inertia(box);
    }

    for (let i = 0; i < 5; i++) {
      // Not really necessary since we're never imparting velocity to the
      // platform, but could be useful to demonstrate how to keep the shape if
      // we did.
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
