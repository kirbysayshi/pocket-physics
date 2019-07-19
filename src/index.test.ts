import { solveGravitation } from "./solve-gravitation";
import { accelerate } from "./accelerate";
import { inertia } from "./inertia";
import { collideCircleCircle } from "./collide-circle-circle";
import { overlapCircleCircle } from "./overlap-circle-circle";
import { add, normal, scale, sub, v2 } from "./v2";
import { collideCircleEdge } from "./collide-circle-edge";
import { rewindToCollisionPoint } from "./rewind-to-collision-point";
import { overlapAABBAABB, AABBOverlapResult } from "./overlap-aabb-aabb";
import { collisionResponseAABB } from "./collision-response-aabb";
//import frictionAABB from './aabb-friction';

test("2d", () => {
  const point = {
    cpos: { x: 0, y: 0 },
    ppos: { x: 0, y: 0 },
    acel: { x: 10, y: 0 }
  };

  // 1 is the delta time between steps
  accelerate(point, 1);
  inertia(point);

  expect(point.cpos.x).toBe(0.02);
  expect(point.ppos.x).toBe(0.01);
  expect(point.acel.x).toBe(0);
});

test("2d gravitation", () => {
  const point1 = {
    cpos: { x: 0, y: 0 },
    ppos: { x: 0, y: 0 },
    acel: { x: 0, y: 0 }
  };

  const p1mass = 1;

  const point2 = {
    cpos: { x: 1, y: 0 },
    ppos: { x: 0, y: 0 },
    acel: { x: 0, y: 0 }
  };

  const p2mass = 1;

  solveGravitation(point1, p1mass, point2, p2mass, 1);
  solveGravitation(point2, p2mass, point1, p1mass, 1);

  expect(point1.acel.x).toBe(1);
  expect(point2.acel.x).toBe(-1);
  expect(point1.acel.x).toBe(point2.acel.x * -1);
});

test("2d collision with equal mass and inertia preserved", () => {
  const damping = 0.99;

  const point1 = {
    cpos: { x: 0, y: 0 },
    ppos: { x: 0, y: 0 },
    acel: { x: 0, y: 0 }
  };

  const point2 = {
    cpos: { x: 9, y: 0 },
    ppos: { x: 9, y: 0 },
    acel: { x: 0, y: 0 }
  };

  const p1mass = 1;
  const p2mass = 1;
  const p1radius = 5;
  const p2radius = 5;

  accelerate(point1, 1);
  accelerate(point2, 1);
  collideCircleCircle(
    point1,
    p1radius,
    p1mass,
    point2,
    p2radius,
    p2mass,
    false,
    damping
  );

  expect(point1.cpos.x).toBe(-0.5);
  expect(point1.cpos.y).toBe(0);
  expect(point1.ppos.x).toBe(0);
  expect(point1.ppos.y).toBe(0);
  expect(point2.cpos.x).toBe(9.5);
  expect(point2.cpos.y).toBe(0);
  expect(point2.ppos.x).toBe(9);
  expect(point2.ppos.y).toBe(0);

  inertia(point1);
  inertia(point2);

  expect(point1.cpos.x).toBe(-1);
  expect(point1.cpos.y).toBe(0);
  expect(point1.ppos.x).toBe(-0.5);
  expect(point1.ppos.y).toBe(0);
  expect(point2.cpos.x).toBe(10);
  expect(point2.cpos.y).toBe(0);
  expect(point2.ppos.x).toBe(9.5);
  expect(point2.ppos.y).toBe(0);

  collideCircleCircle(
    point1,
    p1radius,
    p1mass,
    point2,
    p2radius,
    p2mass,
    true,
    damping
  );

  expect(point1.cpos.x).toBe(-0.5);
  expect(point1.cpos.y).toBe(0);
  expect(point1.ppos.x).toBe(-0.9900000000000001);
  expect(point1.ppos.y).toBe(0);
  expect(point2.cpos.x).toBe(9.5);
  expect(point2.cpos.y).toBe(0);
  expect(point2.ppos.x).toBe(9.99);
  expect(point2.ppos.y).toBe(0);
});

