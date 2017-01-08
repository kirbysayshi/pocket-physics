import test from 'tape';
import gravitation2d from './gravitation2d';
import accelerate2d from './accelerate2d';
import inertia2d from './inertia2d';
import spring2d from './springconstraint2d';
import collideCircleCircle from './collidecirclecircle';
import overlapcirclecircle from './overlapcirclecircle';
import {
  add,
  normal,
  scale,
  set,
  sub,
  v2,
} from './v2';
import collideCircleEdge from './collidecircleedge';
import rewindToCollisionPoint from './rewindtocollisionpoint';
import { default as overlapAABBAABB2 } from './overlapaabbaabb2';
import collisionResponseAABB from './collision-response-aabb';
//import frictionAABB from './aabb-friction';

test('2d', t => {

  const point = {
    cpos: { x: 0, y: 0 },
    ppos: { x: 0, y: 0 },
    acel: { x: 10, y: 0 }
  };

  // 1 is the delta time between steps
  accelerate2d(point, 1);
  inertia2d(point);

  t.equals(point.cpos.x, 0.02, 'current position is correct');
  t.equals(point.ppos.x, 0.01, 'previous position is correct');
  t.equals(point.acel.x, 0, 'acceleration is reset');
  t.end();
})

test('2d gravitation', t => {

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

  gravitation2d(point1, p1mass, point2, p2mass, 1);
  gravitation2d(point2, p2mass, point1, p1mass, 1);

  t.equals(point1.acel.x, 1, 'gravitation1 is correct');
  t.equals(point2.acel.x, -1, 'gravitation2 is correct');
  t.equals(point1.acel.x, (point2.acel.x) * -1 , 'gravitation equal and opposite');
  t.end();
})

test('2d spring constraint with equal mass', t => {
  const point1 = {
    cpos: { x: 0, y: 0 },
    ppos: { x: 0, y: 0 },
    acel: { x: 0, y: 0 }
  };

  const point2 = {
    cpos: { x: 10, y: 0 },
    ppos: { x: 10, y: 0 },
    acel: { x: 0, y: 0 }
  };

  const p1mass = 25;
  const p2mass = 25;

  accelerate2d(point1, 1);
  accelerate2d(point2, 1);
  spring2d(point2, p2mass, point1, p1mass, 0.1, 0.9);
  inertia2d(point1, 1);
  inertia2d(point2, 1);

  t.equal(point2.acel.x, -0.036000000000000004, 'point2 moves towards point1');
  t.end();
})

test('2d collision with equal mass and inertia preserved', t => {

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

  accelerate2d(point1, 1);
  accelerate2d(point2, 1);
  collideCircleCircle(point1, p1radius, p1mass, point2, p2radius, p2mass, false, damping);

  t.equal(point1.cpos.x, -0.5, 'point1 moves left');
  t.equal(point1.cpos.y, 0, 'point1 does not move vertically');
  t.equal(point1.ppos.x, 0, 'point1 has not had inertia applied(x)');
  t.equal(point1.ppos.y, 0, 'point1 has not had inertia applied(y)');
  t.equal(point2.cpos.x, 9.5, 'point2 moves right');
  t.equal(point2.cpos.y, 0, 'point2 does not move vertically');
  t.equal(point2.ppos.x, 9, 'point2 has not had inertia applied(x)');
  t.equal(point2.ppos.y, 0, 'point2 has not had inertia applied(y)');

  inertia2d(point1, 1);
  inertia2d(point2, 1);

  t.equal(point1.cpos.x, -1, 'point1 continues left');
  t.equal(point1.cpos.y, 0, 'point1 does not move vertically');
  t.equal(point1.ppos.x, -0.5, 'point1 has inertia applied(x)');
  t.equal(point1.ppos.y, 0, 'point1 has inertia applied(y)');
  t.equal(point2.cpos.x, 10, 'point2 continues right');
  t.equal(point2.cpos.y, 0, 'point2 does not move vertically');
  t.equal(point2.ppos.x, 9.5, 'point2 has inertia applied(x)');
  t.equal(point2.ppos.y, 0, 'point2 has inertia applied(y)');

  collideCircleCircle(point1, p1radius, p1mass, point2, p2radius, p2mass, true, damping);

  t.equal(point1.cpos.x, -0.5, 'point1 is corrected left');
  t.equal(point1.cpos.y, 0, 'point1 does not move vertically');
  t.equal(point1.ppos.x, -0.9900000000000001, 'point1 has inertia applied(x)');
  t.equal(point1.ppos.y, 0, 'point1 has not had inertia applied(y)');
  t.equal(point2.cpos.x, 9.5, 'point2 is corrected right');
  t.equal(point2.cpos.y, 0, 'point2 does not move vertically');
  t.equal(point2.ppos.x, 9.99, 'point2 has inertia applied(x)');
  t.equal(point2.ppos.y, 0, 'point2 has inertia applied(y)');

  t.end();
})

