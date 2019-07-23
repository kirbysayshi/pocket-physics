import scihalt from "science-halt";
import {
  Vector2,
  v2,
  copy,
  accelerate,
  inertia,
  add,
  distance,
  collideCircleEdge,
  rewindToCollisionPoint,
  collideCircleCircle,
  overlapCircleCircle,
  segmentIntersection,
  sub,
  normalize,
  scale,
  normal,
  dot,
  solveDistanceConstraint
} from "../src";

export const start = () => {
  const width = 800;
  const cvs = document.createElement("canvas");
  const ctx = cvs.getContext("2d")!;
  cvs.tabIndex = 1; // for keyboard events
  cvs.width = cvs.height = width;
  cvs.style.border = "1px solid gray";
  document.body.appendChild(cvs);

  type CollidableLine = {
    point1: CollidableCircle;
    point2: CollidableCircle;
  };

  type CollidableCircle = {
    cpos: Vector2;
    ppos: Vector2;
    acel: Vector2;
    mass: number;
    radius: number;
  };

  type DistanceConstraint = {
    point1: Exclude<CollidableCircle, "radius">;
    point2: Exclude<CollidableCircle, "radius">;
    goal: number;
  };

  const GRAVITY = 0.8;
  const CONSTRAINT_ITERS = 5;

  const lines: CollidableLine[] = [];
  const constraints: DistanceConstraint[] = [];
  const circles: CollidableCircle[] = [];

  const bucket = makeStaticMesh([
    v2(50, 50),
    v2(width - 50, 50),
    v2(width - 50, width - 50),
    v2(50, width - 50)
  ]);

  const midLine = makeStaticMesh([
    v2(500, width / 2),
    v2(width - 500, width / 2 + 200)
  ]);
  midLine.pop(); // remove the double link back to beginning
  lines.push(...bucket, ...midLine);

  circles.push(...makeCircles(v2(width / 2, width / 2), width / 4, 10, 400));

  const polys = [
    makePolygon(6, v2(300, 100), 15),
    makePolygon(3, v2(400, 100), 15),
    makePolygon(4, v2(600, 100), 15),
  ];

  polys.forEach(poly => {
    circles.push(...poly.circles);
    constraints.push(...poly.constraints);
    lines.push(...poly.lines);
  });

  let running = true;
  scihalt(() => (running = false));

  (function step() {
    const dt = 16;

    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];

      if (circle.mass > 0) {
        add(circle.acel, circle.acel, v2(0, GRAVITY));
      }

      accelerate(circle, dt);
    }

    for (let i = 0; i < CONSTRAINT_ITERS; i++) {
      for (let j = 0; j < constraints.length; j++) {
        const constraint = constraints[j];
        solveDistanceConstraint(
          constraint.point1,
          constraint.point1.mass,
          constraint.point2,
          constraint.point2.mass,
          constraint.goal,
          1
        );
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineIsBounds = bucket.indexOf(line) > -1;
      for (let j = 0; j < circles.length; j++) {
        const circle = circles[j];
        if (circle === line.point1 || circle === line.point2) continue;
        // TODO: this needs to be smarter. Without this rewind, simple circles
        // will tunnel through the line. But if done indiscriminately, the rewind
        // will cause an infinite build up of velocity, and eventually explode. OR
        // it will cause a circle to "stick" to an edge until their velocity
        // dissipates.
        if (!lineIsBounds) {
          rewindToCollisionPoint(circle, circle.radius, line.point1, line.point2);
        }
        
        collideCircleEdge(
          circle,
          circle.radius,
          circle.mass,
          line.point1,
          line.point1.mass,
          line.point2,
          line.point2.mass,
          false,
          0.9
        );
      }
    }

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
          false,
          0.9
        );
      }
    }

    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];
      inertia(circle);
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (let j = 0; j < circles.length; j++) {
        const circle = circles[j];
        if (circle === line.point1 || circle === line.point2) continue;
        collideCircleEdge(
          circle,
          circle.radius,
          circle.mass,
          line.point1,
          line.point1.mass,
          line.point2,
          line.point2.mass,
          true,
          0.9
        );
      }
    }

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
          true,
          0.9
        );
      }
    }

    // Ensure nothing actually gets out of the bucket.
    // It's impossible to keep everything in the bucket without a strict
    // normal for each edge, because you need to know which "side" of the edge
    // the particle is on. Additionally, the solver steps above can easily move
    // a circle to a non-intersecting position that is beyond the "knowledge" of
    // anything checking for collisions with edges. This is especially common
    // when lots of collisions are being resolved.
    for (let i = 0; i < bucket.length; i++) {
      const line = bucket[i];
      // HACK: Don't use the midline collection for bounds checking.
      // The right way to do this is to create systems.
      if (line === midLine[0]) continue;

      // Edge direction (edge in local space)
      const edge = sub(v2(), line.point2.cpos, line.point1.cpos);

      // Normalize collision edge (assume collision axis is edge)
      const edgeDir = normalize(v2(), edge);

      // We know which way the edges were wound, so we implicitly know which order
      // these points should be used in to compute the normal.
      const edgeNormal = normal(v2(), line.point1.cpos, line.point2.cpos);

      for (let j = 0; j < circles.length; j++) {
        const circle = circles[j];

        // Vector from endpoint1 to particle
        const hypo = sub(v2(), circle.cpos, line.point1.cpos);

        // Where is the particle on the edge, before, after, or on?
        // Also used for interpolation later.
        const projection = dot(edge, hypo);
        const maxDot = dot(edge, edge);
        const edgeMag = Math.sqrt(maxDot);

        // Projection is beyond the enpoints!
        // If we were doing an intersection test, we'd use this to say there
        // was no intersection.
        // if (projection < 0 || projection > maxDot) return;

        // Create interpolation factor of where point closest
        // to particle is on the line.
        const t = projection / maxDot;
        const u = 1 - t;

        // Find the point of projection on the edge.
        const projectionPoint = v2();
        scale(projectionPoint, edgeDir, t * edgeMag);
        add(projectionPoint, projectionPoint, line.point1.cpos);

        const edgePointingToCircleDirection = sub(
          v2(),
          circle.cpos,
          projectionPoint
        );

        // both the edge normal and the segment from edge to circle are
        // facing a similar direction
        const similarity = dot(edgePointingToCircleDirection, edgeNormal);
        if (similarity > 0) continue;

        // If we get here, the directions so dissimilar that the circle must
        // be on the other side of the edge! Move it back!
        const offset = v2();
        sub(offset, projectionPoint, circle.cpos);
        add(circle.cpos, circle.cpos, offset);
        // Don't correct ppos, otherwise velocity will continue to increase
        // forever.
        // add(circle.ppos, circle.ppos, offset);
      }
    }

    render(circles, lines, constraints, ctx);
    if (!running) return;
    window.requestAnimationFrame(step);
  })();

  function makeStaticMesh(points: Vector2[]) {
    const clines: CollidableLine[] = [];
    const circles: CollidableCircle[] = [];
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const prev = circles.length === 0 ? null : circles[i - 1];
      const circle = {
        cpos: copy(v2(), point),
        ppos: copy(v2(), point),
        acel: v2(0, 0),
        mass: -1,
        radius: 1
      };
      if (prev) {
        const line = {
          point1: prev,
          point2: circle
        };
        clines.push(line);
      }
      circles.push(circle);
    }

    clines.push({
      point1: circles[circles.length - 1],
      point2: circles[0]
    });

    return clines;
  }

  function makeCircles(
    center: Vector2,
    spawnRadius: number,
    baseRadius: number,
    num: number
  ): CollidableCircle[] {
    const all = [];
    const minRadius = 10;
    for (let i = 0; i < num; i++) {
      const x = center.x + Math.cos(i) * spawnRadius;
      const y = center.y + Math.sin(i) * spawnRadius;
      all.push({
        cpos: { x, y },
        ppos: { x, y },
        acel: { x: 0, y: 0 },
        radius: Math.max(
          Math.abs(Math.cos(i) + Math.sin(i)) * baseRadius,
          minRadius
        ),
        mass: Math.max(Math.abs(Math.cos(i) + Math.sin(i)) * 1, 1)
      });
    }
    return all;
  }

  function makePolygon(gon: number, center: Vector2, radius: number) {
    const clines: CollidableLine[] = [];
    const circles: CollidableCircle[] = [];
    const constraints: DistanceConstraint[] = [];
    for (let i = 0; i < gon; i++) {
      const x = center.x + Math.cos((i / gon) * Math.PI * 2) * radius;
      const y = center.y + Math.sin((i / gon) * Math.PI * 2) * radius;
      circles.push({
        cpos: { x, y },
        ppos: { x, y },
        acel: { x: 0, y: 0 },
        radius: 5,
        mass: 5
      });
    }

    for (let i = 0; i < circles.length; i++) {
      const point1 = circles[i];
      const point2 = i === circles.length - 1 ? circles[0] : circles[i + 1];
      clines.push({
        point1,
        point2
      });
    }

    for (let i = 0; i < circles.length; i++) {
      const point1 = circles[i];
      let j = i;
      while (true) {
        j++;
        const point2 = circles[j % circles.length];
        if (point2 === point1) break;
        if (
          constraints.find(
            c =>
              (c.point1 === point1 && c.point2 === point2) ||
              (c.point2 === point1 && c.point1 === point2)
          ) !== undefined
        )
          break;
        constraints.push({
          point1,
          point2,
          goal: distance(point1.cpos, point2.cpos)
        });
      }
    }

    return {
      circles,
      lines: clines,
      constraints
    };
  }

  function render(
    circles: CollidableCircle[],
    segments: CollidableLine[],
    constraints: DistanceConstraint[],
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

    for (let i = 0; i < constraints.length; i++) {
      const c = constraints[i];
      ctx.strokeStyle = "magenta";
      ctx.beginPath();
      ctx.moveTo(c.point1.ppos.x, c.point1.ppos.y);
      ctx.lineTo(c.point2.ppos.x, c.point2.ppos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = "purple";
      ctx.moveTo(c.point1.cpos.x, c.point1.cpos.y);
      ctx.lineTo(c.point2.cpos.x, c.point2.cpos.y);
      ctx.stroke();
    }
  }
};
