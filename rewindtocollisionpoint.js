var debug = require('debug')('pocket-physics:rewind-to-collision-point');
var v2 = require('./v2');
var segmentIntersection = require('./segmentintersection');

var tunnelPoint = v2();
var offset = v2();

module.exports = function rewindToCollisionPoint(point3, point1, point2) {

  // detect if a collision has occurred but would have been missed due to
  // point3 moving beyond the edge in one time step.

  var hasTunneled = segmentIntersection(
    point3.cpos, point3.ppos,
    point1.cpos, point2.cpos, tunnelPoint
  );

  if (!hasTunneled) return;

  debug('hasTunneled %s', hasTunneled);

  // Translate point3 to tunnelPoint
  v2.sub(offset, point3.cpos, tunnelPoint);
  debug('offset %o', offset);
  debug('point3.cpos %o', point3.cpos);
  debug('point3.ppos %o', point3.ppos);

  v2.sub(point3.cpos, point3.cpos, offset);
  v2.sub(point3.ppos, point3.ppos, offset);
  debug('corrected point3.cpos %o', point3.cpos);
  debug('corrected point3.ppos %o', point3.ppos);
}

function debuggerIfNaN(point) {
  if (isNaN(point.x) || isNaN(point.y)) { debugger; }
}