test('2d collision with inequal mass and inertia preserved', t => {

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

  accelerate2d(point1, 1);
  accelerate2d(point2, 1);
  collideCircleCircle(point1, p1radius, p1mass, point2, p2radius, p2mass, false, damping);

  t.equal(point1.cpos.x, -0.75, 'point1 moves left');
  t.equal(point1.cpos.y, 0, 'point1 does not move vertically');
  t.equal(point1.ppos.x, 0, 'point1 has not had inertia applied(x)');
  t.equal(point1.ppos.y, 0, 'point1 has not had inertia applied(y)');
  t.equal(point2.cpos.x, 9.25, 'point2 moves right');
  t.equal(point2.cpos.y, 0, 'point2 does not move vertically');
  t.equal(point2.ppos.x, 9, 'point2 has not had inertia applied(x)');
  t.equal(point2.ppos.y, 0, 'point2 has not had inertia applied(y)');

  inertia2d(point1, 1);
  inertia2d(point2, 1);

  t.equal(point1.cpos.x, -1.5, 'point1 continues left');
  t.equal(point1.cpos.y, 0, 'point1 does not move vertically');
  t.equal(point1.ppos.x, -0.75, 'point1 has inertia applied(x)');
  t.equal(point1.ppos.y, 0, 'point1 has inertia applied(y)');
  t.equal(point2.cpos.x, 9.5, 'point2 continues right');
  t.equal(point2.cpos.y, 0, 'point2 does not move vertically');
  t.equal(point2.ppos.x, 9.25, 'point2 had inertia applied(x)');
  t.equal(point2.ppos.y, 0, 'point2 had inertia applied(y)');

  collideCircleCircle(point1, p1radius, p1mass, point2, p2radius, p2mass, true, damping);

  t.equal(point1.cpos.x, -0.75, 'point1 is corrected left');
  t.equal(point1.cpos.y, 0, 'point1 does not move vertically');
  t.equal(point1.ppos.x, -0.9900000000000001, 'point1 has inertia applied(x)');
  t.equal(point1.ppos.y, 0, 'point1 has not had inertia applied(y)');
  t.equal(point2.cpos.x, 9.25, 'point2 is corrected right');
  t.equal(point2.cpos.y, 0, 'point2 does not move vertically');
  t.equal(point2.ppos.x, 9.33, 'point2 has inertia applied(x)');
  t.equal(point2.ppos.y, 0, 'point2 has inertia applied(y)');

  t.end();
})

test('2d collision, vs infinite mass and inertia preserved', t => {

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

  accelerate2d(point1, 1);
  accelerate2d(point2, 1);
  collideCircleCircle(point1, p1radius, p1mass, point2, p2radius, p2mass, false, damping);

  t.equal(point1.cpos.x, -1, 'point1 moves left');
  t.equal(point1.cpos.y, 0, 'point1 does not move vertically');
  t.equal(point1.ppos.x, 0, 'point1 has not had inertia applied(x)');
  t.equal(point1.ppos.y, 0, 'point1 has not had inertia applied(y)');
  t.equal(point2.cpos.x, 9, 'point2 does not move right');
  t.equal(point2.cpos.y, 0, 'point2 does not move vertically');
  t.equal(point2.ppos.x, 9, 'point2 has not had inertia applied(x)');
  t.equal(point2.ppos.y, 0, 'point2 has not had inertia applied(y)');

  inertia2d(point1, 1);
  inertia2d(point2, 1);

  t.equal(point1.cpos.x, -2, 'point1 continues left');
  t.equal(point1.cpos.y, 0, 'point1 does not move vertically');
  t.equal(point1.ppos.x, -1, 'point1 has inertia applied(x)');
  t.equal(point1.ppos.y, 0, 'point1 has inertia applied(y)');
  t.equal(point2.cpos.x, 9, 'point2 does not continue right');
  t.equal(point2.cpos.y, 0, 'point2 does not move vertically');
  t.equal(point2.ppos.x, 9, 'point2 has not had inertia applied(x)');
  t.equal(point2.ppos.y, 0, 'point2 has not had inertia applied(y)');

  collideCircleCircle(point1, p1radius, p1mass, point2, p2radius, p2mass, true, damping);

  t.equal(point1.cpos.x, -1, 'point1 is corrected left');
  t.equal(point1.cpos.y, 0, 'point1 does not move vertically');
  t.equal(point1.ppos.x, -0.9900000000000001, 'point1 has inertia applied(x)');
  t.equal(point1.ppos.y, 0, 'point1 has not had inertia applied(y)');
  t.equal(point2.cpos.x, 9, 'point2 is not corrected right');
  t.equal(point2.cpos.y, 0, 'point2 does not move vertically');
  t.equal(point2.ppos.x, 9, 'point2 has not had inertia applied(x)');
  t.equal(point2.ppos.y, 0, 'point2 has not had inertia applied(y)');

  t.end();
})

