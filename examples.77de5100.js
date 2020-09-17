// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/science-halt/index.js":[function(require,module,exports) {

module.exports = function(onhalt, opt_msg, opt_keycode) {
  document.addEventListener('keydown', function(e) {
    if (e.which == (opt_keycode || 27)) {
      onhalt();
      console.log(opt_msg || 'HALT IN THE NAME OF SCIENCE!');
    }
  })
}
},{}],"../src/v2.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.v2 = v2;
exports.vd = vd;
exports.angleOf = angleOf;
exports.rotate2d = exports.translate = exports.perpDot = exports.normal = exports.normalize = exports.magnitude = exports.distance2 = exports.distance = exports.scale = exports.dot = exports.sub = exports.add = exports.set = exports.copy = void 0;

function v2(x, y) {
  return {
    x: x || 0,
    y: y || 0
  };
}

var copy = function copy(out, a) {
  out.x = a.x;
  out.y = a.y;
  return out;
};

exports.copy = copy;

var set = function set(out, x, y) {
  out.x = x;
  out.y = y;
  return out;
};

exports.set = set;

var add = function add(out, a, b) {
  out.x = a.x + b.x;
  out.y = a.y + b.y;
  return out;
};

exports.add = add;

var sub = function sub(out, a, b) {
  out.x = a.x - b.x;
  out.y = a.y - b.y;
  return out;
};

exports.sub = sub;

var dot = function dot(a, b) {
  return a.x * b.x + a.y * b.y;
};

exports.dot = dot;

var scale = function scale(out, a, factor) {
  out.x = a.x * factor;
  out.y = a.y * factor;
  return out;
};

exports.scale = scale;

var distance = function distance(v1, v2) {
  var x = v1.x - v2.x;
  var y = v1.y - v2.y;
  return Math.sqrt(x * x + y * y);
};

exports.distance = distance;

var distance2 = function distance2(v1, v2) {
  var x = v1.x - v2.x;
  var y = v1.y - v2.y;
  return x * x + y * y;
};

exports.distance2 = distance2;

var magnitude = function magnitude(v1) {
  var x = v1.x;
  var y = v1.y;
  return Math.sqrt(x * x + y * y);
};

exports.magnitude = magnitude;

var normalize = function normalize(out, a) {
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
/**
 * Compute the normal pointing away perpendicular from two vectors.
 * Given v1(0,0) -> v2(10, 0), the normal will be (0, 1)
 * */


exports.normalize = normalize;

var normal = function normal(out, v1, v2) {
  out.y = v2.x - v1.x;
  out.x = v1.y - v2.y;
  return normalize(out, out);
}; // the perpendicular dot product, also known as "cross" elsewhere
// http://stackoverflow.com/a/243977/169491


exports.normal = normal;

var perpDot = function perpDot(v1, v2) {
  return v1.x * v2.y - v1.y * v2.x;
};
/**
 * This is mostly useful for moving a verlet-style [current, previous]
 * by the same amount, translating them while preserving velocity.
 * @param by the vector to add to each subsequent vector
 * @param vN any number of vectors to translate
 */


exports.perpDot = perpDot;

var translate = function translate(by) {
  var vN = [];

  for (var _i = 1; _i < arguments.length; _i++) {
    vN[_i - 1] = arguments[_i];
  }

  for (var i = 0; i < vN.length; i++) {
    var v = vN[i];
    add(v, v, by);
  }
};
/**
 *
 * @param v Print this vector for nice logs
 */


exports.translate = translate;

function vd(v) {
  return "(" + v.x + ", " + v.y + ")";
}
/**
 * Rotate a vector around another point. Taken nearly verbatim from gl-matrix
 */


var rotate2d = function rotate2d(out, target, origin, rad) {
  //Translate point to the origin
  var p0 = target.x - origin.x;
  var p1 = target.y - origin.y;
  var sinC = Math.sin(rad);
  var cosC = Math.cos(rad); //perform rotation and translate to correct position

  out.x = p0 * cosC - p1 * sinC + origin.x;
  out.y = p0 * sinC + p1 * cosC + origin.y;
  return out;
};
/**
 * Compute the Theta angle between a vector and the origin.
 */


exports.rotate2d = rotate2d;

function angleOf(v) {
  return Math.atan2(v.y, v.x);
}
},{}],"../src/accelerate.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.accelerate = void 0;

var _v = require("./v2");

var accelerate = function accelerate(cmp, dt) {
  // apply acceleration to current position, convert dt to seconds
  cmp.cpos.x += cmp.acel.x * dt * dt * 0.001;
  cmp.cpos.y += cmp.acel.y * dt * dt * 0.001; // reset acceleration

  (0, _v.set)(cmp.acel, 0, 0);
};

exports.accelerate = accelerate;
},{"./v2":"../src/v2.ts"}],"../src/collide-circle-circle.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collideCircleCircle = void 0;

var _v = require("./v2");

// Preallocations!
var vel1 = {
  x: 0,
  y: 0
};
var vel2 = {
  x: 0,
  y: 0
};
var diff = {
  x: 0,
  y: 0
};
var move = {
  x: 0,
  y: 0
}; // TODO: is the below even true???
// The codeflow demo does nothing if the circles are no longer overlapping.
// It's very important that this function not do any distance checking.
// It is assumed that if this function is called, then the points are
// definitely colliding, and that after being called with preserveInertia
// === false, another call with === true should be made, even if the first
// calculation has moved the points away from physically touching.

var collideCircleCircle = function collideCircleCircle(p1, p1radius, p1mass, p2, p2radius, p2mass, preserveInertia, damping) {
  var dist2 = (0, _v.distance2)(p1.cpos, p2.cpos);
  var target = p1radius + p2radius;
  var min2 = target * target; // if (dist2 > min2) return;

  (0, _v.sub)(vel1, p1.cpos, p1.ppos);
  (0, _v.sub)(vel2, p2.cpos, p2.ppos);
  (0, _v.sub)(diff, p1.cpos, p2.cpos);
  var dist = Math.sqrt(dist2);
  var factor = (dist - target) / dist; // Avoid division by zero in case points are directly atop each other.

  if (dist === 0) factor = 1;
  var mass1 = p1mass > 0 ? p1mass : 1;
  var mass2 = p2mass > 0 ? p2mass : 1;
  var massT = mass1 + mass2; // Move a away

  move.x = diff.x * factor * (mass2 / massT);
  move.y = diff.y * factor * (mass2 / massT);

  if (p1mass > 0) {
    (0, _v.sub)(p1.cpos, p1.cpos, move);
  } // Move b away


  move.x = diff.x * factor * (mass1 / massT);
  move.y = diff.y * factor * (mass1 / massT);

  if (p2mass > 0) {
    (0, _v.add)(p2.cpos, p2.cpos, move);
  }

  if (!preserveInertia) return;
  damping = damping || 1;
  var f1 = damping * (diff.x * vel1.x + diff.y * vel1.y) / (dist2 || 1);
  var f2 = damping * (diff.x * vel2.x + diff.y * vel2.y) / (dist2 || 1);
  vel1.x += (f2 * diff.x - f1 * diff.x) / (mass1 || 1); // * (mass2 / massT);

  vel2.x += (f1 * diff.x - f2 * diff.x) / (mass2 || 1); // * (mass1 / massT);

  vel1.y += (f2 * diff.y - f1 * diff.y) / (mass1 || 1); // * (mass2 / massT);

  vel2.y += (f1 * diff.y - f2 * diff.y) / (mass2 || 1); // * (mass1 / massT);

  if (p1mass > 0) (0, _v.set)(p1.ppos, p1.cpos.x - vel1.x, p1.cpos.y - vel1.y);
  if (p2mass > 0) (0, _v.set)(p2.ppos, p2.cpos.x - vel2.x, p2.cpos.y - vel2.y);
};

exports.collideCircleCircle = collideCircleCircle;
},{"./v2":"../src/v2.ts"}],"../src/collide-circle-edge.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collideCircleEdge = collideCircleEdge;

var _v = require("./v2");

var _collideCircleCircle = require("./collide-circle-circle");

// Preallocations
var edgeDir = (0, _v.v2)();
var edge = (0, _v.v2)();
var prevEdge = (0, _v.v2)();
var hypo = (0, _v.v2)();
var epDiff = (0, _v.v2)();
var correction = (0, _v.v2)();
var collisionPoint = (0, _v.v2)();
var tunnelPoint = (0, _v.v2)();
var ep = {
  cpos: (0, _v.v2)(),
  ppos: (0, _v.v2)()
};
var epBefore = {
  cpos: (0, _v.v2)(),
  ppos: (0, _v.v2)()
};

