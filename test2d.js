var test = require('tape');

var gravitation2d = require('./gravitation2d');
var accelerate2d = require('./accelerate2d');
var inertia2d = require('./inertia2d');
var spring2d = require('./springconstraint2d');
var collide2d = require('./collide2d');
var overlapcirclecircle = require('./overlapcirclecircle');

test('2d', function(t) {

  var point = {
    cpos: { x: 0, y: 0 },
    ppos: { x: 0, y: 0 },
    acel: { x: 10, y: 0 }
  }

  // 1 is the delta time between steps
  accelerate2d(point, 1);
  inertia2d(point);

  t.equals(point.cpos.x, 0.02, 'current position is correct');
  t.equals(point.ppos.x, 0.01, 'previous position is correct');
  t.equals(point.acel.x, 0, 'acceleration is reset');
  t.end();
})

test('2d gravitation', function(t) {

  var point1 = {
    cpos: { x: 0, y: 0 },
    ppos: { x: 0, y: 0 },
    acel: { x: 0, y: 0 },
    mass : 1
  }

  var point2 = {
    cpos: { x: 1, y: 0 },
    ppos: { x: 0, y: 0 },
    acel: { x: 0, y: 0 },
    mass : 1
  }

  gravitation2d(point1, point2, 1);
  gravitation2d(point2, point1, 1);

  t.equals(point1.acel.x, 1, 'gravitation1 is correct');
  t.equals(point2.acel.x, -1, 'gravitation2 is correct');
  t.equals(point1.acel.x, (point2.acel.x) * -1 , 'gravitation equal and opposite');
  t.end();
})

test('2d spring constraint with equal mass', function(t) {
  var point1 = {
    cpos: { x: 0, y: 0 },
    ppos: { x: 0, y: 0 },
    acel: { x: 0, y: 0 },
    mass: 25
  }

  var point2 = {
    cpos: { x: 10, y: 0 },
    ppos: { x: 10, y: 0 },
    acel: { x: 0, y: 0 },
    mass: 25
  }

  accelerate2d(point1, 1);
  accelerate2d(point2, 1);
  spring2d(point2, point1, 0.1, 0.9);
  inertia2d(point1, 1);
  inertia2d(point2, 1);

  t.equal(point2.acel.x, -0.036000000000000004, 'point2 moves towards point1');
  t.end();
})

test('2d collision with equal mass and inertia preserved', function(t) {

  var damping = 0.99;

  var point1 = {
    cpos: { x: 0, y: 0 },
    ppos: { x: 0, y: 0 },
    acel: { x: 0, y: 0 },
    mass: 1, radius: 5
  }

  var point2 = {
    cpos: { x: 9, y: 0 },
    ppos: { x: 9, y: 0 },
    acel: { x: 0, y: 0 },
    mass: 1, radius: 5
  }

  accelerate2d(point1, 1);
  accelerate2d(point2, 1);
  collide2d(point1, point2, false, damping);

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

  collide2d(point2, point1, true, damping);

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

test('2d collision with inequal mass and inertia preserved', function(t) {

  var damping = 0.99;

  var point1 = {
    cpos: { x: 0, y: 0 },
    ppos: { x: 0, y: 0 },
    acel: { x: 0, y: 0 },
    mass: 1, radius: 5
  }

  var point2 = {
    cpos: { x: 9, y: 0 },
    ppos: { x: 9, y: 0 },
    acel: { x: 0, y: 0 },
    mass: 3, radius: 5
  }

  accelerate2d(point1, 1);
  accelerate2d(point2, 1);
  collide2d(point2, point1, false, damping);

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

  collide2d(point2, point1, true, damping);

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

test('2d collision, vs infinite mass and inertia preserved', function(t) {

  var damping = 0.99;

  var point1 = {
    cpos: { x: 0, y: 0 },
    ppos: { x: 0, y: 0 },
    acel: { x: 0, y: 0 },
    mass: 1, radius: 5
  }

  var point2 = {
    cpos: { x: 9, y: 0 },
    ppos: { x: 9, y: 0 },
    acel: { x: 0, y: 0 },
    mass: Number.MAX_VALUE, radius: 5
  }

  accelerate2d(point1, 1);
  accelerate2d(point2, 1);
  collide2d(point2, point1, false, damping);

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

  collide2d(point2, point1, true, damping);

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

test('overlap circles', function (t) {
  var point1 = {
    cpos: { x: 0, y: 0 },
    radius: 5
  }

  var point2 = {
    cpos: { x: 9, y: 0 },
    radius: 5
  }

  var overlapping = overlapcirclecircle(
    point1.cpos.x, point1.cpos.y, point1.radius,
    point2.cpos.x, point2.cpos.y, point2.radius
  );

  t.ok(overlapping, 'circles are overlapping');
  t.end();
})