test('overlap circles', t => {
  const point1 = {
    cpos: { x: 0, y: 0 }
  };

  const point2 = {
    cpos: { x: 9, y: 0 }
  };

  const p1radius = 5;
  const p2radius = 5;

  const overlapping = overlapcirclecircle(
    point1.cpos.x, point1.cpos.y, p1radius,
    point2.cpos.x, point2.cpos.y, p2radius
  );

  t.ok(overlapping, 'circles are overlapping');
  t.end();
})

test('normal, existing point', t => {
  const out = { x: 0, y: 0 };
  const n = normal(out, { x: 2, y: 2 }, { x: 4, y: 4 });
  t.equal(n, out, 'same object given is returned');
  t.end();
})

test('normal, down', t => {
  const n = normal({ x: 0, y: 0 }, { x: 2, y: 2 }, { x: 0, y: 2 });
  t.deepEqual(n, { x: 0, y: -1 });
  t.end();
})

test('normal, up', t => {
  const n = normal({ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 4, y: 0 });
  t.deepEqual(n, { x: 0, y: 1 });
  t.end();
})

test('normal, left', t => {
  const n = normal({ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 2 });
  t.deepEqual(n, { x: -1, y: 0 });
  t.end();
})

test('normal, right', t => {
  const n = normal({ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 2, y: -2 });
  t.deepEqual(n, { x: 1, y: 0 });
  t.end();
})