function collideCircleEdge(circle, radius3, mass3, endpoint1, mass1, endpoint2, mass2, preserveInertia, damping) {
  // Edge direction (edge in local space)
  (0, _v.sub)(edge, endpoint2.cpos, endpoint1.cpos); // Normalize collision edge (assume collision axis is edge)

  (0, _v.normalize)(edgeDir, edge); // Vector from endpoint1 to particle

  (0, _v.sub)(hypo, circle.cpos, endpoint1.cpos); // Where is the particle on the edge, before, after, or on?
  // Also used for interpolation later.

  var projection = (0, _v.dot)(edge, hypo);
  var maxDot = (0, _v.dot)(edge, edge);
  var edgeMag = Math.sqrt(maxDot); // Colliding beyond the edge...

  if (projection < 0 || projection > maxDot) return; // Create interpolation factor of where point closest
  // to particle is on the line.

  var t = projection / maxDot;
  var u = 1 - t; // Find the point of collision on the edge.

  (0, _v.scale)(collisionPoint, edgeDir, t * edgeMag);
  (0, _v.add)(collisionPoint, collisionPoint, endpoint1.cpos);
  var dist = (0, _v.distance)(collisionPoint, circle.cpos); // Bail if point and edge are too far apart.

  if (dist > radius3) return; // Distribute mass of colliding point into two fake points
  // and use those to collide against each endpoint independently.

  var standinMass1 = u * mass3;
  var standinMass2 = t * mass3;
  var standin1 = {
    cpos: (0, _v.v2)(),
    ppos: (0, _v.v2)()
  };
  var standin2 = {
    cpos: (0, _v.v2)(),
    ppos: (0, _v.v2)()
  }; // Slide standin1 along edge to be in front of endpoint1

  (0, _v.scale)(standin1.cpos, edgeDir, t * edgeMag);
  (0, _v.sub)(standin1.cpos, circle.cpos, standin1.cpos);
  (0, _v.scale)(standin1.ppos, edgeDir, t * edgeMag);
  (0, _v.sub)(standin1.ppos, circle.ppos, standin1.ppos); // Slide standin2 along edge to be in front of endpoint2

  (0, _v.scale)(standin2.cpos, edgeDir, u * edgeMag);
  (0, _v.add)(standin2.cpos, circle.cpos, standin2.cpos);
  (0, _v.scale)(standin2.ppos, edgeDir, u * edgeMag);
  (0, _v.add)(standin2.ppos, circle.ppos, standin2.ppos);
  var standin1Before = {
    cpos: (0, _v.v2)(),
    ppos: (0, _v.v2)()
  };
  var standin2Before = {
    cpos: (0, _v.v2)(),
    ppos: (0, _v.v2)()
  }; // Stash state of standins

  (0, _v.copy)(standin1Before.cpos, standin1.cpos);
  (0, _v.copy)(standin1Before.ppos, standin1.ppos);
  (0, _v.copy)(standin2Before.cpos, standin2.cpos);
  (0, _v.copy)(standin2Before.ppos, standin2.ppos);
  var edgeRadius = 0; // Collide standins with endpoints

  (0, _collideCircleCircle.collideCircleCircle)(standin1, radius3, standinMass1, endpoint1, edgeRadius, mass1, preserveInertia, damping);
  (0, _collideCircleCircle.collideCircleCircle)(standin2, radius3, standinMass2, endpoint2, edgeRadius, mass2, preserveInertia, damping);
  var standin1Delta = {
    cpos: (0, _v.v2)(),
    ppos: (0, _v.v2)()
  };
  var standin2Delta = {
    cpos: (0, _v.v2)(),
    ppos: (0, _v.v2)()
  }; // Compute standin1 cpos change

  (0, _v.sub)(standin1Delta.cpos, standin1.cpos, standin1Before.cpos); // Compute standin2 cpos change

  (0, _v.sub)(standin2Delta.cpos, standin2.cpos, standin2Before.cpos);
  (0, _v.scale)(standin1Delta.cpos, standin1Delta.cpos, u);
  (0, _v.scale)(standin2Delta.cpos, standin2Delta.cpos, t); // Apply cpos changes to point3

  (0, _v.add)(circle.cpos, circle.cpos, standin1Delta.cpos);
  (0, _v.add)(circle.cpos, circle.cpos, standin2Delta.cpos);
  if (!preserveInertia) return; // TODO: instead of adding diff, get magnitude of diff and scale
  // in reverse direction of standin velocity from point3.cpos because
  // that is what circlecircle does.
  // Compute standin1 ppos change

  (0, _v.sub)(standin1Delta.ppos, standin1.ppos, standin1Before.ppos); // Compute standin2 ppos change

  (0, _v.sub)(standin2Delta.ppos, standin2.ppos, standin2Before.ppos);
  (0, _v.scale)(standin1Delta.ppos, standin1Delta.ppos, u);
  (0, _v.scale)(standin2Delta.ppos, standin2Delta.ppos, t); // Apply ppos changes to point3

  (0, _v.add)(circle.ppos, circle.ppos, standin1Delta.ppos);
  (0, _v.add)(circle.ppos, circle.ppos, standin2Delta.ppos);
}

function snapshotDebug(name, particles, points) {
  if (particles === void 0) {
    particles = [];
  }

  if (points === void 0) {
    points = [];
  }

  var cvs = document.createElement("canvas");
  var ctx = cvs.getContext("2d");
  document.body.appendChild(cvs); // let minX = Number.MAX_SAFE_INTEGER;
  // let maxX = Number.MIN_SAFE_INTEGER;
  // let minY = Number.MAX_SAFE_INTEGER;
  // let maxY = Number.MIN_SAFE_INTEGER;
  // for (let i = 0; i < particles.length; i++) {
  //   const particle = particles[i];
  //   minX = Math.min(
  //     minX,
  //     particle.cpos.x - particle.radius,
  //     particle.ppos.x - particle.radius
  //   );
  //   maxX = Math.max(
  //     maxX,
  //     particle.cpos.x + particle.radius,
  //     particle.ppos.x + particle.radius
  //   );
  //   minY = Math.min(
  //     minY,
  //     particle.cpos.y - particle.radius,
  //     particle.ppos.y - particle.radius
  //   );
  //   maxY = Math.max(
  //     maxY,
  //     particle.cpos.y + particle.radius,
  //     particle.ppos.y + particle.radius
  //   );
  // }
  // for (let i = 0; i < points.length; i++) {
  //   const [, point] = points[i];
  //   minX = Math.min(minX, point.x, point.x);
  //   maxX = Math.max(maxX, point.x, point.x);
  //   minY = Math.min(minY, point.y, point.y);
  //   maxY = Math.max(maxY, point.y, point.y);
  // }
  // cvs.width = maxX - minX;
  // cvs.height = maxY - minY;
  // ctx.translate(-minX, -minY);

  cvs.width = 800;
  cvs.height = 800;

  for (var i = 0; i < particles.length; i++) {
    var particle = particles[i];
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.arc(particle.ppos.x, particle.ppos.y, particle.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.arc(particle.cpos.x, particle.cpos.y, particle.radius, 0, Math.PI * 2, false);
    ctx.fill();
  }

  for (var i = 0; i < points.length; i++) {
    var _a = points[i],
        name_1 = _a[0],
        point = _a[1];
    ctx.fillStyle = "purple";
    ctx.fillRect(point.x, point.y, 1, 1);
    ctx.fillText(name_1 + " (" + point.x + "," + point.y + ")", point.x + 1, point.y + 1);
  } // ctx.translate(minX, minY);


  ctx.fillStyle = "black";
  ctx.fillText(name, 10, 10);
}
},{"./v2":"../src/v2.ts","./collide-circle-circle":"../src/collide-circle-circle.ts"}],"../src/collision-response-aabb.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collisionResponseAABB = void 0;

var _v = require("./v2");

// Registers / Preallocations
var basis = (0, _v.v2)();
var basisNeg = (0, _v.v2)();
var vel1 = (0, _v.v2)();
var vel1x = (0, _v.v2)();
var vel1y = (0, _v.v2)();
var vel2 = (0, _v.v2)();
var vel2x = (0, _v.v2)();
var vel2y = (0, _v.v2)();
var newVel1 = (0, _v.v2)();
var newVel2 = (0, _v.v2)();
var t1 = (0, _v.v2)();
var t2 = (0, _v.v2)();
var u1 = (0, _v.v2)();
var u2 = (0, _v.v2)(); // TODO: Put this somewhere...

var EPSILON = 0.0001; // TODO: change this API to accept numbers (x, y) instead of vectors
// friction calc: sqrt(friction1*friction2)
// restitution: box2d: https://github.com/erincatto/Box2D/blob/6a69ddbbd59b21c0d6699c43143b4114f7f92e21/Box2D/Box2D/Dynamics/Contacts/b2Contact.h#L42-L47
// Math.max(restitution1, restitution2);

/**
 * Really should be called collisionResponseImpulse, as it has nothing to do
 * with the shape of the bodies colliding. It's just two points with mass and
 * friction.
 * @param cpos1
 * @param ppos1
 * @param mass1
 * @param restitution1 1 == perfectly elastic collision, 0 == all energy is
 * killed.
 * @param staticFriction1 How much friction must be overcome before the object
 * will start moving. 0 == no friction, 1 == max friction. Set this higher, like
 * 0.9.
 * @param dynamicFriction1 How much constant friction occurs when the object is
 * already in motion. 0 == no friction, 1 == max friction. Better to set this
 * low, like 0.1.
 * @param cpos2
 * @param ppos2
 * @param mass2
 * @param restitution2 1 == perfectly elastic collision, 0 == all energy is
 * killed.
 * @param staticFriction2 How much friction must be overcome before the object
 * will start moving. 0 == no friction, 1 == max friction. Set this higher, like
 * 0.9.
 * @param dynamicFriction2 How much constant friction occurs when the object is
 * already in motion. 0 == no friction, 1 == max friction. Better to set this
 * low, like 0.1.
 * @param collisionNormal The vector defining the relative axis of collision.
 * Leaving this as 0,0 will compute it as the midpoint between positions of the
 * two colliding objects (modeling a circular collision). If colliding with a
 * known edge or line segment, it's best to provide the edge normal as this
 * value.
 * @param vel1out The new velocity resulting from reacting to this collison.
 * cpos1 - this value == new ppos1.
 * @param vel2out The new velocity resulting from reacting to this collison.
 * cpos2 - this value == new ppos2.
 */

