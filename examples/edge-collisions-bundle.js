(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var v2 = require('./v2');

module.exports = function (cmp, dt) {
  // apply acceleration to current position, convert dt to seconds
  cmp.cpos.x += cmp.acel.x * dt * dt * 0.001;
  cmp.cpos.y += cmp.acel.y * dt * dt * 0.001;

  // reset acceleration
  v2.set(cmp.acel, 0, 0);
};

},{"./v2":15}],2:[function(require,module,exports){
'use strict';

var v2 = require('./v2');
var debug = require('debug')('pocket-physics:collide-circle-circle');

// Preallocations!
var vel1 = { x: 0, y: 0 };
var vel2 = { x: 0, y: 0 };
var diff = { x: 0, y: 0 };
var move = { x: 0, y: 0 };

// It's very important that this function not do any distance checking.
// It is assumed that if this function is called, then the points are
// definitely colliding, and that after being called with preserveInertia
// === false, another call with === true should be made, even if the first
// calculation has moved the points away from physically touching.

module.exports = function (p1, p1radius, p1mass, p2, p2radius, p2mass, preserveInertia, damping) {
  debug('p1 cpos %o, mass %d, radius %d', p1.cpos, p1mass, p1radius);
  debug('p2 cpos %o, mass %d, radius %d', p2.cpos, p2mass, p2radius);

  var dist2 = v2.distance2(p1.cpos, p2.cpos);
  var target = p1radius + p2radius;
  var min2 = target * target;

  //if (dist2 > min2) return;

  v2.sub(vel1, p1.cpos, p1.ppos);
  v2.sub(vel2, p2.cpos, p2.ppos);

  v2.sub(diff, p1.cpos, p2.cpos);
  var dist = Math.sqrt(dist2);
  var factor = (dist - target) / dist;

  // Avoid division by zero in case points are directly atop each other.
  if (dist === 0) factor = 1;

  debug('point dist %d, edge dist %d, factor %d', dist, dist - target, factor);
  debug('diff %o', diff);

  var mass1 = p1mass === undefined ? 1 : p1mass;
  var mass2 = p2mass === undefined ? 1 : p2mass;
  var massT = mass1 + mass2;

  debug('massT %d, mass1 %d, mass2 %d', massT, mass1, mass2);

  // Move a away
  move.x = diff.x * factor * (mass2 / massT);
  move.y = diff.y * factor * (mass2 / massT);
  if (mass1 > 0) {
    debug('moving p1', move);
    v2.sub(p1.cpos, p1.cpos, move);
  }

  // Move b away
  move.x = diff.x * factor * (mass1 / massT);
  move.y = diff.y * factor * (mass1 / massT);
  if (mass2 > 0) {
    debug('moving p2', move);
    v2.add(p2.cpos, p2.cpos, move);
  }

  debug('p1.cpos %o', p1.cpos);
  debug('p2.cpos %o', p2.cpos);

  if (!preserveInertia) return;

  damping = damping || 1;

  var f1 = damping * (diff.x * vel1.x + diff.y * vel1.y) / (dist2 || 1);
  var f2 = damping * (diff.x * vel2.x + diff.y * vel2.y) / (dist2 || 1);
  debug('inertia. f1 %d, f2 %d', f1, f2);

  vel1.x += (f2 * diff.x - f1 * diff.x) / (mass1 || 1); // * (mass2 / massT);
  vel2.x += (f1 * diff.x - f2 * diff.x) / (mass2 || 1); // * (mass1 / massT);
  vel1.y += (f2 * diff.y - f1 * diff.y) / (mass1 || 1); // * (mass2 / massT);
  vel2.y += (f1 * diff.y - f2 * diff.y) / (mass2 || 1); // * (mass1 / massT);

  debug('velocity. p1 %o, p2 %o', vel1, vel2);

  v2.set(p1.ppos, p1.cpos.x - vel1.x, p1.cpos.y - vel1.y);
  v2.set(p2.ppos, p2.cpos.x - vel2.x, p2.cpos.y - vel2.y);

  debug('p1.ppos %o', p1.ppos);
  debug('p2.ppos %o', p2.ppos);
};

},{"./v2":15,"debug":8}],3:[function(require,module,exports){
'use strict';

var v2 = require('./v2');
var collideCircleCircle = require('./collidecirclecircle');
var debug = require('debug')('pocket-physics:collide-circle-edge');

// Preallocations
var edgeDir = v2();
var edge = v2();
var prevEdge = v2();
var hypo = v2();
var epDiff = v2();
var correction = v2();
var collisionPoint = v2();
var tunnelPoint = v2();

var ep = {
  cpos: v2(),
  ppos: v2()
};

var epBefore = {
  cpos: v2(),
  ppos: v2()
};

module.exports = function collide(point3, radius3, mass3, point1, mass1, point2, mass2, preserveInertia, damping) {
  debug('point3 %o', point3);
  debug('endpoint1 %o', point1);
  debug('endpoint2 %o', point2);

  // Edge direction (edge in local space)
  v2.sub(edge, point2.cpos, point1.cpos);

  // Normalize collision edge (assume collision axis is edge)
  v2.normalize(edgeDir, edge);

  // Vector from endpoint1 to particle
  v2.sub(hypo, point3.cpos, point1.cpos);

  debug('edge %o', edge);
  debug('hypo %o', hypo);
  debug('edgeDir %o', edgeDir);

  // Where is the particle on the edge, before, after, or on?
  // Also used for interpolation later.
  var projection = v2.dot(edge, hypo);
  var maxDot = v2.dot(edge, edge);
  var edgeMag = Math.sqrt(maxDot);

  debug('projection %d', projection);
  debug('maxDot %d', maxDot);
  debug('edgeMag %d', edgeMag);

  // Colliding beyond the edge...
  if (projection < 0 || projection > maxDot) return;

  // Create interpolation factor of where point closest
  // to particle is on the line.
  var t = projection / maxDot;
  var u = 1 - t;

  debug('t %d, u %d', t, u);

  // Find the point of collision on the edge.
  v2.scale(collisionPoint, edgeDir, t * edgeMag);
  v2.add(collisionPoint, collisionPoint, point1.cpos);
  var distance = v2.distance(collisionPoint, point3.cpos);

  debug('collision distance %d, radius %d', distance, radius3);

  // Bail if point and edge are too far apart.
  if (distance > radius3) return;

  // Distribute mass of colliding point into two fake points
  // and use those to collide against each endpoint independently.

  var standinMass1 = u * mass3;
  var standinMass2 = t * mass3;

  debug('standinMass 1,2 %d,%d', standinMass1, standinMass2);

  var standin1 = {
    cpos: v2(),
    ppos: v2()
  };

  var standin2 = {
    cpos: v2(),
    ppos: v2()
  };

  // Slide standin1 along edge to be in front of endpoint1
  v2.scale(standin1.cpos, edgeDir, t * edgeMag);
  v2.sub(standin1.cpos, point3.cpos, standin1.cpos);
  v2.scale(standin1.ppos, edgeDir, t * edgeMag);
  v2.sub(standin1.ppos, point3.ppos, standin1.ppos);

  // Slide standin2 along edge to be in front of endpoint2
  v2.scale(standin2.cpos, edgeDir, u * edgeMag);
  v2.add(standin2.cpos, point3.cpos, standin2.cpos);
  v2.scale(standin2.ppos, edgeDir, u * edgeMag);
  v2.add(standin2.ppos, point3.ppos, standin2.ppos);

  debug('standin1 %o', standin1);
  debug('standin2 %o', standin2);

  var standin1Before = {
    cpos: v2(),
    ppos: v2()
  };

  var standin2Before = {
    cpos: v2(),
    ppos: v2()
  };

  // Stash state of standins
  v2.copy(standin1Before.cpos, standin1.cpos);
  v2.copy(standin1Before.ppos, standin1.ppos);
  v2.copy(standin2Before.cpos, standin2.cpos);
  v2.copy(standin2Before.ppos, standin2.ppos);

  var edgeRadius = 0;

  debug('collide standin1 with endpoint1');

  // Collide standins with endpoints
  collideCircleCircle(standin1, radius3, standinMass1, point1, edgeRadius, mass1, preserveInertia, damping);

  debug('collide standin2 with endpoint2');

  collideCircleCircle(standin2, radius3, standinMass2, point2, edgeRadius, mass2, preserveInertia, damping);

  var standin1Delta = {
    cpos: v2(),
    ppos: v2()
  };

  var standin2Delta = {
    cpos: v2(),
    ppos: v2()
  };

  // Compute standin1 cpos change
  v2.sub(standin1Delta.cpos, standin1.cpos, standin1Before.cpos);

  // Compute standin2 cpos change
  v2.sub(standin2Delta.cpos, standin2.cpos, standin2Before.cpos);

  v2.scale(standin1Delta.cpos, standin1Delta.cpos, u);
  v2.scale(standin2Delta.cpos, standin2Delta.cpos, t);

  debug('standin1Delta cpos %o', standin1Delta.cpos);
  debug('standin2Delta cpos %o', standin2Delta.cpos);

  // Apply cpos changes to point3
  v2.add(point3.cpos, point3.cpos, standin1Delta.cpos);
  v2.add(point3.cpos, point3.cpos, standin2Delta.cpos);

  debug('new endpoint1.cpos %o', point1.cpos);
  debug('new endpoint2.cpos %o', point2.cpos);
  debug('new point3.cpos %o', point3.cpos);

  if (!preserveInertia) return;

  // TODO: instead of adding diff, get magnitude of diff and scale
  // in reverse direction of standin velocity from point3.cpos because
  // that is what circlecircle does.

  // Compute standin1 ppos change
  v2.sub(standin1Delta.ppos, standin1.ppos, standin1Before.ppos);

  // Compute standin2 ppos change
  v2.sub(standin2Delta.ppos, standin2.ppos, standin2Before.ppos);

  v2.scale(standin1Delta.ppos, standin1Delta.ppos, u);
  v2.scale(standin2Delta.ppos, standin2Delta.ppos, t);

  debug('standin1Delta ppos %o', standin1Delta.ppos);
  debug('standin2Delta ppos %o', standin2Delta.ppos);

  // Apply ppos changes to point3
  v2.add(point3.ppos, point3.ppos, standin1Delta.ppos);
  v2.add(point3.ppos, point3.ppos, standin2Delta.ppos);

  debug('new endpoint1.ppos %o', point1.ppos);
  debug('new endpoint2.ppos %o', point2.ppos);
  debug('new point3.ppos %o', point3.ppos);
};

},{"./collidecirclecircle":2,"./v2":15,"debug":8}],4:[function(require,module,exports){
'use strict';

var v2 = require('./v2');
var debug = require('debug')('pocket-physics:distanceconstraint');

module.exports = function distanceConstraint2d(p1, p1mass, p2, p2mass, goal) {
  var imass1 = 1 / (p1mass || 1);
  var imass2 = 1 / (p2mass || 1);
  var imass = imass1 + imass2;

  // Current relative vector
  var delta = v2.sub(v2(), p2.cpos, p1.cpos);
  var deltaMag = v2.magnitude(delta);

  debug('goal', goal);
  debug('delta', delta);

  // Difference between current distance and goal distance
  var diff = (deltaMag - goal) / deltaMag;

  debug('delta mag', deltaMag);
  debug('diff', diff);

  // approximate mass
  v2.scale(delta, delta, diff / imass);

  debug('delta diff/imass', delta);

  var p1correction = v2.scale(v2(), delta, imass1);
  var p2correction = v2.scale(v2(), delta, imass2);

  debug('p1correction', p1correction);
  debug('p2correction', p2correction);

  if (p1mass) v2.add(p1.cpos, p1.cpos, p1correction);
  if (p2mass) v2.sub(p2.cpos, p2.cpos, p2correction);
};

},{"./v2":15,"debug":8}],5:[function(require,module,exports){
'use strict';

var _scienceHalt = require('science-halt');

var _scienceHalt2 = _interopRequireDefault(_scienceHalt);

var _v = require('../v2');

var _v2 = _interopRequireDefault(_v);

var _accelerate2d = require('../accelerate2d');

var _accelerate2d2 = _interopRequireDefault(_accelerate2d);

var _inertia2d = require('../inertia2d');

var _inertia2d2 = _interopRequireDefault(_inertia2d);

var _gravitation2d = require('../gravitation2d');

var _gravitation2d2 = _interopRequireDefault(_gravitation2d);

var _overlapcirclecircle = require('../overlapcirclecircle');

var _overlapcirclecircle2 = _interopRequireDefault(_overlapcirclecircle);

var _collidecirclecircle = require('../collidecirclecircle');

var _collidecirclecircle2 = _interopRequireDefault(_collidecirclecircle);

var _collidecircleedge = require('../collidecircleedge');

var _collidecircleedge2 = _interopRequireDefault(_collidecircleedge);

var _distanceconstraint2d = require('../distanceconstraint2d');

var _distanceconstraint2d2 = _interopRequireDefault(_distanceconstraint2d);

var _rewindtocollisionpoint = require('../rewindtocollisionpoint');

var _rewindtocollisionpoint2 = _interopRequireDefault(_rewindtocollisionpoint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var cvs = document.createElement('canvas');
var ctx = cvs.getContext('2d');
cvs.width = cvs.height = 800;
cvs.style.border = '1px solid gray';
document.body.appendChild(cvs);

// generate a circle of circles
var CENTER = { x: 400, y: 400 };
var GRAVITATIONAL_POINT = {
  cpos: _v2.default.copy((0, _v2.default)(), CENTER),
  ppos: _v2.default.copy((0, _v2.default)(), CENTER),
  acel: (0, _v2.default)(),
  radius: 20,
  mass: 1000000
};
var RADIUS = 13;
var DAMPING = 0.5;
var CONSTRAINT_ITERATIONS = 30;
var boxes = generateBoxes(CENTER, RADIUS, 40);
var points = boxes.reduce(function (all, box) {
  return all.push.apply(all, _toConsumableArray(box.points)) && all;
}, []);
var colliding = [];

points.unshift(GRAVITATIONAL_POINT);

var running = true;
(0, _scienceHalt2.default)(function () {
  return running = false;
});

(function step() {
  var force = (0, _v2.default)();
  var dt = 1;

  for (var i = 0; i < CONSTRAINT_ITERATIONS; i++) {
    for (var _i = 0; _i < boxes.length; _i++) {
      var box = boxes[_i];
      var _points = box.points;
      var goals = box.goals;

      // p1, p1mass, p2, p2mass, goal

      (0, _distanceconstraint2d2.default)(_points[0], _points[0].mass, _points[1], _points[1].mass, goals[0]);
      (0, _distanceconstraint2d2.default)(_points[1], _points[1].mass, _points[2], _points[2].mass, goals[1]);
      (0, _distanceconstraint2d2.default)(_points[2], _points[2].mass, _points[3], _points[3].mass, goals[2]);
      (0, _distanceconstraint2d2.default)(_points[3], _points[3].mass, _points[0], _points[0].mass, goals[3]);
      (0, _distanceconstraint2d2.default)(_points[0], _points[0].mass, _points[2], _points[2].mass, goals[4]);
      (0, _distanceconstraint2d2.default)(_points[1], _points[1].mass, _points[3], _points[3].mass, goals[5]);
    }
  }

  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    if (point !== GRAVITATIONAL_POINT) {
      (0, _gravitation2d2.default)(point, point.mass, GRAVITATIONAL_POINT, GRAVITATIONAL_POINT.mass);
      //v2.sub(force, GRAVITATIONAL_POINT.cpos, point.cpos);
      //v2.normalize(force, force);
      //v2.scale(force, force, 50);
      //v2.add(point.acel, point.acel, force);
    }
    (0, _accelerate2d2.default)(point, dt);
  }

  collisionPairs(colliding, points);

  for (var i = 0; i < colliding.length; i += 2) {
    var pointA = colliding[i];
    var pointB = colliding[i + 1];
    (0, _collidecirclecircle2.default)(pointA, pointA.radius, pointA.mass, pointB, pointB.radius, pointB.mass, false, DAMPING);
  }

  collisionEdges(false, points, boxes);

  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    (0, _inertia2d2.default)(point, dt);
  }

  for (var i = 0; i < colliding.length; i += 2) {
    var pointA = colliding[i];
    var pointB = colliding[i + 1];
    (0, _collidecirclecircle2.default)(pointA, pointA.radius, pointA.mass, pointB, pointB.radius, pointB.mass, true, DAMPING);
  }

  collisionEdges(true, points, boxes);

  render(boxes, points, ctx);
  if (!running) return;
  window.requestAnimationFrame(step);
})();

function collisionPairs(pairs, points) {
  pairs.length = 0;

  for (var i = 0; i < points.length; i++) {
    var pointA = points[i];
    for (var j = i + 1; j < points.length; j++) {
      var pointB = points[j];
      if ((0, _overlapcirclecircle2.default)(pointA.cpos.x, pointA.cpos.y, pointA.radius, pointB.cpos.x, pointB.cpos.y, pointB.radius)) {
        pairs.push(pointA, pointB);
      }
    }
  }

  return pairs;
}

function collisionEdges(preserveInertia, points, boxes) {
  //collidingEdges.length = 0;

  // for each edge, test against each point
  for (var i = 0; i < boxes.length; i++) {
    var box = boxes[i];
    for (var j = 0; j < points.length; j++) {
      var point = points[j];
      if (point === box.points[0] || point === box.points[1] || point === box.points[2] || point === box.points[3]) {
        continue;
      }

      (0, _rewindtocollisionpoint2.default)(point, box.points[0], box.points[1]);
      (0, _rewindtocollisionpoint2.default)(point, box.points[1], box.points[2]);
      (0, _rewindtocollisionpoint2.default)(point, box.points[2], box.points[3]);
      (0, _rewindtocollisionpoint2.default)(point, box.points[3], box.points[0]);

      (0, _collidecircleedge2.default)(point, point.radius, point.mass, box.points[0], box.points[0].mass, box.points[1], box.points[1].mass, preserveInertia, DAMPING);

      (0, _collidecircleedge2.default)(point, point.radius, point.mass, box.points[1], box.points[1].mass, box.points[2], box.points[2].mass, preserveInertia, DAMPING);

      (0, _collidecircleedge2.default)(point, point.radius, point.mass, box.points[2], box.points[2].mass, box.points[3], box.points[3].mass, preserveInertia, DAMPING);

      (0, _collidecircleedge2.default)(point, point.radius, point.mass, box.points[3], box.points[3].mass, box.points[0], box.points[0].mass, preserveInertia, DAMPING);
    }
  }
}

function generateBoxes(center, baseRadius, num) {
  var all = [];
  var minRadius = 10;
  for (var i = 0; i < num; i++) {
    var x = Math.cos(i) * center.x + center.x;
    var y = Math.sin(i) * center.y + center.y;
    var group = [];
    var half = Math.max(Math.abs(Math.cos(i) + Math.sin(i)) * baseRadius, minRadius);
    var radius = 5;
    var mass = Math.max(Math.abs(Math.cos(i) + Math.sin(i)) * 1, 1);
    group.push({
      cpos: { x: x - half, y: y - half },
      ppos: { x: x - half, y: y - half },
      acel: (0, _v2.default)(), radius: radius, mass: mass
    });
    group.push({
      cpos: { x: x + half, y: y - half },
      ppos: { x: x + half, y: y - half },
      acel: (0, _v2.default)(), radius: radius, mass: mass
    });
    group.push({
      cpos: { x: x + half, y: y + half },
      ppos: { x: x + half, y: y + half },
      acel: (0, _v2.default)(), radius: radius, mass: mass
    });
    group.push({
      cpos: { x: x - half, y: y + half },
      ppos: { x: x - half, y: y + half },
      acel: (0, _v2.default)(), radius: radius, mass: mass
    });
    all.push({
      points: group,
      goals: [half * 2, half * 2, half * 2, half * 2, half * 2 * Math.SQRT2, half * 2 * Math.SQRT2]
    });
  }
  return all;
}

function render(boxes, points, ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (var i = 0; i < points.length; i++) {
    var point = points[i];

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(point.ppos.x, point.ppos.y, point.radius, 0, Math.PI * 2, false);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(point.cpos.x, point.cpos.y, point.radius, 0, Math.PI * 2, false);
    ctx.fill();
  }

  for (var i = 0; i < boxes.length; i++) {
    var box = boxes[i];

    ctx.fillStyle = 'rgba(255,0,0,0.5)';
    ctx.beginPath();
    ctx.moveTo(box.points[0].cpos.x, box.points[0].cpos.y);
    ctx.lineTo(box.points[1].cpos.x, box.points[1].cpos.y);
    ctx.lineTo(box.points[2].cpos.x, box.points[2].cpos.y);
    ctx.lineTo(box.points[3].cpos.x, box.points[3].cpos.y);
    ctx.lineTo(box.points[0].cpos.x, box.points[0].cpos.y);
    ctx.fill();
  }
}

},{"../accelerate2d":1,"../collidecirclecircle":2,"../collidecircleedge":3,"../distanceconstraint2d":4,"../gravitation2d":6,"../inertia2d":7,"../overlapcirclecircle":12,"../rewindtocollisionpoint":13,"../v2":15,"science-halt":11}],6:[function(require,module,exports){
'use strict';

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
  factor = gravityConstant * (p1mass * p2mass / (mag * mag));

  // scale by gravity acceleration
  v2.normalize(accel1, accel1);
  v2.scale(accel1, accel1, factor);

  // add the acceleration from gravity to p1 accel
  v2.add(p1.acel, p1.acel, accel1);
};

},{"./v2":15}],7:[function(require,module,exports){
'use strict';

var v2 = require('./v2');

module.exports = function (cmp) {
  var x = cmp.cpos.x * 2 - cmp.ppos.x,
      y = cmp.cpos.y * 2 - cmp.ppos.y;

  v2.set(cmp.ppos, cmp.cpos.x, cmp.cpos.y);
  v2.set(cmp.cpos, x, y);
};

},{"./v2":15}],8:[function(require,module,exports){

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // This hackery is required for IE8,
  // where the `console.log` function doesn't have 'apply'
  return 'object' == typeof console
    && 'function' == typeof console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      localStorage.removeItem('debug');
    } else {
      localStorage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = localStorage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

},{"./debug":9}],9:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":10}],10:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  var match = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 's':
      return n * s;
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],11:[function(require,module,exports){

module.exports = function(onhalt, opt_msg, opt_keycode) {
  document.addEventListener('keydown', function(e) {
    if (e.which == (opt_keycode || 27)) {
      onhalt();
      console.log(opt_msg || 'HALT IN THE NAME OF SCIENCE!');
    }
  })
}
},{}],12:[function(require,module,exports){
"use strict";

module.exports = function (ax, ay, arad, bx, by, brad) {
  var x = bx - ax;
  var y = by - ay;
  var rad = arad + brad;
  return x * x + y * y < rad * rad;
};

},{}],13:[function(require,module,exports){
'use strict';

var debug = require('debug')('pocket-physics:rewind-to-collision-point');
var v2 = require('./v2');
var segmentIntersection = require('./segmentintersection');

var tunnelPoint = v2();
var offset = v2();

module.exports = function rewindToCollisionPoint(point3, point1, point2) {

  // detect if a collision has occurred but would have been missed due to
  // point3 moving beyond the edge in one time step.

  var hasTunneled = segmentIntersection(point3.cpos, point3.ppos, point1.cpos, point2.cpos, tunnelPoint);

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
};

function debuggerIfNaN(point) {
  if (isNaN(point.x) || isNaN(point.y)) {
    debugger;
  }
}

},{"./segmentintersection":14,"./v2":15,"debug":8}],14:[function(require,module,exports){
'use strict';

var v2 = require('./v2');

var s1 = v2();
var s2 = v2();

// adapted from http://stackoverflow.com/a/1968345

module.exports = function segmentIntersection(p0, p1, p2, p3, intersectionPoint) {
  v2.sub(s1, p1, p0);
  v2.sub(s2, p3, p2);

  var s = (-s1.y * (p0.x - p2.x) + s1.x * (p0.y - p2.y)) / (-s2.x * s1.y + s1.x * s2.y);
  var t = (s2.x * (p0.y - p2.y) - s2.y * (p0.x - p2.x)) / (-s2.x * s1.y + s1.x * s2.y);

  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    // Collision detected
    intersectionPoint.x = p0.x + t * s1.x;
    intersectionPoint.y = p0.y + t * s1.y;
    return true;
  }

  return false;
};

},{"./v2":15}],15:[function(require,module,exports){
"use strict";

function v2(x, y) {
  return { x: x || 0, y: y || 0 };
}

v2.copy = function (out, a) {
  out.x = a.x;
  out.y = a.y;
  return out;
};

v2.set = function (out, x, y) {
  out.x = x;
  out.y = y;
  return out;
};

v2.add = function (out, a, b) {
  out.x = a.x + b.x;
  out.y = a.y + b.y;
  return out;
};

v2.sub = function (out, a, b) {
  out.x = a.x - b.x;
  out.y = a.y - b.y;
  return out;
};

v2.dot = function (a, b) {
  return a.x * b.x + a.y * b.y;
};

v2.scale = function (out, a, factor) {
  out.x = a.x * factor;
  out.y = a.y * factor;
  return out;
};

v2.distance = function (v1, v2) {
  var x = v1.x - v2.x;
  var y = v1.y - v2.y;
  return Math.sqrt(x * x + y * y);
};

v2.distance2 = function (v1, v2) {
  var x = v1.x - v2.x;
  var y = v1.y - v2.y;
  return x * x + y * y;
};

v2.magnitude = function (v1) {
  var x = v1.x;
  var y = v1.y;
  return Math.sqrt(x * x + y * y);
};

v2.normalize = function (out, a) {
  var x = a.x;
  var y = a.y;
  var len = x * x + y * y;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    out.x = a.x * len;
    out.y = a.y * len;
  }
  return out;
};

v2.normal = function (out, e1, e2) {
  out.y = e2.x - e1.x;
  out.x = e1.y - e2.y;
  return v2.normalize(out, out);
};

module.exports = v2;

},{}]},{},[5]);
