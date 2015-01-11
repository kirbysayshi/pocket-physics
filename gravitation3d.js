var v3 = require('./v3');

module.exports = function solve(obj1, obj2, gravityConstant) {
  gravityConstant = gravityConstant || 0.99;

  // handle either obj not having mass
  if (!obj1.mass || !obj2.mass) return;
  
  // accel on obj1 because obj2 exists
  var accel1 = v3(); 
  var mag;
  var factor;

  var diffx = obj2.cpos.x - obj1.cpos.x;
  var diffy = obj2.cpos.y - obj1.cpos.y;
  var diffz = obj2.cpos.z - obj1.cpos.z;

  v3.set(accel1, diffx, diffy, diffz);
  mag = v3.magnitude(accel1);

  // Newton's Law of Universal Gravitation -- Vector Form!
  factor = gravityConstant * ((obj1.mass * obj2.mass) / (mag * mag));

  // scale by gravity acceleration
  v3.normalize(accel1, accel1);
  v3.scale(accel1, accel1, factor);

  // add the acceleration from gravity to obj1 accel
  v3.add(obj1.acel, obj1.acel, accel1);
}