var collisionResponseAABB = function collisionResponseAABB(cpos1, ppos1, mass1, restitution1, staticFriction1, dynamicFriction1, cpos2, ppos2, mass2, restitution2, staticFriction2, dynamicFriction2, collisionNormal, vel1out, vel2out) {
  // blank out all preallocated vectors.
  (0, _v.set)(basis, 0, 0);
  (0, _v.set)(basisNeg, 0, 0);
  (0, _v.set)(vel1, 0, 0);
  (0, _v.set)(vel1x, 0, 0);
  (0, _v.set)(vel1y, 0, 0);
  (0, _v.set)(vel2, 0, 0);
  (0, _v.set)(vel2x, 0, 0);
  (0, _v.set)(vel2y, 0, 0);
  (0, _v.set)(newVel1, 0, 0);
  (0, _v.set)(newVel2, 0, 0);
  (0, _v.set)(t1, 0, 0);
  (0, _v.set)(t2, 0, 0);
  (0, _v.set)(u1, 0, 0);
  (0, _v.set)(u2, 0, 0); // If collisionNormal is provided, use it. Otherwise, use midpoint between
  // current positions as axis of collision. Midpoint will model a circular
  // collision if used.

  if (collisionNormal && (collisionNormal.x !== 0 || collisionNormal.y !== 0)) {
    (0, _v.set)(basis, collisionNormal.x, collisionNormal.y);
  } else {
    (0, _v.sub)(basis, cpos1, cpos2);
    (0, _v.normalize)(basis, basis);
  }

  (0, _v.scale)(basisNeg, basis, -1); //const friction;
  // Take max of restitutions, like box2d does.
  // https://github.com/erincatto/Box2D/blob/6a69ddbbd59b21c0d6699c43143b4114f7f92e21/Box2D/Box2D/Dynamics/Contacts/b2Contact.h#L42-L47
  // "for example, a superball bounces on everything"

  var restitution = restitution1 > restitution2 ? restitution1 : restitution2;
  var massTotal = mass1 + mass2;
  var e = 1 + restitution; // I = (1+e)*N*(Vr • N) / (1/Ma + 1/Mb)
  // Va -= I * 1/Ma
  // Vb += I * 1/Mb
  //sub(vel1, cpos1, ppos1);
  //sub(vel2, cpos2, ppos2);
  //const relativeVelocity = sub(vel1, vel2);
  //const I = v2();
  //scale(I, normal, (1 + restitution) * dot(relativeVelocity, normal));
  //scale(I, I, 1 / (1/mass1 + 1/mass2));
  // "x" and "y" in the following sections are shorthand for:
  // x: component of the box velocity parallel to the collision normal
  // y: the rest of the collision velocity
  // calculate x-direction velocity vector and perpendicular y-vector for box 1

  (0, _v.sub)(vel1, cpos1, ppos1);
  var x1 = (0, _v.dot)(basis, vel1);
  (0, _v.scale)(vel1x, basis, x1);
  (0, _v.sub)(vel1y, vel1, vel1x); // calculate x-direction velocity vector and perpendicular y-vector for box 2

  (0, _v.sub)(vel2, cpos2, ppos2);
  var x2 = (0, _v.dot)(basisNeg, vel2);
  (0, _v.scale)(vel2x, basisNeg, x2);
  (0, _v.sub)(vel2y, vel2, vel2x); // equations of motion for box1

  (0, _v.scale)(t1, vel1x, (mass1 - mass2) / massTotal);
  (0, _v.scale)(t2, vel2x, e * mass2 / massTotal);
  (0, _v.add)(newVel1, t1, t2);
  (0, _v.add)(newVel1, newVel1, vel1y); // equations of motion for box2

  (0, _v.scale)(u1, vel1x, e * mass1 / massTotal);
  (0, _v.scale)(u2, vel2x, (mass2 - mass1) / massTotal);
  (0, _v.add)(newVel2, u1, u2);
  (0, _v.add)(newVel2, newVel2, vel2y); // new relative velocity

  var rv = (0, _v.add)((0, _v.v2)(), newVel1, newVel2); // tangent to relative velocity vector

  var reg1 = (0, _v.v2)();
  (0, _v.scale)(reg1, basis, (0, _v.dot)(rv, basis));
  var tangent = (0, _v.sub)((0, _v.v2)(), rv, reg1);
  (0, _v.normalize)(tangent, tangent); // magnitude of relative velocity in tangent direction

  var jt = -(0, _v.dot)(rv, tangent);
  jt /= 1 / (mass1 + mass2); // not sure about this...
  // https://github.com/RandyGaul/ImpulseEngine/blob/d12af9c95555244a37dce1c7a73e60d5177df652/Manifold.cpp#L103

  var jtMag = Math.abs(jt); // only apply significant friction

  if (jtMag > EPSILON) {
    // magnitudes of velocity along the collision tangent, hopefully.
    var vel1ymag = (0, _v.magnitude)(vel1y);
    var vel2ymag = (0, _v.magnitude)(vel2y); // compute Coulumb's law (choosing dynamic vs static friction)

    var frictionImpulse1 = (0, _v.v2)();
    var frictionImpulse2 = (0, _v.v2)(); // TODO: may need to use Math.max(Math.abs(vel1ymag, vel2ymag)) when
    // choosing to incorporate velocity magnitude into the friction calc.
    // A stationary box getting hit currently receives perfect energy
    // transfer, since its vel2ymag is 0.

    if (jtMag < vel1ymag * staticFriction1) {
      (0, _v.scale)(frictionImpulse1, tangent, staticFriction1);
    } else {
      (0, _v.scale)(frictionImpulse1, tangent, -vel1ymag * dynamicFriction1);
    }

    if (jtMag < vel2ymag * staticFriction2) {
      (0, _v.scale)(frictionImpulse2, tangent, staticFriction2);
    } else {
      (0, _v.scale)(frictionImpulse2, tangent, -vel2ymag * dynamicFriction2);
    }

    (0, _v.add)(newVel1, newVel1, frictionImpulse1);
    (0, _v.add)(newVel2, newVel2, frictionImpulse2);
  } // output new velocity of box1 and box2


  (0, _v.copy)(vel1out, newVel1);
  (0, _v.copy)(vel2out, newVel2);
};

exports.collisionResponseAABB = collisionResponseAABB;
},{"./v2":"../src/v2.ts"}],"../src/solve-distance-constraint.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.solveDistanceConstraint = solveDistanceConstraint;

var _v = require("./v2");

// negative or zero mass implies a fixed or "pinned" point
function solveDistanceConstraint(p1, p1mass, p2, p2mass, goal, // number between 0 and 1
stiffness) {
  if (stiffness === void 0) {
    stiffness = 1;
  }

  var mass1 = p1mass > 0 ? p1mass : 1;
  var mass2 = p2mass > 0 ? p2mass : 1;
  var imass1 = 1 / (mass1 || 1);
  var imass2 = 1 / (mass2 || 1);
  var imass = imass1 + imass2; // Current relative vector

  var delta = (0, _v.sub)((0, _v.v2)(), p2.cpos, p1.cpos);
  var deltaMag = (0, _v.magnitude)(delta); // nothing to do.

  if (deltaMag === 0) return; // Difference between current distance and goal distance

  var diff = (deltaMag - goal) / deltaMag; // TODO: is this even correct? Should mass come into effect here?
  // approximate mass

  (0, _v.scale)(delta, delta, diff / imass); // TODO: not sure if this is the right place to apply stiffness.

  var p1correction = (0, _v.scale)((0, _v.v2)(), delta, imass1 * stiffness);
  var p2correction = (0, _v.scale)((0, _v.v2)(), delta, imass2 * stiffness); // Add correction to p1, but only if not "pinned".
  // If it's pinned and p2 is not, apply it to p2.

  if (p1mass > 0) {
    (0, _v.add)(p1.cpos, p1.cpos, p1correction);
  } else if (p2mass > 0) {
    (0, _v.sub)(p2.cpos, p2.cpos, p1correction);
  } // Add correction to p2, but only if not "pinned".
  // If it's pinned and p1 is not, apply it to p1.


  if (p2mass > 0) {
    (0, _v.sub)(p2.cpos, p2.cpos, p2correction);
  } else if (p1mass > 0) {
    (0, _v.add)(p1.cpos, p1.cpos, p2correction);
  }
}
},{"./v2":"../src/v2.ts"}],"../src/solve-drag.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.solveDrag = void 0;

var solveDrag = function solveDrag(p1, drag) {
  var x = (p1.ppos.x - p1.cpos.x) * drag;
  var y = (p1.ppos.y - p1.cpos.y) * drag;
  p1.ppos.x = p1.cpos.x + x;
  p1.ppos.y = p1.cpos.y + y;
};

exports.solveDrag = solveDrag;
},{}],"../src/solve-gravitation.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.solveGravitation = solveGravitation;

var _v = require("./v2");

var accel1 = (0, _v.v2)();

function solveGravitation(p1, p1mass, p2, p2mass, gravityConstant) {
  if (gravityConstant === void 0) {
    gravityConstant = 0.99;
  } // handle either obj not having mass


  if (p1mass <= 0 || p2mass <= 0) return;
  var mag;
  var factor;
  var diffx = p2.cpos.x - p1.cpos.x;
  var diffy = p2.cpos.y - p1.cpos.y;
  (0, _v.set)(accel1, diffx, diffy);
  mag = (0, _v.magnitude)(accel1); // Prevent divide by zero.

  mag = mag === 0 ? 1 : mag; // Newton's Law of Universal Gravitation -- Vector Form!

  factor = gravityConstant * (p1mass * p2mass / (mag * mag)); // scale by gravity acceleration

  (0, _v.normalize)(accel1, accel1);
  (0, _v.scale)(accel1, accel1, factor); // add the acceleration from gravity to p1 accel

  (0, _v.add)(p1.acel, p1.acel, accel1);
}
},{"./v2":"../src/v2.ts"}],"../src/inertia.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inertia = void 0;

var _v = require("./v2");

var inertia = function inertia(cmp) {
  var x = cmp.cpos.x * 2 - cmp.ppos.x;
  var y = cmp.cpos.y * 2 - cmp.ppos.y;
  (0, _v.set)(cmp.ppos, cmp.cpos.x, cmp.cpos.y);
  (0, _v.set)(cmp.cpos, x, y);
};

exports.inertia = inertia;
},{"./v2":"../src/v2.ts"}],"../src/overlap-aabb-aabb.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.overlapAABBAABB = exports.createAABBOverlapResult = void 0;

var _v = require("./v2");

/**
 * Create a result object to use for overlap tests.
 */
var createAABBOverlapResult = function createAABBOverlapResult() {
  return {
    resolve: (0, _v.v2)(),
    hitPos: (0, _v.v2)(),
    normal: (0, _v.v2)()
  };
};
/**
 * Compute the "collision manifold" for two AABB, storing the result in `result`.
 * Note: The `normal` is always perpendicular to an AABB edge, which may produce
 * some slighly weird-looking collisions. `collisionResponseAABB()` will compute
 * a normal using the midpoints, which looks more natural.
 */


exports.createAABBOverlapResult = createAABBOverlapResult;

var overlapAABBAABB = function overlapAABBAABB(center1X, center1Y, width1, height1, center2X, center2Y, width2, height2, result) {
  var dx = center2X - center1X;
  var px = width2 / 2 + width1 / 2 - Math.abs(dx);
  var dy = center2Y - center1Y;
  var py = height2 / 2 + height1 / 2 - Math.abs(dy);
  if (px <= 0) return null;
  if (py <= 0) return null;
  (0, _v.set)(result.resolve, 0, 0);
  (0, _v.set)(result.hitPos, 0, 0);
  (0, _v.set)(result.normal, 0, 0);

  if (px < py) {
    var sx = dx < 0 ? -1 : 1;
    result.resolve.x = px * sx;
    result.normal.x = sx; // Really not sure about these values.

    result.hitPos.x = center1X + width1 / 2 * sx;
    result.hitPos.y = center2Y;
  } else {
    var sy = dy < 0 ? -1 : 1;
    result.resolve.y = py * sy;
    result.normal.y = sy; // Really not sure about these values.

    result.hitPos.x = center2X;
    result.hitPos.y = center1Y + height1 / 2 * sy;
  }

  return result;
};