test("2d collision with inequal mass and inertia preserved", () => {
  const damping = 0.99;

  const point1 = {
    cpos: { x: 0, y: 0 },
    ppos: { x: 0, y: 0 },
    acel: { x: 0, y: 0 }
  };

  const point2 = {
    cpos: { x: 9, y: 0 },
    ppos: { x: 9, y: 0 },
    acel: { x: 0, y: 0 }
  };

  const p1mass = 1;
  const p2mass = 3;
  const p1radius = 5;
  const p2radius = 5;

  accelerate(point1, 1);
  accelerate(point2, 1);
  collideCircleCircle(
    point1,
    p1radius,
    p1mass,
    point2,
    p2radius,
    p2mass,
    false,
    damping
  );

  expect(point1.cpos.x).toBe(-0.75);
  expect(point1.cpos.y).toBe(0);
  expect(point1.ppos.x).toBe(0);
  expect(point1.ppos.y).toBe(0);
  expect(point2.cpos.x).toBe(9.25);
  expect(point2.cpos.y).toBe(0);
  expect(point2.ppos.x).toBe(9);
  expect(point2.ppos.y).toBe(0);

  inertia(point1);
  inertia(point2);

  expect(point1.cpos.x).toBe(-1.5);
  expect(point1.cpos.y).toBe(0);
  expect(point1.ppos.x).toBe(-0.75);
  expect(point1.ppos.y).toBe(0);
  expect(point2.cpos.x).toBe(9.5);
  expect(point2.cpos.y).toBe(0);
  expect(point2.ppos.x).toBe(9.25);
  expect(point2.ppos.y).toBe(0);

  collideCircleCircle(
    point1,
    p1radius,
    p1mass,
    point2,
    p2radius,
    p2mass,
    true,
    damping
  );

  expect(point1.cpos.x).toBe(-0.75);
  expect(point1.cpos.y).toBe(0);
  expect(point1.ppos.x).toBe(-0.9900000000000001);
  expect(point1.ppos.y).toBe(0);
  expect(point2.cpos.x).toBe(9.25);
  expect(point2.cpos.y).toBe(0);
  expect(point2.ppos.x).toBe(9.33);
  expect(point2.ppos.y).toBe(0);
});

test("2d collision, vs infinite mass and inertia preserved", () => {
  const damping = 0.99;

  const point1 = {
    cpos: { x: 0, y: 0 },
    ppos: { x: 0, y: 0 },
    acel: { x: 0, y: 0 }
  };

  const point2 = {
    cpos: { x: 9, y: 0 },
    ppos: { x: 9, y: 0 },
    acel: { x: 0, y: 0 }
  };

  const p1mass = 1;
  const p2mass = Number.MAX_VALUE;
  const p1radius = 5;
  const p2radius = 5;

  accelerate(point1, 1);
  accelerate(point2, 1);
  collideCircleCircle(
    point1,
    p1radius,
    p1mass,
    point2,
    p2radius,
    p2mass,
    false,
    damping
  );

  expect(point1.cpos.x).toBe(-1);
  expect(point1.cpos.y).toBe(0);
  expect(point1.ppos.x).toBe(0);
  expect(point1.ppos.y).toBe(0);
  expect(point2.cpos.x).toBe(9);
  expect(point2.cpos.y).toBe(0);
  expect(point2.ppos.x).toBe(9);
  expect(point2.ppos.y).toBe(0);

  inertia(point1);
  inertia(point2);

  expect(point1.cpos.x).toBe(-2);
  expect(point1.cpos.y).toBe(0);
  expect(point1.ppos.x).toBe(-1);
  expect(point1.ppos.y).toBe(0);
  expect(point2.cpos.x).toBe(9);
  expect(point2.cpos.y).toBe(0);
  expect(point2.ppos.x).toBe(9);
  expect(point2.ppos.y).toBe(0);

  collideCircleCircle(
    point1,
    p1radius,
    p1mass,
    point2,
    p2radius,
    p2mass,
    true,
    damping
  );

  expect(point1.cpos.x).toBe(-1);
  expect(point1.cpos.y).toBe(0);
  expect(point1.ppos.x).toBe(-0.9900000000000001);
  expect(point1.ppos.y).toBe(0);
  expect(point2.cpos.x).toBe(9);
  expect(point2.cpos.y).toBe(0);
  expect(point2.ppos.x).toBe(9);
  expect(point2.ppos.y).toBe(0);
});

test("overlap circles", () => {
  const point1 = {
    cpos: { x: 0, y: 0 }
  };

  const point2 = {
    cpos: { x: 9, y: 0 }
  };

  const p1radius = 5;
  const p2radius = 5;

  const overlapping = overlapCircleCircle(
    point1.cpos.x,
    point1.cpos.y,
    p1radius,
    point2.cpos.x,
    point2.cpos.y,
    p2radius
  );

  expect(overlapping).toBeTruthy();
});

