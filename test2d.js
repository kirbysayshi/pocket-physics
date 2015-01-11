var test = require('tape');

var gravitation2d = require('./gravitation2d');
var accelerate2d = require('./accelerate2d');
var inertia2d = require('./inertia2d');

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