exports.overlapAABBAABB = overlapAABBAABB;
},{"./v2":"../src/v2.ts"}],"../src/overlap-circle-circle.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.overlapCircleCircle = void 0;

var overlapCircleCircle = function overlapCircleCircle(ax, ay, arad, bx, by, brad) {
  var x = bx - ax;
  var y = by - ay;
  var rad = arad + brad;
  return x * x + y * y < rad * rad;
};

exports.overlapCircleCircle = overlapCircleCircle;
},{}],"../src/segment-intersection.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.segmentIntersection = segmentIntersection;

var _v = require("./v2");

var s1 = (0, _v.v2)();
var s2 = (0, _v.v2)();

function segmentIntersection(p0, p1, p2, p3, intersectionPoint) {
  (0, _v.sub)(s1, p1, p0);
  (0, _v.sub)(s2, p3, p2);
  var s = (-s1.y * (p0.x - p2.x) + s1.x * (p0.y - p2.y)) / (-s2.x * s1.y + s1.x * s2.y);
  var t = (s2.x * (p0.y - p2.y) - s2.y * (p0.x - p2.x)) / (-s2.x * s1.y + s1.x * s2.y);

  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    // Collision detected
    intersectionPoint.x = p0.x + t * s1.x;
    intersectionPoint.y = p0.y + t * s1.y;
    return true;
  }

  return false;
}
},{"./v2":"../src/v2.ts"}],"../src/rewind-to-collision-point.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rewindToCollisionPoint = rewindToCollisionPoint;

var _v = require("./v2");

var _segmentIntersection = require("./segment-intersection");

var tunnelPoint = (0, _v.v2)();
var offset = (0, _v.v2)();
var v = (0, _v.v2)();
var direction = (0, _v.v2)();
var radiusSegment = (0, _v.v2)();
var cposIncludingRadius = (0, _v.v2)();

function rewindToCollisionPoint(point3, radius3, point1, point2) {
  // detect if a collision has occurred but would have been missed due to
  // point3 moving beyond the edge in one time step.
  // TODO: this should accept some sort of manifold or collision contact object,
  // not randum args (radius, etc). Without a manifold it's imposible to know 
  // if the point "tunneled" due to a collision or the result of _resolving_
  // a collision!
  // Compute where the cpos would be if the segment actually included the
  // radius.
  // Without this, we would rewind to the point3 center, and the direction
  // of two points colliding with each other exactly is undefined.
  (0, _v.sub)(v, point3.cpos, point3.ppos);
  (0, _v.normalize)(direction, v);
  (0, _v.scale)(radiusSegment, direction, radius3);
  (0, _v.add)(cposIncludingRadius, radiusSegment, point3.cpos);
  var hasTunneled = (0, _segmentIntersection.segmentIntersection)(cposIncludingRadius, point3.ppos, point1, point2, tunnelPoint);
  if (!hasTunneled) return false; // Translate point3 to tunnelPoint, including the radius of the point.

  (0, _v.sub)(offset, cposIncludingRadius, tunnelPoint);
  (0, _v.sub)(point3.cpos, point3.cpos, offset);
  (0, _v.sub)(point3.ppos, point3.ppos, offset);
  return true;
}

function debuggerIfNaN(point) {
  if (isNaN(point.x) || isNaN(point.y)) {
    debugger;
  }
}
},{"./v2":"../src/v2.ts","./segment-intersection":"../src/segment-intersection.ts"}],"../src/common-types.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
},{}],"../src/project-point-edge.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPointEdgeProjectionResult = createPointEdgeProjectionResult;
exports.projectPointEdge = projectPointEdge;

var _v = require("./v2");

/**
 * Create a pre-made result object for tests.
 */
function createPointEdgeProjectionResult() {
  return {
    distance: 0,
    similarity: 0,
    u: 0,
    projectedPoint: (0, _v.v2)(),
    edgeNormal: (0, _v.v2)()
  };
}

var edgeDelta = (0, _v.v2)();
var perp = (0, _v.v2)();

function projectPointEdge(point, endpoint1, endpoint2, result) {
  (0, _v.sub)(edgeDelta, endpoint2, endpoint1);

  if (edgeDelta.x === 0 && edgeDelta.y === 0) {
    throw new Error('ZeroLengthEdge');
  } // http://paulbourke.net/geometry/pointlineplane/
  // http://paulbourke.net/geometry/pointlineplane/DistancePoint.java


  var u = ((point.x - endpoint1.x) * edgeDelta.x + (point.y - endpoint1.y) * edgeDelta.y) / (edgeDelta.x * edgeDelta.x + edgeDelta.y * edgeDelta.y);
  result.u = u;
  var proj = (0, _v.set)(result.projectedPoint, endpoint1.x + u * edgeDelta.x, endpoint1.y + u * edgeDelta.y);
  result.distance = (0, _v.distance)(proj, point); // given:
  // E1----------------------E2        Proj
  //           |                        |
  //           | EdgeNorm               | perp
  //           |                       Point
  // 
  // What is the similarity (dot product) between EdgeNorm and Perp?

  var edgeNorm = (0, _v.normal)(result.edgeNormal, endpoint1, endpoint2);
  (0, _v.sub)(perp, point, proj);
  result.similarity = (0, _v.dot)(edgeNorm, perp);
}
},{"./v2":"../src/v2.ts"}],"../src/project-capsule.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.projectCposWithRadius = void 0;

var _v = require("./v2");

// preallocations
var v = (0, _v.v2)();
var direction = (0, _v.v2)();
var radiusSegment = (0, _v.v2)();
/**
 * Compute the leading edge of a circular moving object given a radius: cpos + radius in the direction of velocity.
 */

var projectCposWithRadius = function projectCposWithRadius(out, p, radius) {
  (0, _v.sub)(v, p.cpos, p.ppos);
  (0, _v.normalize)(direction, v);
  (0, _v.scale)(radiusSegment, direction, radius);
  (0, _v.add)(out, radiusSegment, p.cpos);
  return out;
};

exports.projectCposWithRadius = projectCposWithRadius;
},{"./v2":"../src/v2.ts"}],"../src/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _accelerate = require("./accelerate");

Object.keys(_accelerate).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _accelerate[key];
    }
  });
});

var _collideCircleCircle = require("./collide-circle-circle");

Object.keys(_collideCircleCircle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _collideCircleCircle[key];
    }
  });
});

var _collideCircleEdge = require("./collide-circle-edge");

Object.keys(_collideCircleEdge).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _collideCircleEdge[key];
    }
  });
});

var _collisionResponseAabb = require("./collision-response-aabb");

Object.keys(_collisionResponseAabb).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _collisionResponseAabb[key];
    }
  });
});

var _solveDistanceConstraint = require("./solve-distance-constraint");

Object.keys(_solveDistanceConstraint).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _solveDistanceConstraint[key];
    }
  });
});

var _solveDrag = require("./solve-drag");

Object.keys(_solveDrag).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _solveDrag[key];
    }
  });
});

var _solveGravitation = require("./solve-gravitation");

Object.keys(_solveGravitation).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _solveGravitation[key];
    }
  });
});

var _inertia = require("./inertia");

Object.keys(_inertia).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _inertia[key];
    }
  });
});

var _overlapAabbAabb = require("./overlap-aabb-aabb");

Object.keys(_overlapAabbAabb).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _overlapAabbAabb[key];
    }
  });
});

var _overlapCircleCircle = require("./overlap-circle-circle");

Object.keys(_overlapCircleCircle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _overlapCircleCircle[key];
    }
  });
});

var _rewindToCollisionPoint = require("./rewind-to-collision-point");

Object.keys(_rewindToCollisionPoint).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _rewindToCollisionPoint[key];
    }
  });
});

var _segmentIntersection = require("./segment-intersection");

Object.keys(_segmentIntersection).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _segmentIntersection[key];
    }
  });
});

var _v = require("./v2");

Object.keys(_v).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _v[key];
    }
  });
});

var _commonTypes = require("./common-types");

Object.keys(_commonTypes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _commonTypes[key];
    }
  });
});

var _projectPointEdge = require("./project-point-edge");

Object.keys(_projectPointEdge).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _projectPointEdge[key];
    }
  });
});

var _projectCapsule = require("./project-capsule");

Object.keys(_projectCapsule).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _projectCapsule[key];
    }
  });
});
},{"./accelerate":"../src/accelerate.ts","./collide-circle-circle":"../src/collide-circle-circle.ts","./collide-circle-edge":"../src/collide-circle-edge.ts","./collision-response-aabb":"../src/collision-response-aabb.ts","./solve-distance-constraint":"../src/solve-distance-constraint.ts","./solve-drag":"../src/solve-drag.ts","./solve-gravitation":"../src/solve-gravitation.ts","./inertia":"../src/inertia.ts","./overlap-aabb-aabb":"../src/overlap-aabb-aabb.ts","./overlap-circle-circle":"../src/overlap-circle-circle.ts","./rewind-to-collision-point":"../src/rewind-to-collision-point.ts","./segment-intersection":"../src/segment-intersection.ts","./v2":"../src/v2.ts","./common-types":"../src/common-types.ts","./project-point-edge":"../src/project-point-edge.ts","./project-capsule":"../src/project-capsule.ts"}],"aabb-overlap.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = void 0;

var science_halt_1 = __importDefault(require("science-halt"));

var src_1 = require("../src");

