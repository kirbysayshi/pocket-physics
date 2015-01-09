var v2 = require('./v2');

module.exports = function solve(obj1, obj2, gravityConstant) {
  gravityConstant = gravityConstant || 0.99;

  // accel on obj1 because obj2 exists
  var accel1 = v2(); 
  var out = v2();
  var mag;
  var factor;

  var diffx = obj2.cpos.x - obj1.cpos.x;
  var diffy = obj2.cpos.y - obj1.cpos.y;

  v2.set(accel1, diffx, diffy);
  mag = v2.magnitude(accel1);

  // Newton's Law of Universal Gravitation -- Vector Form!
  factor = gravityConstant * ((obj1.mass * obj2.mass) / (mag * mag));

  // scale by gravity acceleration
  v2.normalize(accel1, accel1);
  v2.scale(accel1, accel1, factor);

  // add the acceleration from gravity to obj1 accel
  v2.add(obj1.acel, obj1.acel, accel1);
}