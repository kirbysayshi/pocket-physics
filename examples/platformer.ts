import scihalt from "science-halt";
import {
  accelerate,
  add,
  collisionResponseAABB,
  createAABBOverlapResult,
  inertia,
  overlapAABBAABB,
  scale,
  sub,
  translate,
  v2,
  Vector2,
} from "../src";

export const start = () => {
  const cvs = document.createElement("canvas");
  const ctx = cvs.getContext("2d")!;
  cvs.tabIndex = 1; // for keyboard events
  cvs.width = cvs.height = 800;
  cvs.style.border = "1px solid gray";
  document.body.appendChild(cvs);

  type CollidableBox = {
    cpos: Vector2;
    ppos: Vector2;
    acel: Vector2;
    width: number;
    height: number;
    mass: number;
  };

  const player: CollidableBox = {
    cpos: v2(400, 0),
    ppos: v2(400, 0),
    acel: v2(0, 0),
    width: 50,
    height: 75,
    mass: 1
  };

  const PLAYER_HOR_ACEL = 5;
  const GRAVITY = 9.8;

  const platform: CollidableBox = {
    cpos: v2(400, 700),
    ppos: v2(400, 700),
    acel: v2(0, 0),
    width: 800,
    height: 100,
    mass: Number.MAX_SAFE_INTEGER - 100000
  };

  const boxes: CollidableBox[] = [player, platform];

  const collision = createAABBOverlapResult();

  let running = true;
  scihalt(() => (running = false));

  const keys: { [key: string]: boolean } = {};
  cvs.addEventListener("keydown", e => {
    keys[e.key] = true;
    e.preventDefault();
  });
  document.body.addEventListener("keyup", e => {
    keys[e.key] = false;
    e.preventDefault();
  });

  (function step() {
    const dt = 16;

    // gravity!
    add(player.acel, player.acel, v2(0, GRAVITY));

    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      accelerate(box, dt);
    }

    const isOverlapping = overlapAABBAABB(
      player.cpos.x,
      player.cpos.y,
      player.width,
      player.height,
      platform.cpos.x,
      platform.cpos.y,
      platform.width,
      platform.height,
      collision
    );

    if (isOverlapping) {
      // Move to non-overlapping positions
      const negativeResolve = scale(v2(), collision.resolve, -1);
      // translate(overlapHalf, platform.cpos, platform.ppos);
      translate(negativeResolve, player.cpos, player.ppos);

      // for debugging
      render(boxes, ctx);

      // We will put the new relative velocity vectors here.
      const box1v = v2();
      const box2v = v2();

      const restitution = 1;
      const staticFriction = 0.9;
      const dynamicFriction = 0.1;

      collisionResponseAABB(
        player.cpos,
        player.ppos,
        player.mass,
        restitution,
        staticFriction,
        dynamicFriction,
        platform.cpos,
        platform.ppos,
        platform.mass,
        restitution,
        staticFriction,
        dynamicFriction,
        collision.normal,
        box1v,
        box2v
      );

      // Apply the new velocity
      sub(player.ppos, player.cpos, box1v);
      // Kill vertical velocity
      player.ppos.y = player.cpos.y;

      // for debugging
      render(boxes, ctx);
    }

    // Movement in the air is less powerful than on the ground!

    if (keys.ArrowLeft) {
      add(
        player.acel,
        player.acel,
        v2(isOverlapping ? -PLAYER_HOR_ACEL : -PLAYER_HOR_ACEL / 10, 0)
      );
    }

    if (keys.ArrowRight) {
      add(
        player.acel,
        player.acel,
        v2(isOverlapping ? PLAYER_HOR_ACEL : PLAYER_HOR_ACEL / 10, 0)
      );
    }

    // we were overlapping, so probably ok to jump!
    if (isOverlapping && keys.ArrowUp && player.cpos.y - player.ppos.y === 0) {
      add(player.acel, player.acel, v2(0, -GRAVITY * 10));
    }

    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      inertia(box);
    }

    render(boxes, ctx);
    if (!running) return;
    window.requestAnimationFrame(step);
  })();

  function render(boxes: CollidableBox[], ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];

      ctx.fillStyle = "red";
      ctx.fillRect(
        box.ppos.x - box.width / 2,
        box.ppos.y - box.height / 2,
        box.width,
        box.height
      );

      ctx.fillStyle = "black";
      ctx.fillRect(
        box.cpos.x - box.width / 2,
        box.cpos.y - box.height / 2,
        box.width,
        box.height
      );
    }
  }
};