exports.start = function () {
  var cvs = document.createElement("canvas");
  var ctx = cvs.getContext("2d");
  cvs.width = cvs.height = 800;
  cvs.style.border = "1px solid gray";
  document.body.appendChild(cvs);
  var box1 = {
    cpos: src_1.v2(350, 90),
    ppos: src_1.v2(349, 80),
    acel: src_1.v2(),
    w: 100,
    h: 150,
    mass: 10
  };
  var box2 = {
    cpos: src_1.v2(350, 600),
    ppos: src_1.v2(350, 600),
    acel: src_1.v2(),
    w: 100,
    h: 150,
    mass: 10
  };
  var points = [];
  var collision = {
    resolve: src_1.v2(),
    hitPos: src_1.v2(),
    normal: src_1.v2()
  };
  points.push(box1, box2);
  var running = true;
  science_halt_1.default(function () {
    return running = false;
  });

  (function step() {
    var dt = 1;

    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      src_1.accelerate(point, dt);
    }

    var isOverlapping = src_1.overlapAABBAABB(box1.cpos.x, box1.cpos.y, box1.w, box1.h, box2.cpos.x, box2.cpos.y, box2.w, box2.h, collision);

    if (isOverlapping) {
      // for debugging
      render(points, ctx); // move to non-overlapping position

      var overlapHalf = src_1.scale(src_1.v2(), collision.resolve, 0.5);
      src_1.add(box2.cpos, box2.cpos, overlapHalf);
      src_1.add(box2.ppos, box2.ppos, overlapHalf);
      src_1.sub(box1.cpos, box1.cpos, overlapHalf);
      src_1.sub(box1.ppos, box1.ppos, overlapHalf); // for debugging

      render(points, ctx);
      var box1v = src_1.v2();
      var box2v = src_1.v2();
      var restitution = 1;
      var staticFriction = 0.9;
      var dynamicFriction = 0.01;
      src_1.collisionResponseAABB(box1.cpos, box1.ppos, box1.mass, restitution, staticFriction, dynamicFriction, box2.cpos, box2.ppos, box2.mass, restitution, staticFriction, dynamicFriction, // Allow the response function to recompute a normal based on the
      // axis between the centers of the boxes. this produces a more
      // natural looking collision.
      // collision.normal,
      src_1.v2(), box1v, box2v); // Apply the new velocity

      src_1.sub(box1.ppos, box1.cpos, box1v);
      src_1.sub(box2.ppos, box2.cpos, box2v); // for debugging

      render(points, ctx);
    }

    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      src_1.inertia(point);
    }

    render(points, ctx);
    if (!running) return;
    window.requestAnimationFrame(step);
  })();

  function render(points, ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      ctx.fillStyle = "red";
      ctx.fillRect(point.ppos.x - point.w / 2, point.ppos.y - point.h / 2, point.w, point.h);
      ctx.fillStyle = "black";
      ctx.fillRect(point.cpos.x - point.w / 2, point.cpos.y - point.h / 2, point.w, point.h);
    }
  }
};
},{"science-halt":"../node_modules/science-halt/index.js","../src":"../src/index.ts"}],"aabb-soup.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = void 0;

var science_halt_1 = __importDefault(require("science-halt"));

var index_1 = require("../src/index");

exports.start = function () {
  var cvs = document.createElement("canvas");
  var ctx = cvs.getContext("2d");
  cvs.width = cvs.height = 800;
  cvs.style.border = "1px solid gray";
  document.body.appendChild(cvs);
  var points = [];

  for (var count = 25, i = 0; i < count; i++) {
    var centerX = cvs.width / 2;
    var centerY = cvs.height / 2;
    var distance_1 = Math.min(centerX, centerY) * 0.5;
    var cos = Math.cos(i);
    var sin = Math.sin(i);
    var x = centerX + cos * distance_1;
    var y = centerY + sin * distance_1;
    points.push(makeBox(x, y));
  }

  var GRAVITATIONAL_POINT = {
    cpos: index_1.v2(cvs.width / 2, cvs.height / 2),
    ppos: index_1.v2(cvs.width / 2, cvs.height / 2),
    acel: index_1.v2(),
    mass: 100000
  };
  var running = true;
  science_halt_1.default(function () {
    return running = false;
  });

  (function step() {
    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      var dist = index_1.distance(point.cpos, GRAVITATIONAL_POINT.cpos);
      dist > 100 && index_1.solveGravitation(point, point.mass, GRAVITATIONAL_POINT, GRAVITATIONAL_POINT.mass);
    }

    var dt = 1;

    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      index_1.accelerate(point, dt);
    }

    var collisions = [];
    var handled = [];
    var collision = {
      resolve: index_1.v2(),
      hitPos: index_1.v2(),
      normal: index_1.v2()
    };

    for (var i = 0; i < points.length; i++) {
      for (var j = i + 1; j < points.length; j++) {
        var box1 = points[i];
        var box2 = points[j];
        var isOverlapping = index_1.overlapAABBAABB(box1.cpos.x, box1.cpos.y, box1.w, box1.h, box2.cpos.x, box2.cpos.y, box2.w, box2.h, collision);

        if (isOverlapping && handled.indexOf(box1.id + "," + box2.id) === -1 && handled.indexOf(box2.id + "," + box1.id) === -1) {
          // move to non-overlapping position
          var overlapHalf = index_1.scale(index_1.v2(), collision.resolve, 0.5);
          index_1.add(box2.cpos, box2.cpos, overlapHalf);
          index_1.add(box2.ppos, box2.ppos, overlapHalf);
          index_1.sub(box1.cpos, box1.cpos, overlapHalf);
          index_1.sub(box1.ppos, box1.ppos, overlapHalf); // for debugging

          render(points, ctx);
          var box1v = index_1.v2();
          var box2v = index_1.v2();
          var restitution = 1;
          var staticFriction = 0.9;
          var dynamicFriction = 0.01;
          index_1.collisionResponseAABB(box1.cpos, box1.ppos, box1.mass, restitution, staticFriction, dynamicFriction, box2.cpos, box2.ppos, box2.mass, restitution, staticFriction, dynamicFriction, // Allow the response function to recompute a normal based on the
          // axis between the centers of the boxes. this produces a more
          // natural looking collision.
          // collision.normal,
          index_1.v2(), box1v, box2v); // Apply the new velocity

          index_1.sub(box1.ppos, box1.cpos, box1v);
          index_1.sub(box2.ppos, box2.cpos, box2v); // for debugging

          render(points, ctx);
          handled.push(box1.id + "," + box2.id);
          handled.push(box2.id + "," + box1.id);
        }
      }
    }

    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      index_1.inertia(point);
    }

    render(points, ctx);
    if (!running) return;
    window.requestAnimationFrame(step);
  })();

  function makeBox(x, y) {
    return {
      id: "id-" + Math.floor(Math.random() * 10000000),
      cpos: index_1.v2(x, y),
      ppos: index_1.v2(x, y),
      acel: index_1.v2(),
      mass: 10,
      w: 10,
      h: 10
    };
  }

  function render(points, ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      ctx.fillStyle = "red";
      ctx.fillRect(point.ppos.x - point.w / 2, point.ppos.y - point.h / 2, point.w, point.h);
      ctx.fillStyle = "black";
      ctx.fillRect(point.cpos.x - point.w / 2, point.cpos.y - point.h / 2, point.w, point.h);
    }
  }
};
},{"science-halt":"../node_modules/science-halt/index.js","../src/index":"../src/index.ts"}],"circle-collisions.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = void 0;

var science_halt_1 = __importDefault(require("science-halt"));

var index_1 = require("../src/index");

exports.start = function () {
  var cvs = document.createElement("canvas");
  var ctx = cvs.getContext("2d");
  cvs.width = cvs.height = 800;
  cvs.style.border = "1px solid gray";
  document.body.appendChild(cvs); // generate a circle of circles

  var CENTER = {
    x: 400,
    y: 400
  };
  var GRAVITATIONAL_POINT = {
    cpos: index_1.copy(index_1.v2(), CENTER),
    ppos: index_1.copy(index_1.v2(), CENTER),
    acel: index_1.v2(),
    radius: 20,
    mass: 10000
  };
  var RADIUS = 15;
  var DAMPING = 0.1;
  var points = generatePoints(CENTER, RADIUS, 40);
  var colliding = [];
  points.unshift(GRAVITATIONAL_POINT);
  var running = true;
  science_halt_1.default(function () {
    return running = false;
  });
  var ticks = 0;

  (function step() {
    var force = index_1.v2();
    var dt = 16;

    for (var i = 0; i < points.length; i++) {
      var point = points[i];

      if (point !== GRAVITATIONAL_POINT && ticks < 100) {
        index_1.solveGravitation(point, point.mass, GRAVITATIONAL_POINT, GRAVITATIONAL_POINT.mass); //sub(force, GRAVITATIONAL_POINT.cpos, point.cpos);
        //normalize(force, force);
        //scale(force, force, 50);
        //add(point.acel, point.acel, force);
      }

      index_1.accelerate(point, dt);
    }

    collisionPairs(colliding, points);

    for (var i = 0; i < colliding.length; i += 2) {
      var pointA = colliding[i];
      var pointB = colliding[i + 1];
      index_1.collideCircleCircle(pointA, pointA.radius, pointA.mass, pointB, pointB.radius, pointB.mass, false, DAMPING);
    }

    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      index_1.inertia(point);
    } // TODO: the original demo code technically "detects" collisions with each
    // iteration, but when we do this, it actually becomes more unstable. 
    // collisionPairs(colliding, points);


    for (var i = 0; i < colliding.length; i += 2) {
      var pointA = colliding[i];
      var pointB = colliding[i + 1];
      index_1.collideCircleCircle(pointA, pointA.radius, pointA.mass, pointB, pointB.radius, pointB.mass, true, DAMPING);
    }

    render(points, ctx);
    ticks++;
    if (!running) return;
    window.requestAnimationFrame(step);
  })();

  function collisionPairs(pairs, points) {
    pairs.length = 0;

    for (var i = 0; i < points.length; i++) {
      var pointA = points[i];

      for (var j = i + 1; j < points.length; j++) {
        var pointB = points[j];

        if (index_1.overlapCircleCircle(pointA.cpos.x, pointA.cpos.y, pointA.radius, pointB.cpos.x, pointB.cpos.y, pointB.radius)) {
          pairs.push(pointA, pointB);
        }
      }
    }

    return pairs;
  }

  function generatePoints(center, baseRadius, num) {
    var all = [];
    var minRadius = 10;

    for (var i = 0; i < num; i++) {
      var x = Math.cos(i) * center.x + center.x;
      var y = Math.sin(i) * center.y + center.y;
      all.push({
        cpos: {
          x: x,
          y: y
        },
        ppos: {
          x: x,
          y: y
        },
        acel: {
          x: 0,
          y: 0
        },
        radius: Math.max(Math.abs(Math.cos(i) + Math.sin(i)) * baseRadius, minRadius),
        mass: Math.max(Math.abs(Math.cos(i) + Math.sin(i)) * 1, 1)
      });
    }

    return all;
  }

  function render(points, ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(point.ppos.x, point.ppos.y, point.radius, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(point.cpos.x, point.cpos.y, point.radius, 0, Math.PI * 2, false);
      ctx.fill();
    }
  }
};
},{"science-halt":"../node_modules/science-halt/index.js","../src/index":"../src/index.ts"}],"circle-box-collision.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = void 0;

