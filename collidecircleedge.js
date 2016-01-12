var v2 = require('./v2');
var collideCircleCircle = require('./collidecirclecircle');
var debug = require('debug')('pocket-physics:collide-circle-edge');

// Preallocations
var collisionNormal = v2();
var edge = v2();
var prevEdge = v2();
var hypo = v2();
var epDiff = v2();
var correction = v2();

var ep = {
  cpos: v2(),
  ppos: v2()
}

var epBefore = {
  cpos: v2(),
  ppos: v2()
}

module.exports = function collide(
  point3, radius3, mass3,
  point1, mass1,
  point2, mass2,
  preserveInertia, damping
) {
  debug('point3.cpos %o', point3.cpos);
  debug('endpoint1.cpos %o', point1.cpos);
  debug('endpoint2.cpos %o', point2.cpos);

  // Edge direction (edge in local space)
  v2.sub(edge, point2.cpos, point1.cpos);

  // Vector from endpoint1 to particle
  v2.sub(hypo, point3.cpos, point1.cpos);

  debug('edge', edge);
  debug('hypo', hypo);

  // Where is the particle on the edge, before, after, or on?
  // Also used for interpolation later.
  var projection = v2.dot(edge, hypo);
  var maxDot = v2.dot(edge, edge);

  debug('projection', projection);
  debug('maxDot', maxDot);

  // Colliding beyond the edge...
  //if (projection < 0 || projection > maxDot) return;

  // Create interpolation factor of where point closest
  // to particle is on the line.
  var t = projection / maxDot;
  var u = 1 - t;

  debug('t %d, u %d', t, u);

  // Point of collision on the edge
  v2.scale(ep.cpos, edge, t);
  v2.add(ep.cpos, ep.cpos, point1.cpos);

  debug('ep.cpos %o', ep.cpos);

  // Compute previous position for collision point
  v2.sub(prevEdge, point2.ppos, point1.ppos);
  v2.scale(ep.ppos, prevEdge, t);
  v2.add(ep.ppos, ep.ppos, point1.ppos);

  debug('endpoint1.ppos %o endpoint2.ppos %o', point1.ppos, point2.ppos);
  debug('ep.ppos %o', ep.ppos);

  // Save collision point cpos,ppos for later
  v2.copy(epBefore.cpos, ep.cpos);
  v2.copy(epBefore.ppos, ep.ppos);

  // Create a fake circle for collision using combined
  // mass of endpoints
  var edgeMass = mass1 + mass2;
  var edgeRadius = 0;

  collideCircleCircle(
    point3, radius3, mass3,
    ep, edgeRadius, edgeMass,
    preserveInertia, damping);

  // Apply position change from ep to actual edge endpoints
  // accounting for mass.

  // Compute cpos change of edgepoint
  v2.sub(epDiff, ep.cpos, epBefore.cpos);
  var epDiffMagCpos = v2.magnitude(epDiff);
  v2.normalize(epDiff, epDiff);

  debug('epDiff normalized %o', epDiff);
  debug('epDiffMagCpos %d', epDiffMagCpos);

  // Factor in edgepoint position along edge

  var factor1 = 1 - (t / 0.5);
  var factor2 = ((t - 0.5) / 0.5);
  debug('edgepoint factor1,2 %d,%d', factor1, factor2);

  // Compute endpoint1 cpos correction
  var endpoint1CposAddition = factor1 * epDiffMagCpos;
  v2.scale(correction, epDiff, epDiffMagCpos + endpoint1CposAddition);
  debug('endpoint1 cpos correction %o', correction);
  v2.add(point1.cpos, point1.cpos, correction);

  // Compute endpoint2 cpos correction
  var endpoint2CposAddition = factor2 * epDiffMagCpos;
  v2.scale(correction, epDiff, epDiffMagCpos + endpoint2CposAddition);
  debug('endpoint2 cpos correction %o', correction);
  v2.add(point2.cpos, point2.cpos, correction);

  debug('new endpoint1.cpos %o', point1.cpos);
  debug('new endpoint2.cpos %o', point2.cpos);

  if (!preserveInertia) return;

  // Compute ppos change of edgepoint
  v2.sub(epDiff, ep.ppos, epBefore.ppos);
  var epDiffMagPpos = v2.magnitude(epDiff);
  v2.normalize(epDiff, epDiff);

  debug('epDiffMagPpos %d', epDiffMagPpos);

  // Factor in edgepoint position along edge

  // Compute endpoint1 ppos correction
  v2.scale(correction, epDiff, -epDiffMagPpos)// - (epDiffMagPpos * (t - u)));
  debug('endpoint1 ppos correction %o', correction);
  v2.sub(point1.ppos, point1.ppos, correction);

  // Compute endpoint2 ppos correction
  v2.scale(correction, epDiff, -epDiffMagPpos)// - (epDiffMagPpos * (t - u)));
  debug('endpoint2 ppos correction %o', correction);
  v2.sub(point2.ppos, point2.ppos, correction);

  debug('new endpoint1.ppos %o', point1.ppos);
  debug('new endpoint2.ppos %o', point2.ppos);
}