test.skip('collide circle edge, equal mass', t => {
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

  accelerate2d(point1, 1);
  accelerate2d(point2, 1);
  accelerate2d(point3, 1);

  accelerate2d(checkpoint1Top, 1);
  accelerate2d(checkpoint1Bottom, 1);
  accelerate2d(checkpoint2Top, 1);
  accelerate2d(checkpoint2Bottom, 1);

  collideCircleEdge(
    point3, radius3, mass3,
    point1, mass1,
    point2, mass2,
    false, damping);

  collideCircleCircle(
    checkpoint1Top, radius3, mass3 / 2,
    checkpoint1Bottom, checkpointBottomRadius, mass1,
    false, damping);

  collideCircleCircle(
    checkpoint2Top, radius3, mass3 / 2,
    checkpoint2Bottom, checkpointBottomRadius, mass2,
    false, damping);

  t.equal(point3.cpos.y, checkpoint1Top.cpos.y,
    'before inertia: point3.cpos.y matches checkpoint1Top.cpos.y');
  t.equal(point1.cpos.y, checkpoint1Bottom.cpos.y,
    'before inertia: endpoint1.cpos.y matches checkpoint1Bottom.cpos.y');
  t.equal(point1.ppos.y, checkpoint1Bottom.ppos.y,
    'before inertia: endpoint1.ppos.y matches checkpoint1Bottom.ppos.y');
  t.equal(point2.cpos.y, checkpoint2Bottom.cpos.y,
    'before inertia: endpoint2.cpos.y matches checkpoint2Bottom.cpos.y');
  t.equal(point2.ppos.y, checkpoint2Bottom.ppos.y,
    'before inertia: endpoint2.ppos.y matches checkpoint2Bottom.ppos.y');

  inertia2d(point1, 1);
  inertia2d(point2, 1);
  inertia2d(point3, 1);

  inertia2d(checkpoint1Top, 1);
  inertia2d(checkpoint1Bottom, 1);
  inertia2d(checkpoint2Top, 1);
  inertia2d(checkpoint2Bottom, 1);

  t.equal(point3.cpos.y, checkpoint1Top.cpos.y,
    'after inertia2d: point3.cpos.y matches checkpoint1Top.cpos.y');
  t.equal(point1.cpos.y, checkpoint1Bottom.cpos.y,
    'after inertia2d: endpoint1.cpos.y matches checkpoint1Bottom.cpos.y');
  t.equal(point1.ppos.y, checkpoint1Bottom.ppos.y,
    'after inertia2d: endpoint1.ppos.y matches checkpoint1Bottom.ppos.y');
  t.equal(point2.cpos.y, checkpoint2Bottom.cpos.y,
    'after inertia2d: endpoint2.cpos.y matches checkpoint2Bottom.cpos.y');
  t.equal(point2.ppos.y, checkpoint2Bottom.ppos.y,
    'after inertia2d: endpoint2.ppos.y matches checkpoint2Bottom.ppos.y');

  collideCircleEdge(
    point3, radius3, mass3,
    point1, mass1,
    point2, mass2,
    true, damping);

  collideCircleCircle(
    checkpoint1Top, radius3, mass3 / 2,
    checkpoint1Bottom, checkpointBottomRadius, mass1,
    true, damping);

  collideCircleCircle(
    checkpoint2Top, radius3, mass3 / 2,
    checkpoint2Bottom, checkpointBottomRadius, mass2,
    true, damping);

  t.equal(point1.cpos.y, checkpoint1Bottom.cpos.y,
    'after inertia: endpoint1.cpos.y matches checkpoint1Bottom.cpos.y');
  t.equal(point1.ppos.y, checkpoint1Bottom.ppos.y,
    'after inertia: endpoint1.ppos.y matches checkpoint1Bottom.ppos.y');
  t.equal(point2.cpos.y, checkpoint2Bottom.cpos.y,
    'after inertia: endpoint2.cpos.y matches checkpoint2Bottom.cpos.y');
  t.equal(point2.ppos.y, checkpoint2Bottom.ppos.y,
    'after inertia: endpoint2.ppos.y matches checkpoint2Bottom.ppos.y');

  t.equal(point3.cpos.y, checkpoint1Top.cpos.y,
    'after inertia: point3.cpos.y matches checkpoint1Top.cpos.y');
  t.equal(point3.ppos.y, checkpoint1Top.ppos.y,
    'after inertia: point3.ppos.y matches checkpoint1Top.ppos.y');

  t.equal(point1.cpos.x, 0, 'edge has not moved horizontally');
  t.equal(point2.cpos.x, 5, 'edge has not moved horizontally');
  t.equal(point3.cpos.x, 2.5, 'point has not moved horizontally');

  t.end();
})

test.skip('collide circle edge, equal mass, start', t => {
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

  accelerate2d(point1, 1);
  accelerate2d(point2, 1);
  accelerate2d(point3, 1);

  accelerate2d(checkpoint2, 1);
  accelerate2d(checkpoint3, 1);

  collideCircleEdge(
    point3, radius3, mass3,
    point1, mass1,
    point2, mass2,
    false, damping);

  collideCircleCircle(
    checkpoint3, radius3, mass3,
    checkpoint2, checkpoint2Radius, mass2,
    false, damping);

  t.equal(point1.cpos.y, checkpoint2.cpos.y,
    'before inertia: endpoint1.cpos.y matches checkpoint2.cpos.y');
  t.equal(point1.ppos.y, checkpoint2.ppos.y,
    'before inertia: endpoint1.ppos.y matches checkpoint2.ppos.y');
  t.notEqual(point2.cpos.y, checkpoint2.cpos.y,
    'before inertia: endpoint2.cpos.y does not match checkpoint2.cpos.y');
  t.equal(point2.ppos.y, checkpoint2.ppos.y,
    'before inertia: endpoint2.ppos.y matches checkpoint2.ppos.y');

  // Do some fakery, just to allow our checkpoints to succeed. The projection
  // of the point3 along the edge line will be different the second time, since
  // the edge is now at an angle slightly (endpoint1 has moved), meaning some
  // of the collision inertia will be applied to endpoint2, reducing the total
  // collision force applied to endpoint1, and making it not match checkpoint1.
  point2.cpos.y = point1.cpos.y;
  point2.ppos.y = point1.ppos.y;

  inertia2d(point1, 1);
  inertia2d(point2, 1);
  inertia2d(point3, 1);

  inertia2d(checkpoint2, 1);
  inertia2d(checkpoint3, 1);

  collideCircleEdge(
    point3, radius3, mass3,
    point1, mass1,
    point2, mass2,
    true, damping);

  collideCircleCircle(
    checkpoint3, radius3, mass3,
    checkpoint2, checkpoint2Radius, mass2,
    true, damping);

  t.equal(point1.cpos.y, checkpoint2.cpos.y,
    'after inertia: endpoint1.cpos.y matches checkpoint2.cpos.y');
  t.equal(point1.ppos.y, checkpoint2.ppos.y,
    'after inertia: endpoint1.ppos.y matches checkpoint2.ppos.y');

  t.notEqual(point2.cpos.y, checkpoint2.cpos.y,
    'after inertia: endpoint2.cpos.y does not match checkpoint2.cpos.y');
  t.notEqual(point2.ppos.y, checkpoint2.ppos.y,
    'after inertia: endpoint2.ppos.y does not match checkpoint2.ppos.y');

  t.equal(point3.cpos.y, checkpoint3.cpos.y,
    'after inertia: point3.cpos.y matches checkpoint3.cpos.y');
  t.equal(point3.ppos.y, checkpoint3.ppos.y,
    'after inertia: point3.ppos.y matches checkpoint3.ppos.y');

  t.equal(point1.cpos.x, 0, 'edge has not moved horizontally');
  t.equal(point2.cpos.x, 5, 'edge has not moved horizontally');
  t.equal(point3.cpos.x, 0, 'point has not moved horizontally');

  t.end();
});