var science_halt_1 = __importDefault(require("science-halt"));

var index_1 = require("../src/index");

exports.start = function () {
  var cvs = document.createElement("canvas");
  var ctx = cvs.getContext("2d");
  cvs.width = cvs.height = 800;
  cvs.style.border = "1px solid gray";
  document.body.appendChild(cvs);
  var CONSTRAINT_ITERATIONS = 2;
  var circles = [];
  var lines = [];
  var constraints = [];
  var box = makeBox(300, 200, 100, 200);
  circles.push.apply(circles, box.circles);
  lines.push.apply(lines, box.lines);
  constraints.push.apply(constraints, box.constraints);
  circles.push({
    cpos: index_1.v2(500, 390),
    ppos: index_1.v2(510, 390),
    acel: index_1.v2(0, 0),
    mass: 100,
    radius: 10
  });
  var running = true;
  science_halt_1.default(function () {
    return running = false;
  });

  (function step() {
    var dt = 16;

    for (var i = 0; i < circles.length; i++) {
      var circle = circles[i];
      index_1.accelerate(circle, dt);
    }

    for (var i = 0; i < CONSTRAINT_ITERATIONS; i++) {
      for (var j = 0; j < constraints.length; j++) {
        var constraint = constraints[j];
        index_1.solveDistanceConstraint(constraint.point1, constraint.point1.mass, constraint.point2, constraint.point2.mass, constraint.goal);
      }
    }

    collideCircles(circles, false);
    collideEdges(lines, circles, false);

    for (var i = 0; i < circles.length; i++) {
      var circle = circles[i];
      index_1.inertia(circle);
    }

    collideCircles(circles, true);
    collideEdges(lines, circles, true);
    render(circles, lines, ctx);
    if (!running) return;
    window.requestAnimationFrame(step);
  })();

  function makeBox(x, y, width, height) {
    var lines = [];
    var circles = [];
    var constraints = [];
    var points = [index_1.v2(x, y), index_1.v2(x + width, y), index_1.v2(x + width, y + height), index_1.v2(x, y + height)];

    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      var prev = circles.length === 0 ? null : circles[i - 1];
      var circle = {
        cpos: index_1.copy(index_1.v2(), point),
        ppos: index_1.copy(index_1.v2(), point),
        acel: index_1.v2(0, 0),
        mass: i === 0 ? -1 : 1,
        radius: 1
      };

      if (prev) {
        lines.push({
          point1: prev,
          point2: circle
        });
        constraints.push({
          point1: prev,
          point2: circle,
          goal: index_1.distance(point, prev.cpos)
        });
      }

      circles.push(circle);
    }

    lines.push({
      point1: circles[circles.length - 1],
      point2: circles[0]
    });
    constraints.push({
      point1: circles[circles.length - 1],
      point2: circles[0],
      goal: index_1.distance(circles[circles.length - 1].cpos, circles[0].cpos)
    });
    constraints.push({
      point1: circles[0],
      point2: circles[2],
      goal: index_1.distance(circles[0].cpos, circles[2].cpos)
    });
    return {
      lines: lines,
      circles: circles,
      constraints: constraints
    };
  }

  function collideCircles(circles, preserveInertia, damping) {
    if (damping === void 0) {
      damping = 0.9;
    }

    for (var i = 0; i < circles.length; i++) {
      var a = circles[i];

      for (var j = i + 1; j < circles.length; j++) {
        var b = circles[j];
        if (!index_1.overlapCircleCircle(a.cpos.x, a.cpos.y, a.radius, b.cpos.x, b.cpos.y, b.radius)) continue;
        index_1.collideCircleCircle(a, a.radius, a.mass, b, b.radius, b.mass, preserveInertia, damping);
      }
    }
  }

  function collideEdges(lines, circles, preserveInertia, damping) {
    if (damping === void 0) {
      damping = 0.9;
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];

      for (var j = 0; j < circles.length; j++) {
        var circle = circles[j]; // Don't collide with yourself! This would be very very bad.

        if (line.point1 == circle || line.point2 === circle) continue;
        if (!preserveInertia) index_1.rewindToCollisionPoint(circle, circle.radius, line.point1.cpos, line.point2.cpos);
        index_1.collideCircleEdge(circle, circle.radius, circle.mass, line.point1, line.point1.mass, line.point2, line.point2.mass, preserveInertia, damping);
      }
    }
  }

  function render(circles, segments, ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (var i = 0; i < circles.length; i++) {
      var point = circles[i];
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(point.ppos.x, point.ppos.y, point.radius, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(point.cpos.x, point.cpos.y, point.radius, 0, Math.PI * 2, false);
      ctx.fill();
    }

    for (var i = 0; i < segments.length; i++) {
      var segment = segments[i];
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.moveTo(segment.point1.ppos.x, segment.point1.ppos.y);
      ctx.lineTo(segment.point2.ppos.x, segment.point2.ppos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.moveTo(segment.point1.cpos.x, segment.point1.cpos.y);
      ctx.lineTo(segment.point2.cpos.x, segment.point2.cpos.y);
      ctx.stroke();
    }
  }
};
},{"science-halt":"../node_modules/science-halt/index.js","../src/index":"../src/index.ts"}],"edge-collision.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = void 0;

var science_halt_1 = __importDefault(require("science-halt"));

var src_1 = require("../src");

exports.start = function () {
  var cvs = document.createElement("canvas");
  var ctx = cvs.getContext("2d");
  cvs.tabIndex = 1; // for keyboard events

  cvs.width = cvs.height = 800;
  cvs.style.border = "1px solid gray";
  document.body.appendChild(cvs);
  var player = {
    cpos: src_1.v2(600, 0),
    ppos: src_1.v2(600, 0),
    acel: src_1.v2(0, 0),
    mass: 1,
    radius: 20
  };
  var GRAVITY = 0.8;
  var platform = {
    point1: {
      cpos: src_1.v2(100, 300),
      ppos: src_1.v2(100, 300),
      acel: src_1.v2(0, 0),
      // mass: 100000000,
      mass: -1,
      radius: 0
    },
    point2: {
      cpos: src_1.v2(700, 300),
      ppos: src_1.v2(700, 300),
      acel: src_1.v2(0, 0),
      // mass: 100000000,
      // mass: -1,
      mass: -1,
      radius: 0
    },
    goal: 500
  };
  var circles = [player, platform.point1, platform.point2];
  var tunnelPoint = src_1.v2();
  var running = true;
  science_halt_1.default(function () {
    return running = false;
  }); // const keys: { [key: string]: boolean } = {};
  // cvs.addEventListener("keydown", e => {
  //   keys[e.key] = true;
  //   e.preventDefault();
  // });
  // document.body.addEventListener("keyup", e => {
  //   keys[e.key] = false;
  //   e.preventDefault();
  // });

  (function step() {
    var dt = 16; // gravity!

    src_1.add(player.acel, player.acel, src_1.v2(0, GRAVITY));

    for (var i = 0; i < circles.length; i++) {
      var box = circles[i];
      src_1.accelerate(box, dt);
    }

    src_1.rewindToCollisionPoint(player, player.radius, platform.point1.cpos, platform.point2.cpos);
    src_1.collideCircleEdge(player, player.radius, player.mass, platform.point1, platform.point1.mass, platform.point2, platform.point2.mass, false, 0.9);

    for (var i = 0; i < circles.length; i++) {
      var box = circles[i];
      src_1.inertia(box);
    }

    src_1.collideCircleEdge(player, player.radius, player.mass, platform.point1, platform.point1.mass, platform.point2, platform.point2.mass, true, 0.9);

    for (var i = 0; i < 5; i++) {
      src_1.solveDistanceConstraint(platform.point1, platform.point1.mass, platform.point2, platform.point2.mass, platform.goal);
    }

    render(circles, [platform], ctx);
    if (!running) return;
    window.requestAnimationFrame(step);
  })();

  function render(circles, segments, ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (var i = 0; i < circles.length; i++) {
      var point = circles[i];
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(point.ppos.x, point.ppos.y, point.radius, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(point.cpos.x, point.cpos.y, point.radius, 0, Math.PI * 2, false);
      ctx.fill();
    }

    for (var i = 0; i < segments.length; i++) {
      var segment = segments[i];
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.moveTo(segment.point1.ppos.x, segment.point1.ppos.y);
      ctx.lineTo(segment.point2.ppos.x, segment.point2.ppos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.moveTo(segment.point1.cpos.x, segment.point1.cpos.y);
      ctx.lineTo(segment.point2.cpos.x, segment.point2.cpos.y);
      ctx.stroke();
    }
  }
};
},{"science-halt":"../node_modules/science-halt/index.js","../src":"../src/index.ts"}],"platformer.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = void 0;

var science_halt_1 = __importDefault(require("science-halt"));

var src_1 = require("../src");