test("normal, existing point", () => {
  const out = { x: 0, y: 0 };
  const n = normal(out, { x: 2, y: 2 }, { x: 4, y: 4 });
  expect(n).toBe(out);
});

test("normal, down", () => {
  const n = normal({ x: 0, y: 0 }, { x: 2, y: 2 }, { x: 0, y: 2 });
  expect(n).toEqual({ x: 0, y: -1 });
});

test("normal, up", () => {
  const n = normal({ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 4, y: 0 });
  expect(n).toEqual({ x: 0, y: 1 });
});

test("normal, left", () => {
  const n = normal({ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 2 });
  expect(n).toEqual({ x: -1, y: 0 });
});

test("normal, right", () => {
  const n = normal({ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 2, y: -2 });
  expect(n).toEqual({ x: 1, y: 0 });
});

test.skip("collide circle edge, equal mass", () => {
  const damping = 0.99;

  const point1 = {
    cpos: { x: 0, y: 0 },
    ppos: { x: 0, y: 0 },
    acel: { x: 0, y: 0 }
  };

  const point2 = {
    cpos: { x: 5, y: 0 },
    ppos: { x: 5, y: 0 },
    acel: { x: 0, y: 0 }
  };

  const point3 = {
    cpos: { x: 2.5, y: 1 },
    ppos: { x: 2.5, y: 1 },
    acel: { x: 0, y: 0 }
  };

  const radius3 = 2;

  const mass1 = 0.5;
  const mass2 = 0.5;
  const mass3 = 0.5;

  const checkpoint1Top = {
    cpos: { x: 0, y: 1 },
    ppos: { x: 0, y: 1 },
    acel: { x: 0, y: 0 }
  };

  const checkpoint1Bottom = {
    cpos: { x: 0, y: 0 },
    ppos: { x: 0, y: 0 },
    acel: { x: 0, y: 0 }
  };

  const checkpoint2Top = {
    cpos: { x: 5, y: 1 },
    ppos: { x: 5, y: 1 },
    acel: { x: 0, y: 0 }
  };

  const checkpoint2Bottom = {
    cpos: { x: 5, y: 0 },
    ppos: { x: 5, y: 0 },
    acel: { x: 0, y: 0 }
  };

  // Just like the edge...
  const checkpointBottomRadius = 0;

  accelerate(point1, 1);
  accelerate(point2, 1);
  accelerate(point3, 1);

  accelerate(checkpoint1Top, 1);
  accelerate(checkpoint1Bottom, 1);
  accelerate(checkpoint2Top, 1);
  accelerate(checkpoint2Bottom, 1);

  collideCircleEdge(
    point3,
    radius3,
    mass3,
    point1,
    mass1,
    point2,
    mass2,
    false,
    damping
  );

  collideCircleCircle(
    checkpoint1Top,
    radius3,
    mass3 / 2,
    checkpoint1Bottom,
    checkpointBottomRadius,
    mass1,
    false,
    damping
  );

  collideCircleCircle(
    checkpoint2Top,
    radius3,
    mass3 / 2,
    checkpoint2Bottom,
    checkpointBottomRadius,
    mass2,
    false,
    damping
  );

  expect(point3.cpos.y).toBe(checkpoint1Top.cpos.y);
  expect(point1.cpos.y).toBe(checkpoint1Bottom.cpos.y);
  expect(point1.ppos.y).toBe(checkpoint1Bottom.ppos.y);
  expect(point2.cpos.y).toBe(checkpoint2Bottom.cpos.y);
  expect(point2.ppos.y).toBe(checkpoint2Bottom.ppos.y);

  inertia(point1);
  inertia(point2);
  inertia(point3);

  inertia(checkpoint1Top);
  inertia(checkpoint1Bottom);
  inertia(checkpoint2Top);
  inertia(checkpoint2Bottom);

  expect(point3.cpos.y).toBe(checkpoint1Top.cpos.y);
  expect(point1.cpos.y).toBe(checkpoint1Bottom.cpos.y);
  expect(point1.ppos.y).toBe(checkpoint1Bottom.ppos.y);
  expect(point2.cpos.y).toBe(checkpoint2Bottom.cpos.y);
  expect(point2.ppos.y).toBe(checkpoint2Bottom.ppos.y);

  collideCircleEdge(
    point3,
    radius3,
    mass3,
    point1,
    mass1,
    point2,
    mass2,
    true,
    damping
  );

  collideCircleCircle(
    checkpoint1Top,
    radius3,
    mass3 / 2,
    checkpoint1Bottom,
    checkpointBottomRadius,
    mass1,
    true,
    damping
  );

  collideCircleCircle(
    checkpoint2Top,
    radius3,
    mass3 / 2,
    checkpoint2Bottom,
    checkpointBottomRadius,
    mass2,
    true,
    damping
  );

  expect(point1.cpos.y).toBe(checkpoint1Bottom.cpos.y);
  expect(point1.ppos.y).toBe(checkpoint1Bottom.ppos.y);
  expect(point2.cpos.y).toBe(checkpoint2Bottom.cpos.y);
  expect(point2.ppos.y).toBe(checkpoint2Bottom.ppos.y);

  expect(point3.cpos.y).toBe(checkpoint1Top.cpos.y);
  expect(point3.ppos.y).toBe(checkpoint1Top.ppos.y);

  expect(point1.cpos.x).toBe(0);
  expect(point2.cpos.x).toBe(5);
  expect(point3.cpos.x).toBe(2.5);
});

