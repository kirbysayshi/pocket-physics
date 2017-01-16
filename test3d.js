import test from 'tape';
import { distance } from './src/v3';
import accelerate3d from './src/accelerate3d';
import inertia3d from './src/inertia3d';
import maintainDistance3d from './src/distanceconstraint3d';
import springDistance3d from './src/springconstraint3d';
import drag3d from './src/drag3d';
import gravitation3d from './src/gravitation3d';
import overlapspheresphere from './src/overlapspheresphere';

test('3d', t => {

  const point = {
    cpos: { x: 0, y: 0, z: 0 },
    ppos: { x: 0, y: 0, z: 0 },
    acel: { x: 0, y: 0, z: 10 }
  };

  // 1 is the delta time between steps
  accelerate3d(point, 1);
  inertia3d(point);

  t.equals(point.cpos.z, 0.02, 'current position is correct');
  t.equals(point.ppos.z, 0.01, 'previous position is correct');
  t.equals(point.acel.z, 0, 'acceleration is reset');
  t.end();
})

test('3d rigid constraint infinite mass', t => {
  const point1 = {
    cpos: { x: 0, y: 0, z: 0 },
    ppos: { x: 0, y: 0, z: 0 },
    acel: { x: 0, y: 0, z: 0 }
  };

  const point2 = {
    cpos: { x: 10, y: 0, z: 0 },
    ppos: { x: 0, y: 0, z: 0 },
    acel: { x: 0, y: 0, z: 0 }
  };

  maintainDistance3d(point1, 0, point2, 0, distance(point1.cpos, point2.cpos) / 2);

  t.equal(point1.cpos.x, 0, 'infinite mass prevents solving')
  t.equal(point1.cpos.y, 0, 'infinite mass prevents solving')
  t.equal(point1.cpos.z, 0, 'infinite mass prevents solving')

  t.equal(point2.cpos.x, 10, 'infinite mass prevents solving')
  t.equal(point2.cpos.y, 0, 'infinite mass prevents solving')
  t.equal(point2.cpos.z, 0, 'infinite mass prevents solving')

  t.end();
})

test('3d rigid constraint with equal mass', t => {

  const point1 = {
    cpos: { x: 0, y: 0, z: 0 },
    ppos: { x: 0, y: 0, z: 0 },
    acel: { x: 50, y: 0, z: 0 }
  };

  const point2 = {
    cpos: { x: 10, y: 0, z: 0 },
    ppos: { x: 10, y: 0, z: 0 },
    acel: { x: 0, y: 0, z: 0 }
  };

  const p1mass = 25;
  const p2mass = 25;

  const goal = distance(point1.cpos, point2.cpos);
  accelerate3d(point1, 1);
  accelerate3d(point2, 1);
  maintainDistance3d(point1, p1mass, point2, p2mass, goal);
  inertia3d(point1, 1);
  inertia3d(point2, 1);

  t.equal(point1.cpos.x, 0.049999999999999295, 'force was equally applied');
  t.equal(point2.cpos.x, 10.05, 'force was equally applied');
  t.end();
})

test('3d rigid constraint with unequal mass', t => {

  const point1 = {
    cpos: { x: 0, y: 0, z: 0 },
    ppos: { x: 0, y: 0, z: 0 },
    acel: { x: 500, y: 0, z: 0 }
  };

  const point2 = {
    cpos: { x: 10, y: 0, z: 0 },
    ppos: { x: 10, y: 0, z: 0 },
    acel: { x: 0, y: 0, z: 0 }
  };

  const p1mass = 1;
  const p2mass = 50;

  const goal = distance(point1.cpos, point2.cpos);
  accelerate3d(point1, 1);
  accelerate3d(point2, 1);
  maintainDistance3d(point1, p1mass, point2, p2mass, goal);
  inertia3d(point1, 1);
  inertia3d(point2, 1);

  t.equal(point1.cpos.x, 0.019607843137254943, 'force was equally applied');
  t.equal(point2.cpos.x, 10.019607843137255, 'force was equally applied');
  t.end();
})

test('3d spring constraint with equal mass', t => {
  const point1 = {
    cpos: { x: 0, y: 0, z: 0 },
    ppos: { x: 0, y: 0, z: 0 },
    acel: { x: 0, y: 0, z: 0 }
  };

  const point2 = {
    cpos: { x: 10, y: 0, z: 0 },
    ppos: { x: 10, y: 0, z: 0 },
    acel: { x: 0, y: 0, z: 0 }
  };

  const p1mass = 25;
  const p2mass = 25;

  accelerate3d(point1, 1);
  accelerate3d(point2, 1);
  springDistance3d(point2, p2mass, point1, p1mass, 0.1, 0.9);
  inertia3d(point1, 1);
  inertia3d(point2, 1);

  t.equal(point2.acel.x, -0.036000000000000004, 'point2 moves towards point1');
  t.end();
})

test('3d drag', t => {
  const point1 = {
    cpos: { x: 10, y: 0, z: 0 },
    ppos: { x: 9, y: 0, z: 0 },
    acel: { x: 0, y: 0, z: 0 }
  };

  drag3d(point1, 0.9);

  t.equal(point1.ppos.x, 9.1, 'drag is applied');
  t.end();
})

test('3d gravitation', t => {

  const point1 = {
    cpos: { x: 0, y: 0, z: 0 },
    ppos: { x: 0, y: 0, z: 0 },
    acel: { x: 0, y: 0, z: 0 }
  };

  const point2 = {
    cpos: { x: 1, y: 1, z : 1 },
    ppos: { x: 0, y: 0, z : 0 },
    acel: { x: 0, y: 0, z : 0 }
  };

  const p1mass = 2;
  const p2mass = 34;

  gravitation3d(point1, p1mass, point2, p2mass, 1);
  gravitation3d(point2, p2mass, point1, p1mass, 1);

  t.equals(point1.acel.x, (point2.acel.x) * -1 , 'gravitation equal and opposite');
  t.end();
})

test('overlap spheres', t => {
  const point1 = {
    cpos: { x: 0, y: 0, z: 0 }
  };

  const point2 = {
    cpos: { x: 9, y: 0, z: 0 }
  };

  const p1radius = 5;
  const p2radius = 5;

  const overlapping = overlapspheresphere(
    point1.cpos.x, point1.cpos.y, point1.cpos.z, p1radius,
    point2.cpos.x, point2.cpos.y, point2.cpos.z, p2radius
  );

  t.ok(overlapping, 'circles are overlapping');
  t.end();
})