exports.start = function () {
  var cvs = document.createElement("canvas");
  var ctx = cvs.getContext("2d");
  cvs.tabIndex = 1; // for keyboard events

  cvs.width = cvs.height = 800;
  cvs.style.border = "1px solid gray";
  document.body.appendChild(cvs);
  var player = {
    cpos: src_1.v2(400, 0),
    ppos: src_1.v2(400, 0),
    acel: src_1.v2(0, 0),
    width: 50,
    height: 75,
    mass: 1
  };
  var PLAYER_HOR_ACEL = 5;
  var GRAVITY = 9.8;
  var platform = {
    cpos: src_1.v2(400, 700),
    ppos: src_1.v2(400, 700),
    acel: src_1.v2(0, 0),
    width: 800,
    height: 100,
    mass: Number.MAX_SAFE_INTEGER - 100000
  };
  var boxes = [player, platform];
  var collision = {
    resolve: src_1.v2(),
    hitPos: src_1.v2(),
    normal: src_1.v2()
  };
  var running = true;
  science_halt_1.default(function () {
    return running = false;
  });
  var keys = {};
  cvs.addEventListener("keydown", function (e) {
    keys[e.key] = true;
    e.preventDefault();
  });
  document.body.addEventListener("keyup", function (e) {
    keys[e.key] = false;
    e.preventDefault();
  });

  (function step() {
    var dt = 16; // gravity!

    src_1.add(player.acel, player.acel, src_1.v2(0, GRAVITY));

    for (var i = 0; i < boxes.length; i++) {
      var box = boxes[i];
      src_1.accelerate(box, dt);
    }

    var isOverlapping = src_1.overlapAABBAABB(player.cpos.x, player.cpos.y, player.width, player.height, platform.cpos.x, platform.cpos.y, platform.width, platform.height, collision);

    if (isOverlapping) {
      // Move to non-overlapping positions
      var negativeResolve = src_1.scale(src_1.v2(), collision.resolve, -1); // translate(overlapHalf, platform.cpos, platform.ppos);

      src_1.translate(negativeResolve, player.cpos, player.ppos); // for debugging

      render(boxes, ctx); // We will put the new relative velocity vectors here.

      var box1v = src_1.v2();
      var box2v = src_1.v2();
      var restitution = 1;
      var staticFriction = 0.9;
      var dynamicFriction = 0.1;
      src_1.collisionResponseAABB(player.cpos, player.ppos, player.mass, restitution, staticFriction, dynamicFriction, platform.cpos, platform.ppos, platform.mass, restitution, staticFriction, dynamicFriction, collision.normal, box1v, box2v); // Apply the new velocity

      src_1.sub(player.ppos, player.cpos, box1v); // Kill vertical velocity

      player.ppos.y = player.cpos.y; // for debugging

      render(boxes, ctx);
    } // Movement in the air is less powerful than on the ground!


    if (keys.ArrowLeft) {
      src_1.add(player.acel, player.acel, src_1.v2(isOverlapping ? -PLAYER_HOR_ACEL : -PLAYER_HOR_ACEL / 10, 0));
    }

    if (keys.ArrowRight) {
      src_1.add(player.acel, player.acel, src_1.v2(isOverlapping ? PLAYER_HOR_ACEL : PLAYER_HOR_ACEL / 10, 0));
    } // we were overlapping, so probably ok to jump!


    if (isOverlapping && keys.ArrowUp && player.cpos.y - player.ppos.y === 0) {
      src_1.add(player.acel, player.acel, src_1.v2(0, -GRAVITY * 10));
    }

    for (var i = 0; i < boxes.length; i++) {
      var box = boxes[i];
      src_1.inertia(box);
    }

    render(boxes, ctx);
    if (!running) return;
    window.requestAnimationFrame(step);
  })();

  function render(boxes, ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (var i = 0; i < boxes.length; i++) {
      var box = boxes[i];
      ctx.fillStyle = "red";
      ctx.fillRect(box.ppos.x - box.width / 2, box.ppos.y - box.height / 2, box.width, box.height);
      ctx.fillStyle = "black";
      ctx.fillRect(box.cpos.x - box.width / 2, box.cpos.y - box.height / 2, box.width, box.height);
    }
  }
};
},{"science-halt":"../node_modules/science-halt/index.js","../src":"../src/index.ts"}],"bucket.ts":[function(require,module,exports) {
"use strict";

var __spreadArrays = this && this.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = void 0;

var science_halt_1 = __importDefault(require("science-halt"));

var src_1 = require("../src");

exports.start = function () {
  var width = 800;
  var cvs = document.createElement("canvas");
  var ctx = cvs.getContext("2d");
  cvs.tabIndex = 1; // for keyboard events

  cvs.width = cvs.height = width;
  cvs.style.border = "1px solid gray";
  document.body.appendChild(cvs);
  var GRAVITY = 0.8;
  var CONSTRAINT_ITERS = 5;
  var lines = [];
  var constraints = [];
  var circles = [];
  var bucket = makeStaticMesh([src_1.v2(50, 50), src_1.v2(width - 50, 50), src_1.v2(width - 50, width - 50), src_1.v2(50, width - 50)]);
  var midLine = makeStaticMesh([src_1.v2(500, width / 2), src_1.v2(width - 500, width / 2 + 200)]);
  midLine.pop(); // remove the double link back to beginning

  lines.push.apply( // remove the double link back to beginning
  lines, __spreadArrays(bucket, midLine));
  circles.push.apply(circles, makeCircles(src_1.v2(width / 2, width / 2), width / 4, 10, 400));
  var polys = [makePolygon(6, src_1.v2(300, 100), 15), makePolygon(3, src_1.v2(400, 100), 15), makePolygon(4, src_1.v2(600, 100), 15)];
  polys.forEach(function (poly) {
    circles.push.apply(circles, poly.circles);
    constraints.push.apply(constraints, poly.constraints);
    lines.push.apply(lines, poly.lines);
  });
  var running = true;
  science_halt_1.default(function () {
    return running = false;
  });

  (function step() {
    var dt = 16;

    for (var i = 0; i < circles.length; i++) {
      var circle = circles[i];

      if (circle.mass > 0) {
        src_1.add(circle.acel, circle.acel, src_1.v2(0, GRAVITY));
      }

      src_1.accelerate(circle, dt);
    }

    for (var i = 0; i < CONSTRAINT_ITERS; i++) {
      for (var j = 0; j < constraints.length; j++) {
        var constraint = constraints[j];
        src_1.solveDistanceConstraint(constraint.point1, constraint.point1.mass, constraint.point2, constraint.point2.mass, constraint.goal, 1);
      }
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var lineIsBounds = bucket.indexOf(line) > -1;

      for (var j = 0; j < circles.length; j++) {
        var circle = circles[j];
        if (circle === line.point1 || circle === line.point2) continue; // TODO: this needs to be smarter. Without this rewind, simple circles
        // will tunnel through the line. But if done indiscriminately, the rewind
        // will cause an infinite build up of velocity, and eventually explode. OR
        // it will cause a circle to "stick" to an edge until their velocity
        // dissipates.

        if (!lineIsBounds) {
          src_1.rewindToCollisionPoint(circle, circle.radius, line.point1.cpos, line.point2.cpos);
        }

        src_1.collideCircleEdge(circle, circle.radius, circle.mass, line.point1, line.point1.mass, line.point2, line.point2.mass, false, 0.9);
      }
    }

    for (var i = 0; i < circles.length; i++) {
      var a = circles[i];

      for (var j = i + 1; j < circles.length; j++) {
        var b = circles[j];
        if (!src_1.overlapCircleCircle(a.cpos.x, a.cpos.y, a.radius, b.cpos.x, b.cpos.y, b.radius)) continue;
        src_1.collideCircleCircle(a, a.radius, a.mass, b, b.radius, b.mass, false, 0.9);
      }
    }

    for (var i = 0; i < circles.length; i++) {
      var circle = circles[i];
      src_1.inertia(circle);
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];

      for (var j = 0; j < circles.length; j++) {
        var circle = circles[j];
        if (circle === line.point1 || circle === line.point2) continue;
        src_1.collideCircleEdge(circle, circle.radius, circle.mass, line.point1, line.point1.mass, line.point2, line.point2.mass, true, 0.9);
      }
    }

    for (var i = 0; i < circles.length; i++) {
      var a = circles[i];

      for (var j = i + 1; j < circles.length; j++) {
        var b = circles[j];
        if (!src_1.overlapCircleCircle(a.cpos.x, a.cpos.y, a.radius, b.cpos.x, b.cpos.y, b.radius)) continue;
        src_1.collideCircleCircle(a, a.radius, a.mass, b, b.radius, b.mass, true, 0.9);
      }
    } // Ensure nothing actually gets out of the bucket.
    // It's impossible to keep everything in the bucket without a strict
    // normal for each edge, because you need to know which "side" of the edge
    // the particle is on. Additionally, the solver steps above can easily move
    // a circle to a non-intersecting position that is beyond the "knowledge" of
    // anything checking for collisions with edges. This is especially common
    // when lots of collisions are being resolved.


    for (var i = 0; i < bucket.length; i++) {
      var line = bucket[i]; // HACK: Don't use the midline collection for bounds checking.
      // The right way to do this is to create systems.

      if (line === midLine[0]) continue;

      for (var j = 0; j < circles.length; j++) {
        var circle = circles[j];
        var projection = src_1.createPointEdgeProjectionResult(); // We know which way the edges were wound, so we implicitly know which order
        // these points should be used in to compute the normal.

        src_1.projectPointEdge(circle.cpos, line.point1.cpos, line.point2.cpos, projection); // both the edge normal and the segment from edge to circle are
        // facing a similar direction
        // We only know it is > 0 because of the order line.point,point2 were inputted
        // into the projection.

        if (projection.similarity > 0) continue; // If we get here, the directions so dissimilar that the circle must
        // be on the other side of the edge! Move it back!

        var offset = src_1.v2();
        src_1.sub(offset, projection.projectedPoint, circle.cpos);
        src_1.add(circle.cpos, circle.cpos, offset); // Don't correct ppos, otherwise velocity will continue to increase
        // forever.
        // add(circle.ppos, circle.ppos, offset);
      }
    }

    render(circles, lines, constraints, ctx);
    if (!running) return;
    window.requestAnimationFrame(step);
  })();

  function makeStaticMesh(points) {
    var clines = [];
    var circles = [];

    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      var prev = circles.length === 0 ? null : circles[i - 1];
      var circle = {
        cpos: src_1.copy(src_1.v2(), point),
        ppos: src_1.copy(src_1.v2(), point),
        acel: src_1.v2(0, 0),
        mass: -1,
        radius: 1
      };

      if (prev) {
        var line = {
          point1: prev,
          point2: circle
        };
        clines.push(line);
      }

      circles.push(circle);
    }

    clines.push({
      point1: circles[circles.length - 1],
      point2: circles[0]
    });
    return clines;
  }

  function makeCircles(center, spawnRadius, baseRadius, num) {
    var all = [];
    var minRadius = 10;

    for (var i = 0; i < num; i++) {
      var x = center.x + Math.cos(i) * spawnRadius;
      var y = center.y + Math.sin(i) * spawnRadius;
      all.push({
        cpos: {
          x: x,
          y: y
        },
        ppos: {
          x: x,
          y: y
        },
        acel: {
          x: 0,
          y: 0
        },
        radius: Math.max(Math.abs(Math.cos(i) + Math.sin(i)) * baseRadius, minRadius),
        mass: Math.max(Math.abs(Math.cos(i) + Math.sin(i)) * 1, 1)
      });
    }

    return all;
  }

  function makePolygon(gon, center, radius) {
    var clines = [];
    var circles = [];
    var constraints = [];

    for (var i = 0; i < gon; i++) {
      var x = center.x + Math.cos(i / gon * Math.PI * 2) * radius;
      var y = center.y + Math.sin(i / gon * Math.PI * 2) * radius;
      circles.push({
        cpos: {
          x: x,
          y: y
        },
        ppos: {
          x: x,
          y: y
        },
        acel: {
          x: 0,
          y: 0
        },
        radius: 5,
        mass: 5
      });
    }

    for (var i = 0; i < circles.length; i++) {
      var point1 = circles[i];
      var point2 = i === circles.length - 1 ? circles[0] : circles[i + 1];
      clines.push({
        point1: point1,
        point2: point2
      });
    }

    var _loop_1 = function _loop_1(i) {
      var point1 = circles[i];
      var j = i;

      var _loop_2 = function _loop_2() {
        j++;
        var point2 = circles[j % circles.length];
        if (point2 === point1) return "break";
        if (constraints.find(function (c) {
          return c.point1 === point1 && c.point2 === point2 || c.point2 === point1 && c.point1 === point2;
        }) !== undefined) return "break";
        constraints.push({
          point1: point1,
          point2: point2,
          goal: src_1.distance(point1.cpos, point2.cpos)
        });
      };

      while (true) {
        var state_1 = _loop_2();

        if (state_1 === "break") break;
      }
    };

    for (var i = 0; i < circles.length; i++) {
      _loop_1(i);
    }

    return {
      circles: circles,
      lines: clines,
      constraints: constraints
    };
  }

  function render(circles, segments, constraints, ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (var i = 0; i < circles.length; i++) {
      var point = circles[i];
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(point.ppos.x, point.ppos.y, point.radius, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(point.cpos.x, point.cpos.y, point.radius, 0, Math.PI * 2, false);
      ctx.fill();
    }

    for (var i = 0; i < segments.length; i++) {
      var segment = segments[i];
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.moveTo(segment.point1.ppos.x, segment.point1.ppos.y);
      ctx.lineTo(segment.point2.ppos.x, segment.point2.ppos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.moveTo(segment.point1.cpos.x, segment.point1.cpos.y);
      ctx.lineTo(segment.point2.cpos.x, segment.point2.cpos.y);
      ctx.stroke();
    }

    for (var i = 0; i < constraints.length; i++) {
      var c = constraints[i];
      ctx.strokeStyle = "magenta";
      ctx.beginPath();
      ctx.moveTo(c.point1.ppos.x, c.point1.ppos.y);
      ctx.lineTo(c.point2.ppos.x, c.point2.ppos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = "purple";
      ctx.moveTo(c.point1.cpos.x, c.point1.cpos.y);
      ctx.lineTo(c.point2.cpos.x, c.point2.cpos.y);
      ctx.stroke();
    }
  }
};
},{"science-halt":"../node_modules/science-halt/index.js","../src":"../src/index.ts"}],"edge-collision-aabb.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = void 0;

var science_halt_1 = __importDefault(require("science-halt"));

var src_1 = require("../src");

exports.start = function () {
  var cvs = document.createElement("canvas");
  var ctx = cvs.getContext("2d");
  cvs.tabIndex = 1; // for keyboard events

  cvs.width = cvs.height = 800;
  cvs.style.border = "1px solid gray";
  document.body.appendChild(cvs);
  var player = {
    cpos: src_1.v2(600, 100),
    ppos: src_1.v2(600, 100),
    acel: src_1.v2(0, 0),
    mass: 1,
    radius: 20
  };
  var GRAVITY = 0.98; // Use similar masses because even if the platform is immobile, a huge mass
  // will impart nearly all velocity into the ball, and make restitution and
  // friction nearly meaningless.

  var platform = {
    point1: {
      cpos: src_1.v2(100, 300),
      ppos: src_1.v2(100, 300),
      acel: src_1.v2(0, 0),
      mass: 1,
      radius: 0
    },
    point2: {
      cpos: src_1.v2(700, 300),
      ppos: src_1.v2(700, 300),
      acel: src_1.v2(0, 0),
      mass: 1,
      radius: 0
    },
    goal: 500
  };
  var circles = [player, platform.point1, platform.point2];
  var running = true;
  science_halt_1.default(function () {
    return running = false;
  });

  (function step() {
    var dt = 16; // gravity!

    src_1.add(player.acel, player.acel, src_1.v2(0, GRAVITY));

    for (var i = 0; i < circles.length; i++) {
      var box = circles[i];
      src_1.accelerate(box, dt);
    } // Use the ppos to account for tunneling: if the ppos->cpos vector is
    // intersecting with the edge, and ppos is still >0, that means the circle
    // has collided or even tunneled.


    var projectedResult = src_1.createPointEdgeProjectionResult();
    src_1.projectPointEdge(player.ppos, platform.point1.cpos, platform.point2.cpos, projectedResult); // Project the cpos using the radius just for the sake of doing a
    // line-intersection. Technically we don't have to do this line segment
    // intersetion test because rewindToCollisionPoint will do it internally,
    // but it's useful to know if it _will_ rewind or not, and sadly the rewind
    // function mutates. This can be a problem in environments with more than
    // one collision happening per frame.

    var intersectionPoint = src_1.v2();
    var cposCapsule = src_1.projectCposWithRadius(src_1.v2(), player, player.radius);
    var intersected = src_1.segmentIntersection(player.ppos, cposCapsule, platform.point1.cpos, platform.point2.cpos, intersectionPoint);

    if (intersected && projectedResult.similarity < 0) {
      // Do our best to prevent tunneling: rewind by the distance from the cpos
      // capsule to the segment intersection point. `Translate` adds, so we have
      // to sub intersectionPoint - capsule, which is slightly counterintuitive.
      var offset = src_1.v2();
      src_1.sub(offset, intersectionPoint, cposCapsule);
      src_1.translate(offset, player.cpos, player.ppos);
      var vout1 = src_1.v2();
      var vout2 = src_1.v2(); // 1: nearly perfectly elastic (we still lose some energy due to gravity)
      // 0: dead

      var restitution = 1;
      src_1.collisionResponseAABB(player.cpos, player.ppos, player.mass, restitution, 0.9, 0.1, projectedResult.projectedPoint, projectedResult.projectedPoint, (platform.point1.mass + platform.point2.mass) * projectedResult.u, restitution, 0.9, 0.1, projectedResult.edgeNormal, vout1, vout2);
      src_1.sub(player.ppos, player.cpos, vout1); // preserve systemic energy by giving the velocity that would have been
      // imparted to the edge (if it were moveable) to the ball instead.

      src_1.add(player.ppos, player.ppos, vout2);
    }

    for (var i = 0; i < circles.length; i++) {
      var box = circles[i];
      src_1.inertia(box);
    }

    for (var i = 0; i < 5; i++) {
      // Not really necessary since we're never imparting velocity to the
      // platform, but could be useful to demonstrate how to keep the shape if
      // we did.
      src_1.solveDistanceConstraint(platform.point1, platform.point1.mass, platform.point2, platform.point2.mass, platform.goal);
    }

    render(circles, [platform], ctx);
    if (!running) return;
    window.requestAnimationFrame(step);
  })();

  function render(circles, segments, ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (var i = 0; i < circles.length; i++) {
      var point = circles[i];
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(point.ppos.x, point.ppos.y, point.radius, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(point.cpos.x, point.cpos.y, point.radius, 0, Math.PI * 2, false);
      ctx.fill();
    }

    for (var i = 0; i < segments.length; i++) {
      var segment = segments[i];
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.moveTo(segment.point1.ppos.x, segment.point1.ppos.y);
      ctx.lineTo(segment.point2.ppos.x, segment.point2.ppos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.moveTo(segment.point1.cpos.x, segment.point1.cpos.y);
      ctx.lineTo(segment.point2.cpos.x, segment.point2.cpos.y);
      ctx.stroke();
    }
  }
};
},{"science-halt":"../node_modules/science-halt/index.js","../src":"../src/index.ts"}],"index.ts":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  }

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var AABBOverlapDemo = __importStar(require("./aabb-overlap"));

