import scihalt from "science-halt";
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
  VelocityDerivable,
  distance,
  Integratable
} from "../src/index";

export const start = () => {
  const cvs = document.createElement("canvas");
  const ctx = cvs.getContext("2d")!;
  cvs.width = cvs.height = 800;
  cvs.style.border = "1px solid gray";
  document.body.appendChild(cvs);

  type CollidableLine = {
    point1: CollidableCircle;
    point2: CollidableCircle;
  };

  type CollidableCircle = {
    mass: number;
    radius: number;
  } & Integratable;

  type DistanceConstraint = {
    point1: Exclude<CollidableCircle, "radius">;
    point2: Exclude<CollidableCircle, "radius">;
    goal: number;
  };

  const CONSTRAINT_ITERATIONS = 2;

  const circles: CollidableCircle[] = [];
  const lines: CollidableLine[] = [];
  const constraints: DistanceConstraint[] = [];

  const box = makeBox(300, 200, 100, 200);
  circles.push(...box.circles);
  lines.push(...box.lines);
  constraints.push(...box.constraints);

  circles.push({
    cpos: v2(500, 220),
    ppos: v2(510, 220),
    acel: v2(0, 0),
    mass: 1,
    radius: 10
  });

  let running = true;
  scihalt(() => (running = false));

  (function step() {
    const dt = 16;

    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];
      accelerate(circle, dt);
    }

    for (let i = 0; i < CONSTRAINT_ITERATIONS; i++) {
      for (let j = 0; j < constraints.length; j++) {
        const constraint = constraints[j];

        solveDistanceConstraint(
          constraint.point1,
          constraint.point1.mass,
          constraint.point2,
          constraint.point2.mass,
          constraint.goal
        );
      }
    }

    collideCircles(circles, false);
    collideEdges(lines, circles, false);

    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];
      inertia(circle);
    }

    collideCircles(circles, true);
    collideEdges(lines, circles, true);

    render(circles, lines, ctx);
    if (!running) return;
    window.requestAnimationFrame(step);
  })();

  function makeBox(x: number, y: number, width: number, height: number) {
    const lines: CollidableLine[] = [];
    const circles: CollidableCircle[] = [];
    const constraints: DistanceConstraint[] = [];
    const points = [
      v2(x, y),
      v2(x + width, y),
      v2(x + width, y + height),
      v2(x, y + height)
    ];
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const prev = circles.length === 0 ? null : circles[i - 1];
      const circle = {
        cpos: copy(v2(), point),
        ppos: copy(v2(), point),
        acel: v2(0, 0),
        mass: i === 0 ? -1 : 1,
        radius: 1
      };
      if (prev) {
        lines.push({
          point1: prev,
          point2: circle
        });

        constraints.push({
          point1: prev,
          point2: circle,
          goal: distance(point, prev.cpos)
        });
      }
      circles.push(circle);
    }

    lines.push({
      point1: circles[circles.length - 1],
      point2: circles[0]
    });

    constraints.push({
      point1: circles[circles.length - 1],
      point2: circles[0],
      goal: distance(circles[circles.length - 1].cpos, circles[0].cpos)
    });

    constraints.push({
      point1: circles[0],
      point2: circles[2],
      goal: distance(circles[0].cpos, circles[2].cpos)
    });

    return {
      lines,
      circles,
      constraints
    };
  }

  function collideCircles(
    circles: CollidableCircle[],
    preserveInertia: boolean,
    damping = 0.9
  ) {
    for (let i = 0; i < circles.length; i++) {
      const a = circles[i];
      for (let j = i + 1; j < circles.length; j++) {
        const b = circles[j];
        if (
          !overlapCircleCircle(
            a.cpos.x,
            a.cpos.y,
            a.radius,
            b.cpos.x,
            b.cpos.y,
            b.radius
          )
        )
          continue;
        collideCircleCircle(
          a,
          a.radius,
          a.mass,
          b,
          b.radius,
          b.mass,
          preserveInertia,
          damping
        );
      }
    }
  }

  function collideEdges(
    lines: CollidableLine[],
    circles: CollidableCircle[],
    preserveInertia: boolean,
    damping = 0.9
  ) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (let j = 0; j < circles.length; j++) {
        const circle = circles[j];
        // Using the below code will prevent tunneling, but since there is no
        // collision manifold there is not way for the rewind to know if it
        // tunneled due to a collision or the result of resolving a collision!
        // Sigh.
        // if (!preserveInertia)
        //   rewindToCollisionPoint(
        //     circle,
        //     circle.radius,
        //     line.point1,
        //     line.point2
        //   );
        collideCircleEdge(
          circle,
          circle.radius,
          circle.mass,
          line.point1,
          line.point1.mass,
          line.point2,
          line.point2.mass,
          preserveInertia,
          damping
        );
      }
    }
  }

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
