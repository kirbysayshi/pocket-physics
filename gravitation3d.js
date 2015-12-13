var v3 = require('./v3');
var accel1 = v3(); 

module.exports = function solve(p1, p1mass, p2, p2mass, gravityConstant) {
  gravityConstant = gravityConstant || 0.99;

  // handle either obj not having mass
  if (!p1mass || !p2mass) return;

  var mag;
  var factor;

  var diffx = p2.cpos.x - p1.cpos.x;
  var diffy = p2.cpos.y - p1.cpos.y;
  var diffz = p2.cpos.z - p1.cpos.z;

  v3.set(accel1, diffx, diffy, diffz);
  mag = v3.magnitude(accel1);

  // Newton's Law of Universal Gravitation -- Vector Form!
  factor = gravityConstant * ((p1mass * p2mass) / (mag * mag));

  // scale by gravity acceleration
  v3.normalize(accel1, accel1);
  v3.scale(accel1, accel1, factor);

  // add the acceleration from gravity to p1 accel
  v3.add(p1.acel, p1.acel, accel1);
}