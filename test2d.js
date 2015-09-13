var test = require('tape');

var gravitation2d = require('./gravitation2d');
var accelerate2d = require('./accelerate2d');
var inertia2d = require('./inertia2d');
var spring2d = require('./springconstraint2d');
var collide2d = require('./collide2d');

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

test('2d collision with equal mass', function(t) {
  // Mass is currently not used...

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
  collide2d(point2, point1);

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

  // this should have no effect, since they've moved beyond each other already
  collide2d(point2, point1, true);

  t.equal(point1.cpos.x, -1, 'point1 continues to move left');
  t.equal(point1.cpos.y, 0, 'point1 does not move vertically');
  t.equal(point1.ppos.x, -0.5, 'point1 has had inertia applied(x)');
  t.equal(point1.ppos.y, 0, 'point1 has had inertia applied(y)');
  t.equal(point2.cpos.x, 10, 'point2 continues to move right');
  t.equal(point2.cpos.y, 0, 'point2 does not move vertically');
  t.equal(point2.ppos.x, 9.5, 'point2 has had inertia applied(x)');
  t.equal(point2.ppos.y, 0, 'point2 has had inertia applied(y)');

  t.end();
})

test('2d collision with equal mass and inertia preserved', function(t) {
  // Mass is currently not used...

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
  collide2d(point2, point1, true);

  t.equal(point1.cpos.x, -0.5, 'point1 moves left');
  t.equal(point1.cpos.y, 0, 'point1 does not move vertically');
  t.equal(point1.ppos.x, 0, 'point1 has not had inertia applied(x)');
  t.equal(point1.ppos.y, 0, 'point1 has not had inertia applied(y)');
  t.equal(point2.cpos.x, 9.5, 'point2 moves right');
  t.equal(point2.cpos.y, 0, 'point2 does not move vertically');
  t.equal(point2.ppos.x, 9, 'point2 has not had inertia applied(x)');
  t.equal(point2.ppos.y, 0, 'point2 has not had inertia applied(y)');

  t.end();
})