test.skip("collide circle edge, equal mass, start", () => {
  const damping = 0.99;

  //       (point3)
  //          v
  // (point1) --------- (point2)

  //    (checkpoint3)
  //         v
  //    (checkpoint2)

  const point1 = {
    cpos: { x: 0, y: 0 },
    ppos: { x: 0, y: 0 },
    acel: { x: 0, y: 0 }
  };

  const point2 = {
    cpos: { x: 5, y: 0 },
    ppos: { x: 5, y: 0 },
    acel: { x: 0, y: 0 }
  };

  const point3 = {
    cpos: { x: 0, y: 1 },
    ppos: { x: 0, y: 1 },
    acel: { x: 0, y: 0 }
  };

  const radius3 = 2;

  const mass1 = 0.5;
  const mass2 = 0.5;
  const mass3 = 1;

  const checkpoint3 = {
    cpos: { x: 0, y: 1 },
    ppos: { x: 0, y: 1 },
    acel: { x: 0, y: 0 }
  };

  const checkpoint2 = {
    cpos: { x: 0, y: 0 },
    ppos: { x: 0, y: 0 },
    acel: { x: 0, y: 0 }
  };

  // Just like the edge...
  const checkpoint2Radius = 0;

  accelerate(point1, 1);
  accelerate(point2, 1);
  accelerate(point3, 1);

  accelerate(checkpoint2, 1);
  accelerate(checkpoint3, 1);

  collideCircleEdge(
    point3,
    radius3,
    mass3,
    point1,
    mass1,
    point2,
    mass2,
    false,
    damping
  );

  collideCircleCircle(
    checkpoint3,
    radius3,
    mass3,
    checkpoint2,
    checkpoint2Radius,
    mass2,
    false,
    damping
  );

  expect(point1.cpos.y).toBe(checkpoint2.cpos.y);
  expect(point1.ppos.y).toBe(checkpoint2.ppos.y);
  expect(point2.cpos.y).not.toBe(checkpoint2.cpos.y);
  expect(point2.ppos.y).toBe(checkpoint2.ppos.y);

  // Do some fakery, just to allow our checkpoints to succeed. The projection
  // of the point3 along the edge line will be different the second time, since
  // the edge is now at an angle slightly (endpoint1 has moved), meaning some
  // of the collision inertia will be applied to endpoint2, reducing the total
  // collision force applied to endpoint1, and making it not match checkpoint1.
  point2.cpos.y = point1.cpos.y;
  point2.ppos.y = point1.ppos.y;

  inertia(point1);
  inertia(point2);
  inertia(point3);

  inertia(checkpoint2);
  inertia(checkpoint3);

  collideCircleEdge(
    point3,
    radius3,
    mass3,
    point1,
    mass1,
    point2,
    mass2,
    true,
    damping
  );

  collideCircleCircle(
    checkpoint3,
    radius3,
    mass3,
    checkpoint2,
    checkpoint2Radius,
    mass2,
    true,
    damping
  );

  expect(point1.cpos.y).toBe(checkpoint2.cpos.y);
  expect(point1.ppos.y).toBe(checkpoint2.ppos.y);

  expect(point2.cpos.y).not.toBe(checkpoint2.cpos.y);
  expect(point2.ppos.y).not.toBe(checkpoint2.ppos.y);

  expect(point3.cpos.y).toBe(checkpoint3.cpos.y);
  expect(point3.ppos.y).toBe(checkpoint3.ppos.y);

  expect(point1.cpos.x).toBe(0);
  expect(point2.cpos.x).toBe(5);
  expect(point3.cpos.x).toBe(0);

});

