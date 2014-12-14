var test = require('tape');

var accelerate3d = require('./accelerate3d');
var inertia3d = require('./inertia3d');

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