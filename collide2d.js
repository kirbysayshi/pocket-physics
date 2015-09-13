var v2 = require('./v2');
var debug = require('debug')('pocket-physics:collide2d');

// Preallocations!
var velA = { x: 0, y: 0 };
var velB = { x: 0, y: 0 };
var diff = { x: 0, y: 0 };
var move = { x: 0, y: 0 };

module.exports = function(p1, p2, preserveInertia, damping) {
  var dist2 = v2.distance2(p1.cpos, p2.cpos);
  var target = p1.radius + p2.radius;
  var min2 = target * target;
  if (dist2 > min2) return;

  v2.sub(velA, p1.cpos, p1.ppos);
  v2.sub(velB, p2.cpos, p2.ppos);

  v2.sub(diff, p1.cpos, p2.cpos);
  var dist = Math.sqrt(dist2);
  var factor = (dist - target) / dist;

  debug('collision. dist %d, factor %d', dist, factor);

  var imass1 = 1/(p1.mass || 1);
  var imass2 = 1/(p2.mass || 1);
  var imass = imass1 + imass2

  debug('imass %d, imass1 %d, imass2 %d', imass, imass1, imass2);

  // Move a away
  move.x = diff.x * factor * (imass1 * imass);
  move.y = diff.y * factor * (imass1 * imass);
  if (p1.mass > 0) {
    debug('moving p1', move);
    v2.sub(p1.cpos, p1.cpos, move);
  }

  // Move b away
  move.x = diff.x * factor * (imass2 * imass);
  move.y = diff.y * factor * (imass2 * imass);
  if (p2.mass > 0) {
    debug('moving p2', move);
    v2.add(p2.cpos, p2.cpos, move);
  }

  if (!preserveInertia) return;

  damping = damping || 1;

  var f1 = (damping * (diff.x * velA.x + diff.y * velA.y)) / dist2;
  var f2 = (damping * (diff.x * velB.x + diff.y * velB.y)) / dist2;
  debug('inertia. f1 %d, f2 %d', f1, f2);

  velA.x += (f2 * diff.x - f1 * diff.x)// * (imass1 * imass);
  velB.x += (f1 * diff.x - f2 * diff.x)// * (imass2 * imass);
  velA.y += (f2 * diff.y - f1 * diff.y)// * (imass1 * imass);
  velB.y += (f1 * diff.y - f2 * diff.y)// * (imass2 * imass);

  debug('velocity. p1 %o, p2 %o', velA, velB);

  if (p1.mass > 0) v2.set(p1.ppos, p1.cpos.x - velA.x, p1.cpos.y - velA.y);
  if (p2.mass > 0) v2.set(p2.ppos, p2.cpos.x - velB.x, p2.cpos.y - velB.y);
}
