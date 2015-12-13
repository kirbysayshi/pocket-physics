var v2 = require('./v2');
var accel1 = v2();

module.exports = function solve(p1, p1mass, p2, p2mass, gravityConstant) {
  gravityConstant = gravityConstant || 0.99;

  // handle either obj not having mass
  if (!p1mass || !p2mass) return;
  
  var mag;
  var factor;

  var diffx = p2.cpos.x - p1.cpos.x;
  var diffy = p2.cpos.y - p1.cpos.y;

  v2.set(accel1, diffx, diffy);
  mag = v2.magnitude(accel1);

  // Newton's Law of Universal Gravitation -- Vector Form!
  factor = gravityConstant * ((p1mass * p2mass) / (mag * mag));

  // scale by gravity acceleration
  v2.normalize(accel1, accel1);
  v2.scale(accel1, accel1, factor);

  // add the acceleration from gravity to p1 accel
  v2.add(p1.acel, p1.acel, accel1);
}