var v3 = require('./v3');
var debug = require('debug')('pocket-physics:distanceconstraint');

module.exports = function solve(p1, p2, goal) {
  var imass1 = 1/(p1.mass || 1);
  var imass2 = 1/(p2.mass || 1);
  var imass = imass1 + imass2

  // Current relative vector
  var delta = v3.sub(v3(), p2.cpos, p1.cpos);
  var deltaMag = v3.magnitude(delta);

  debug('goal', goal)
  debug('delta', delta)

  // Difference between current distance and goal distance
  var diff = (deltaMag - goal) / deltaMag;

  debug('delta mag', v3.magnitude(delta))
  debug('diff', diff)

  // approximate mass
  v3.scale(delta, delta, diff / imass);

  debug('delta diff/imass', delta)

  var p1correction = v3.scale(v3(), delta, imass1);
  var p2correction = v3.scale(v3(), delta, imass2);

  debug('p1correction', p1correction)
  debug('p2correction', p2correction)

  if (p1.mass) v3.add(p1.cpos, p1.cpos, p1correction);
  if (p2.mass) v3.sub(p2.cpos, p2.cpos, p2correction);
}