var AABBSoupDemo = __importStar(require("./aabb-soup"));

var CircleCollisions = __importStar(require("./circle-collisions"));

var CircleBoxCollision = __importStar(require("./circle-box-collision"));

var EdgeCollision = __importStar(require("./edge-collision"));

var Platformer = __importStar(require("./platformer"));

var Bucket = __importStar(require("./bucket"));

var EdgeCollisionAABB = __importStar(require("./edge-collision-aabb"));

var qs = new URLSearchParams(window.location.search);
var demoName = qs.get("demo");
var demos = new Map([["Bucket of Circles (Verlet)", Bucket], ["Circle Collisions (Verlet)", CircleCollisions], ["Circle to Box Collision (Verlet)", CircleBoxCollision], ["Single Edge Collision (Verlet)", EdgeCollision], ["Platformer (AABB Impulse Model)", Platformer], ["AABB Overlap Demo (AABB Impulse Model)", AABBOverlapDemo], ["AABB Soup Demo (AABB Impulse Model)", AABBSoupDemo], ["Single Edge Collision (AABB Impulse Model)", EdgeCollisionAABB]]);

if (demoName && demos.has(demoName)) {
  demos.get(demoName).start();
} else {
  var names = Array.from(demos.keys());

  var li_1 = function li_1(name) {
    var cmp = encodeURIComponent(name);
    var url = window.location.pathname + "?demo=" + cmp;
    return "\n      <li><a href=\"" + url + "\">" + name + "</a></li>\n    ";
  };

  var html = "\n    <ul>\n      " + names.map(function (name) {
    return li_1(name);
  }).join("\n") + "\n    </ul>\n  ";
  var el = document.createElement("div");
  el.innerHTML = html;
  document.body.appendChild(el);
}
},{"./aabb-overlap":"aabb-overlap.ts","./aabb-soup":"aabb-soup.ts","./circle-collisions":"circle-collisions.ts","./circle-box-collision":"circle-box-collision.ts","./edge-collision":"edge-collision.ts","./platformer":"platformer.ts","./bucket":"bucket.ts","./edge-collision-aabb":"edge-collision-aabb.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62508" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/examples.77de5100.js.map