test.skip('tunneling', t => {

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

  console.log('point1', point1)
  console.log('point2', point2)
  console.log('point3', point3)

});

test('aabb2 overlap, very oblong', t => {
  const box1 = {
    cpos: { x: 0, y: 0 },
    w: 100,
    h: 1,
  }

  const box2 = {
    cpos: { x: 50, y: 0 },
    w: 200,
    h: 1,
  }

  // The amount to move box2 to not overlap with box1.
  const resolutionVector = {}

  const isOverlapping = overlapAABBAABB2(
    box1.cpos.x, box1.cpos.y, box1.w, box1.h,
    box2.cpos.x, box2.cpos.y, box2.w, box2.h,
    resolutionVector
  );

  t.equal(isOverlapping, resolutionVector, 'should be overlapping');
  t.equal(resolutionVector.resolve.x, 0, 'x resolution');
  t.equal(resolutionVector.resolve.y, 1, 'y resolution due to oblong nature');

  t.end();
})

test('aabb2 overlap X', t => {
  const box1 = {
    cpos: { x: 0, y: 0 },
    w: 10,
    h: 20,
  }

  const box2 = {
    cpos: { x: 2, y: 5 },
    w: 10,
    h: 20,
  }

  const result = {}

  const isOverlapping = overlapAABBAABB2(
    box1.cpos.x, box1.cpos.y, box1.w, box1.h,
    box2.cpos.x, box2.cpos.y, box2.w, box2.h,
    result
  );

  t.equal(isOverlapping, result, 'should be overlapping');
  t.equal(result.resolve.x, 8, 'x resolve');
  t.equal(result.resolve.y, 0, 'y resolve');

  t.equal(result.hitPos.x, 5, 'x hit position');
  t.equal(result.hitPos.y, 5, 'y hit position');

  t.equal(result.normal.x, 1, 'normal is ->');

  t.end();
});

test('aabb2 overlap Y', t => {
  const box1 = {
    cpos: { x: 0, y: 0 },
    w: 20,
    h: 10,
  }

  const box2 = {
    cpos: { x: 2, y: 5 },
    w: 20,
    h: 10,
  }

  const result = {}

  const isOverlapping = overlapAABBAABB2(
    box1.cpos.x, box1.cpos.y, box1.w, box1.h,
    box2.cpos.x, box2.cpos.y, box2.w, box2.h,
    result
  );

  t.equal(isOverlapping, result, 'should be overlapping');
  t.equal(result.resolve.x, 0, 'x resolve');
  t.equal(result.resolve.y, 5, 'y resolve');

  t.equal(result.hitPos.x, 2, 'x hit position');
  t.equal(result.hitPos.y, 5, 'y hit position');

  t.equal(result.normal.y, 1, 'normal is ^');

  t.end();
});