test.skip("tunneling", () => {
  const point1 = {
    cpos: { x: 0, y: 0 },
    ppos: { x: 0, y: 0 },
    acel: { x: 0, y: 0 }
  };

  const point2 = {
    cpos: { x: 5, y: 0 },
    ppos: { x: 5, y: 0 },
    acel: { x: 0, y: 0 }
  };

  const point3 = {
    cpos: { x: 2.5, y: -2 },
    ppos: { x: 2.5, y: 2 },
    acel: { x: 0, y: 0 }
  };

  rewindToCollisionPoint(point3, point1, point2);

  console.log("point1", point1);
  console.log("point2", point2);
  console.log("point3", point3);
  
});

test("aabb2 overlap, very oblong", () => {
  const box1 = {
    cpos: { x: 0, y: 0 },
    w: 100,
    h: 1
  };

  const box2 = {
    cpos: { x: 50, y: 0 },
    w: 200,
    h: 1
  };

  // The amount to move box2 to not overlap with box1.
  const resolutionVector: AABBOverlapResult = {
    resolve: v2(),
    hitPos: v2(),
    normal: v2()
  };

  const isOverlapping = overlapAABBAABB(
    box1.cpos.x,
    box1.cpos.y,
    box1.w,
    box1.h,
    box2.cpos.x,
    box2.cpos.y,
    box2.w,
    box2.h,
    resolutionVector
  );

  expect(isOverlapping).toBe(resolutionVector);
  expect(resolutionVector.resolve.x).toBe(0);
  expect(resolutionVector.resolve.y).toBe(1);
});

test("aabb2 overlap X", () => {
  const box1 = {
    cpos: { x: 0, y: 0 },
    w: 10,
    h: 20
  };

  const box2 = {
    cpos: { x: 2, y: 5 },
    w: 10,
    h: 20
  };

  const result: AABBOverlapResult = {
    resolve: v2(),
    hitPos: v2(),
    normal: v2()
  };

  const isOverlapping = overlapAABBAABB(
    box1.cpos.x,
    box1.cpos.y,
    box1.w,
    box1.h,
    box2.cpos.x,
    box2.cpos.y,
    box2.w,
    box2.h,
    result
  );

  expect(isOverlapping).toBe(result);
  expect(result.resolve.x).toBe(8);
  expect(result.resolve.y).toBe(0);

  expect(result.hitPos.x).toBe(5);
  expect(result.hitPos.y).toBe(5);

  expect(result.normal.x).toBe(1);
});

test("aabb2 overlap Y", () => {
  const box1 = {
    cpos: { x: 0, y: 0 },
    w: 20,
    h: 10
  };

  const box2 = {
    cpos: { x: 2, y: 5 },
    w: 20,
    h: 10
  };

  const result: AABBOverlapResult = {
    resolve: v2(),
    hitPos: v2(),
    normal: v2()
  };

  const isOverlapping = overlapAABBAABB(
    box1.cpos.x,
    box1.cpos.y,
    box1.w,
    box1.h,
    box2.cpos.x,
    box2.cpos.y,
    box2.w,
    box2.h,
    result
  );

  expect(isOverlapping).toBe(result);
  expect(result.resolve.x).toBe(0);
  expect(result.resolve.y).toBe(5);

  expect(result.hitPos.x).toBe(2);
  expect(result.hitPos.y).toBe(5);

  expect(result.normal.y).toBe(1);
});

test("aabb collision-response", () => {
  const box1 = {
    cpos: { x: 0, y: 0 },
    ppos: { x: -5, y: -5 },
    w: 5,
    h: 5,
    mass: 1,
    restitution: 1,
    staticFriction: 0,
    dynamicFriction: 0
  };

  const box2 = {
    cpos: { x: 5, y: 0 },
    ppos: { x: 10, y: -5 },
    w: 5,
    h: 5,
    mass: 1,
    restitution: 1,
    staticFriction: 0,
    dynamicFriction: 0
  };

  const collision: AABBOverlapResult = {
    resolve: v2(),
    hitPos: v2(),
    normal: v2()
  };
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

  const box1v = v2();
  const box2v = v2();

  collisionResponseAABB(
    box1.cpos,
    box1.ppos,
    box1.mass,
    box1.restitution,
    box1.staticFriction,
    box1.dynamicFriction,
    box2.cpos,
    box2.ppos,
    box2.mass,
    box2.restitution,
    box2.staticFriction,
    box2.dynamicFriction,
    collision.normal,
    box1v,
    box2v
  );

  // Apply the new velocity
  sub(box1.ppos, box1.cpos, box1v);
  sub(box2.ppos, box2.cpos, box2v);

  expect(box1.cpos).toEqual({ x: 0, y: 0 });
  expect(box2.cpos).toEqual({ x: 5, y: 0 });

  expect(box1.ppos).toEqual({ x: 5, y: -5 });
  expect(box2.ppos).toEqual({ x: 0, y: -5 });
});

