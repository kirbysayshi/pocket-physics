var v2 = require('./v2');
var debug = require('debug')('pocket-physics:springconstraint');

module.exports = function solve(follower, target, stiffness, damping) {
  var p1 = follower;
  var p2 = target;

  var imass1 = 1/(p1.mass || 1);
  var imass2 = 1/(p2.mass || 1);
  var imass = imass1 + imass2

  // Current relative vector
  var delta = v2.sub(v2(), p2.cpos, p1.cpos);

  debug('target', target)
  debug('delta', delta)

  //v2.scale(delta, delta, stiffness * damping * imass2);
  v2.scale(delta, delta, stiffness * damping * imass1);

  debug('delta * stiffness * damping', delta)

  v2.add(p1.acel, p1.acel, delta);
}