test('aabb collision-response', t => {
  const box1 = {
    cpos: { x: 0, y: 0 },
    ppos: { x: -5, y: -5 },
    w: 5,
    h: 5,
    mass: 1,
    restitution: 1,
    staticFriction: 0,
    dynamicFriction: 0,
  }

  const box2 = {
    cpos: { x: 5, y: 0 },
    ppos: { x: 10, y: -5 },
    w: 5,
    h: 5,
    mass: 1,
    restitution: 1,
    staticFriction: 0,
    dynamicFriction: 0,
  }

  const box1v = v2();
  const box2v = v2();

  collisionResponseAABB(
    box1.cpos, box1.ppos, box1.mass, box1.restitution, box1.staticFriction, box1.dynamicFriction,
    box2.cpos, box2.ppos, box2.mass, box2.restitution, box2.staticFriction, box2.dynamicFriction,
    box1v, box2v
  );

  // Apply the new velocity
  sub(box1.ppos, box1.cpos, box1v);
  sub(box2.ppos, box2.cpos, box2v);

  t.deepEqual(box1.cpos, { x: 0, y: 0 }, 'box1 has not moved');
  t.deepEqual(box2.cpos, { x: 5, y: 0 }, 'box1 has not moved');

  t.deepEqual(box1.ppos, { x: 5, y: -5 }, 'box1 will bounce to the left');
  t.deepEqual(box2.ppos, { x: 0, y: -5 }, 'box2 will bounce to the right');

  t.end();
});

test('aabb collision-response: very inequal masses', t => {
  const box1 = {
    cpos: { x: 0, y: 0 },
    ppos: { x: -5, y: -5 },
    w: 5,
    h: 5,
    mass: 10000000000,
    restitution: 1,
    staticFriction: 0,
    dynamicFriction: 0,
  }

  const box2 = {
    cpos: { x: 5, y: 0 },
    ppos: { x: 10, y: -5 },
    w: 5,
    h: 5,
    mass: 1,
    restitution: 1,
    staticFriction: 0,
    dynamicFriction: 0,
  }

  const box1v = v2();
  const box2v = v2();

  collisionResponseAABB(
    box1.cpos, box1.ppos, box1.mass, box1.restitution, box1.staticFriction, box1.dynamicFriction,
    box2.cpos, box2.ppos, box2.mass, box2.restitution, box2.staticFriction, box2.dynamicFriction,
    box1v, box2v
  );

  // Apply the new velocity
  sub(box1.ppos, box1.cpos, box1v);
  sub(box2.ppos, box2.cpos, box2v);

  t.deepEqual(box1.cpos, { x: 0, y: 0 }, 'box1 has not moved');
  t.deepEqual(box2.cpos, { x: 5, y: 0 }, 'box2 has not moved');

  t.deepEqual(box1.ppos, { x: -4.999999998, y: -5 },
    'box1 will mostly continue to the right');
  t.deepEqual(box2.ppos, { x: -9.999999998, y: -5 },
    'box2 will mostly move in the direction of box1 (pushing)');

  t.end();
});

test('aabb friction', t => {

  const box1 = {
    cpos: { x: 0, y: 0 },
    ppos: { x: -5, y: -5 },
    w: 5,
    h: 5,
    mass: 1,
    restitution: 1,
    staticFriction: 0.5,
    dynamicFriction: 0.5,
  }

  const box2 = {
    cpos: { x: 4, y: 0 },
    ppos: { x: 9, y: -5 },
    w: 5,
    h: 5,
    mass: 1,
    restitution: 1,
    staticFriction: 0.5,
    dynamicFriction: 0.5,
  }

  const collision = {}

  // TODO: no need for isOverlapping, just use a known collision normal
  // + already computed collision response ppos(s).

  const isOverlapping = overlapAABBAABB2(
    box1.cpos.x, box1.cpos.y, box1.w, box1.h,
    box2.cpos.x, box2.cpos.y, box2.w, box2.h,
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
    box1.cpos, box1.ppos, box1.mass, box1.restitution, box1.staticFriction, box1.dynamicFriction,
    box2.cpos, box2.ppos, box2.mass, box2.restitution, box2.staticFriction, box2.dynamicFriction,
    box1v, box2v
  );

  // Apply the new velocity
  sub(box1.ppos, box1.cpos, box1v);
  sub(box2.ppos, box2.cpos, box2v);

  console.log(box1v)
  console.log(box2v)

  console.log(box1.ppos)
  console.log(box2.ppos)

  t.deepEqual(box1.cpos, { x: -0.5, y: 0 }, 'box1 moved to non-overlapping');
  t.deepEqual(box2.cpos, { x: 4.5, y: 0 }, 'box2 has moved to non-overlapping');

  t.deepEqual(box1.ppos, { x: 4.5, y: -2.5 }, 'box1 will bounce to the left');
  t.deepEqual(box2.ppos, { x: -0.5, y: -2.5 }, 'box2 will bounce to the right');
  t.end();
});