test("aabb collision-response: very inequal masses", () => {
  const box1 = {
    cpos: { x: 0, y: 0 },
    ppos: { x: -5, y: -5 },
    w: 5,
    h: 5,
    mass: 10000000000,
    restitution: 1,
    staticFriction: 0,
    dynamicFriction: 0
  };

  const box2 = {
    cpos: { x: 5, y: 0 },
    ppos: { x: 10, y: -5 },
    w: 5,
    h: 5,
    mass: 1,
    restitution: 1,
    staticFriction: 0,
    dynamicFriction: 0
  };

  const collision: AABBOverlapResult = {
    resolve: v2(),
    hitPos: v2(),
    normal: v2()
  };
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

  const box1v = v2();
  const box2v = v2();

  collisionResponseAABB(
    box1.cpos,
    box1.ppos,
    box1.mass,
    box1.restitution,
    box1.staticFriction,
    box1.dynamicFriction,
    box2.cpos,
    box2.ppos,
    box2.mass,
    box2.restitution,
    box2.staticFriction,
    box2.dynamicFriction,
    collision.normal,
    box1v,
    box2v
  );

  // Apply the new velocity
  sub(box1.ppos, box1.cpos, box1v);
  sub(box2.ppos, box2.cpos, box2v);

  expect(box1.cpos).toEqual({ x: 0, y: 0 });
  expect(box2.cpos).toEqual({ x: 5, y: 0 });

  expect(box1.ppos).toEqual({ x: -4.999999998, y: -5 });
  expect(box2.ppos).toEqual({ x: -9.999999998, y: -5 });
});

test("aabb friction", () => {
  const box1 = {
    cpos: { x: 0, y: 0 },
    ppos: { x: -5, y: -5 },
    w: 5,
    h: 5,
    mass: 1,
    restitution: 1,
    staticFriction: 0.5,
    dynamicFriction: 0.5
  };

  const box2 = {
    cpos: { x: 4, y: 0 },
    ppos: { x: 9, y: -5 },
    w: 5,
    h: 5,
    mass: 1,
    restitution: 1,
    staticFriction: 0.5,
    dynamicFriction: 0.5
  };

  const collision: AABBOverlapResult = {
    resolve: v2(),
    hitPos: v2(),
    normal: v2()
  };

  // TODO: no need for isOverlapping, just use a known collision normal
  // + already computed collision response ppos(s).

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

  console.log(collision);

  // move to non-overlapping position
  const overlapHalf = scale(v2(), collision.resolve, 0.5);
  add(box2.cpos, box2.cpos, overlapHalf);
  add(box2.ppos, box2.ppos, overlapHalf);
  sub(box1.cpos, box1.cpos, overlapHalf);
  sub(box1.ppos, box1.ppos, overlapHalf);

  const box1v = v2();
  const box2v = v2();

  collisionResponseAABB(
    box1.cpos,
    box1.ppos,
    box1.mass,
    box1.restitution,
    box1.staticFriction,
    box1.dynamicFriction,
    box2.cpos,
    box2.ppos,
    box2.mass,
    box2.restitution,
    box2.staticFriction,
    box2.dynamicFriction,
    collision.normal,
    box1v,
    box2v
  );

  // Apply the new velocity
  sub(box1.ppos, box1.cpos, box1v);
  sub(box2.ppos, box2.cpos, box2v);

  console.log(box1v);
  console.log(box2v);

  console.log(box1.ppos);
  console.log(box2.ppos);

  expect(box1.cpos).toEqual({ x: -0.5, y: 0 });
  expect(box2.cpos).toEqual({ x: 4.5, y: 0 });

  expect(box1.ppos).toEqual({ x: 4.5, y: -2.5 });
  expect(box2.ppos).toEqual({ x: -0.5, y: -2.5 });
});
