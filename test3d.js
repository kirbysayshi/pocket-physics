var test = require('tape');

var v3 = require('./v3');
var accelerate3d = require('./accelerate3d');
var inertia3d = require('./inertia3d');
var maintainDistance3d = require('./distanceconstraint3d');
var springDistance3d = require('./springconstraint3d');

test('3d', function(t) {

  var point = {
    cpos: { x: 0, y: 0, z: 0 },
    ppos: { x: 0, y: 0, z: 0 },
    acel: { x: 0, y: 0, z: 10 }
  }

  // 1 is the delta time between steps
  accelerate3d(point, 1);
  inertia3d(point);

  t.equals(point.cpos.z, 0.02, 'current position is correct');
  t.equals(point.ppos.z, 0.01, 'previous position is correct');
  t.equals(point.acel.z, 0, 'acceleration is reset');
  t.end();
})

test('3d rigid constraint infinite mass', function(t) {
  var point1 = {
    cpos: { x: 0, y: 0, z: 0 },
    ppos: { x: 0, y: 0, z: 0 },
    acel: { x: 0, y: 0, z: 0 }
  }

  var point2 = {
    cpos: { x: 10, y: 0, z: 0 },
    ppos: { x: 0, y: 0, z: 0 },
    acel: { x: 0, y: 0, z: 0 }
  }

  maintainDistance3d(point1, point2, v3.distance(point1.cpos, point2.cpos) / 2);

  t.equal(point1.cpos.x, 0, 'infinite mass prevents solving')
  t.equal(point1.cpos.y, 0, 'infinite mass prevents solving')
  t.equal(point1.cpos.z, 0, 'infinite mass prevents solving')

  t.equal(point2.cpos.x, 10, 'infinite mass prevents solving')
  t.equal(point2.cpos.y, 0, 'infinite mass prevents solving')
  t.equal(point2.cpos.z, 0, 'infinite mass prevents solving')

  t.end();
})

test('3d rigid constraint with equal mass', function(t) {

  var point1 = {
    cpos: { x: 0, y: 0, z: 0 },
    ppos: { x: 0, y: 0, z: 0 },
    acel: { x: 50, y: 0, z: 0 },
    mass: 25
  }

  var point2 = {
    cpos: { x: 10, y: 0, z: 0 },
    ppos: { x: 10, y: 0, z: 0 },
    acel: { x: 0, y: 0, z: 0 },
    mass: 25
  }

  var goal = v3.distance(point1.cpos, point2.cpos);
  accelerate3d(point1, 1);
  accelerate3d(point2, 1);
  maintainDistance3d(point1, point2, goal);
  inertia3d(point1, 1);
  inertia3d(point2, 1);

  t.equal(point1.cpos.x, 0.049999999999999295, 'force was equally applied');
  t.equal(point2.cpos.x, 10.05, 'force was equally applied');
  t.end();
})

test('3d rigid constraint with unequal mass', function(t) {

  var point1 = {
    cpos: { x: 0, y: 0, z: 0 },
    ppos: { x: 0, y: 0, z: 0 },
    acel: { x: 500, y: 0, z: 0 },
    mass: 1
  }

  var point2 = {
    cpos: { x: 10, y: 0, z: 0 },
    ppos: { x: 10, y: 0, z: 0 },
    acel: { x: 0, y: 0, z: 0 },
    mass: 50
  }

  var goal = v3.distance(point1.cpos, point2.cpos);
  accelerate3d(point1, 1);
  accelerate3d(point2, 1);
  maintainDistance3d(point1, point2, goal);
  inertia3d(point1, 1);
  inertia3d(point2, 1);

  t.equal(point1.cpos.x, 0.019607843137254943, 'force was equally applied');
  t.equal(point2.cpos.x, 10.019607843137255, 'force was equally applied');
  t.end();
})

test('3d spring constraint with equal mass', function(t) {
  var point1 = {
    cpos: { x: 0, y: 0, z: 0 },
    ppos: { x: 0, y: 0, z: 0 },
    acel: { x: 0, y: 0, z: 0 },
    mass: 25
  }

  var point2 = {
    cpos: { x: 10, y: 0, z: 0 },
    ppos: { x: 10, y: 0, z: 0 },
    acel: { x: 0, y: 0, z: 0 },
    mass: 25
  }

  accelerate3d(point1, 1);
  accelerate3d(point2, 1);
  springDistance3d(point2, point1, 0.1, 0.9);
  inertia3d(point1, 1);
  inertia3d(point2, 1);

  t.equal(point2.acel.x, -0.036000000000000004, 'point2 moves towards point1');

  t.end();
})