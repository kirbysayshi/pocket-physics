(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _scienceHalt = require('science-halt');

var _scienceHalt2 = _interopRequireDefault(_scienceHalt);

var _v = require('../src/v2');

var _accelerate2d = require('../src/accelerate2d');

var _accelerate2d2 = _interopRequireDefault(_accelerate2d);

var _inertia2d = require('../src/inertia2d');

var _inertia2d2 = _interopRequireDefault(_inertia2d);

var _gravitation2d = require('../src/gravitation2d');

var _gravitation2d2 = _interopRequireDefault(_gravitation2d);

var _overlapaabbaabb = require('../src/overlapaabbaabb2');

var _overlapaabbaabb2 = _interopRequireDefault(_overlapaabbaabb);

var _collisionResponseAabb = require('../src/collision-response-aabb');

var _collisionResponseAabb2 = _interopRequireDefault(_collisionResponseAabb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cvs = document.createElement('canvas');
var ctx = cvs.getContext('2d');
cvs.width = cvs.height = 800;
cvs.style.border = '1px solid gray';
document.body.appendChild(cvs);

var box1 = {
  cpos: (0, _v.v2)(350, 90),
  ppos: (0, _v.v2)(349, 80),
  acel: (0, _v.v2)(),
  w: 100,
  h: 150,
  mass: 10
};

var box2 = {
  cpos: (0, _v.v2)(350, 600),
  ppos: (0, _v.v2)(350, 600),
  acel: (0, _v.v2)(),
  w: 100,
  h: 150,
  mass: 10
};

var points = [];
var collision = {};

points.push(box1, box2);

var running = true;
(0, _scienceHalt2.default)(function () {
  return running = false;
});

(function step() {
  var dt = 1;
  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    (0, _accelerate2d2.default)(point, dt);
  }

  var isOverlapping = (0, _overlapaabbaabb2.default)(box1.cpos.x, box1.cpos.y, box1.w, box1.h, box2.cpos.x, box2.cpos.y, box2.w, box2.h, collision);

  if (isOverlapping) {

    // for debugging
    render(points, ctx);

    // move to non-overlapping position
    var overlapHalf = (0, _v.scale)((0, _v.v2)(), collision.resolve, 0.5);
    (0, _v.add)(box2.cpos, box2.cpos, overlapHalf);
    (0, _v.add)(box2.ppos, box2.ppos, overlapHalf);
    (0, _v.sub)(box1.cpos, box1.cpos, overlapHalf);
    (0, _v.sub)(box1.ppos, box1.ppos, overlapHalf);

    // for debugging
    render(points, ctx);

    var box1v = (0, _v.v2)();
    var box2v = (0, _v.v2)();

    var restitution = 0;
    var staticFriction = 0;
    var dynamicFriction = 0;

    (0, _collisionResponseAabb2.default)(box1.cpos, box1.ppos, box1.mass, restitution, staticFriction, dynamicFriction, box2.cpos, box2.ppos, box2.mass, restitution, staticFriction, dynamicFriction, box1v, box2v);

    // Apply the new velocity
    (0, _v.sub)(box1.ppos, box1.cpos, box1v);
    (0, _v.sub)(box2.ppos, box2.cpos, box2v);

    // for debugging
    render(points, ctx);
  }

  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    (0, _inertia2d2.default)(point, dt);
  }

  render(points, ctx);
  if (!running) return;
  window.requestAnimationFrame(step);
})();

function render(points, ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (var i = 0; i < points.length; i++) {
    var point = points[i];

    ctx.fillStyle = 'red';
    ctx.fillRect(point.ppos.x - point.w / 2, point.ppos.y - point.h / 2, point.w, point.h);

    ctx.fillStyle = 'black';
    ctx.fillRect(point.cpos.x - point.w / 2, point.cpos.y - point.h / 2, point.w, point.h);
  }
}

},{"../src/accelerate2d":6,"../src/collision-response-aabb":7,"../src/gravitation2d":8,"../src/inertia2d":9,"../src/overlapaabbaabb2":10,"../src/v2":11,"science-halt":5}],2:[function(require,module,exports){

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

},{"./debug":3}],3:[function(require,module,exports){

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

},{"ms":4}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){

module.exports = function(onhalt, opt_msg, opt_keycode) {
  document.addEventListener('keydown', function(e) {
    if (e.which == (opt_keycode || 27)) {
      onhalt();
      console.log(opt_msg || 'HALT IN THE NAME OF SCIENCE!');
    }
  })
}
},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _v = require('./v2');

exports.default = function (cmp, dt) {
  // apply acceleration to current position, convert dt to seconds
  cmp.cpos.x += cmp.acel.x * dt * dt * 0.001;
  cmp.cpos.y += cmp.acel.y * dt * dt * 0.001;

  // reset acceleration
  (0, _v.set)(cmp.acel, 0, 0);
};

},{"./v2":11}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _v = require('./v2');

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
var u2 = (0, _v.v2)();

// TODO: Put this somewhere...
var EPSILON = 0.0001;

// TODO: change this API to accept numbers (x, y) instead of vectors

// friction calc: sqrt(friction1*friction2)
// restitution: box2d: https://github.com/erincatto/Box2D/blob/6a69ddbbd59b21c0d6699c43143b4114f7f92e21/Box2D/Box2D/Dynamics/Contacts/b2Contact.h#L42-L47
// Math.max(restitution1, restitution2);

exports.default = function (cpos1, ppos1, mass1, restitution1, staticFriction1, dynamicFriction1, cpos2, ppos2, mass2, restitution2, staticFriction2, dynamicFriction2,
//collisionNormal, // TODO: use this instead of assuming based on cpos1&2
vel1out, vel2out) {

  // blank out all preallocated vectors.
  basis.x = basisNeg.x = vel1.x = vel1x.x = vel1y.x = vel2.x = vel2x.x = vel2y.x = newVel1.x = newVel2.x = t1.x = t2.x = u1.x = u2.x = basis.y = basisNeg.y = vel1.y = vel1x.y = vel1y.y = vel2.y = vel2x.y = vel2y.y = newVel1.y = newVel2.y = t1.y = t2.y = u1.y = u2.y = 0;

  //debugger;

  // use midpoint between current positions as axis of collision
  // basis == normal
  (0, _v.sub)(basis, cpos1, cpos2);
  (0, _v.normalize)(basis, basis);
  (0, _v.scale)(basisNeg, basis, -1);

  //const friction;
  // Take max of restitutions, like box2d does.
  // https://github.com/erincatto/Box2D/blob/6a69ddbbd59b21c0d6699c43143b4114f7f92e21/Box2D/Box2D/Dynamics/Contacts/b2Contact.h#L42-L47
  // "for example, a superball bounces on everything"
  var restitution = restitution1 > restitution2 ? restitution1 : restitution2;
  var massTotal = mass1 + mass2;
  var e = 1 + restitution;

  // I = (1+e)*N*(Vr • N) / (1/Ma + 1/Mb)
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
  (0, _v.sub)(vel1y, vel1, vel1x);

  // calculate x-direction velocity vector and perpendicular y-vector for box 2
  (0, _v.sub)(vel2, cpos2, ppos2);
  var x2 = (0, _v.dot)(basisNeg, vel2);
  (0, _v.scale)(vel2x, basisNeg, x2);
  (0, _v.sub)(vel2y, vel2, vel2x);

  // equations of motion for box1
  (0, _v.scale)(t1, vel1x, (mass1 - mass2) / massTotal);
  (0, _v.scale)(t2, vel2x, e * mass2 / massTotal);
  (0, _v.add)(newVel1, t1, t2);
  (0, _v.add)(newVel1, newVel1, vel1y);

  // equations of motion for box2
  (0, _v.scale)(u1, vel1x, e * mass1 / massTotal);
  (0, _v.scale)(u2, vel2x, (mass2 - mass1) / massTotal);
  (0, _v.add)(newVel2, u1, u2);
  (0, _v.add)(newVel2, newVel2, vel2y);

  // new relative velocity
  var rv = (0, _v.add)((0, _v.v2)(), newVel1, newVel2);

  // tangent to relative velocity vector
  var reg1 = (0, _v.v2)();
  (0, _v.scale)(reg1, basis, (0, _v.dot)(rv, basis));
  var tangent = (0, _v.sub)((0, _v.v2)(), rv, reg1);
  (0, _v.normalize)(tangent, tangent);

  // magnitude of relative velocity in tangent direction
  var jt = -(0, _v.dot)(rv, tangent);
  jt /= 1 / (mass1 + mass2); // not sure about this...
  // https://github.com/RandyGaul/ImpulseEngine/blob/d12af9c95555244a37dce1c7a73e60d5177df652/Manifold.cpp#L103

  var jtMag = Math.abs(jt);

  // only apply significant friction
  if (jtMag > EPSILON) {

    // magnitudes of velocity along the collision tangent, hopefully.
    var vel1ymag = (0, _v.magnitude)(vel1y);
    var vel2ymag = (0, _v.magnitude)(vel2y);

    // compute Coulumb's law (choosing dynamic vs static friction)
    var frictionImpulse1 = (0, _v.v2)();
    var frictionImpulse2 = (0, _v.v2)();

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
  }

  // output new velocity of box1 and box2
  (0, _v.copy)(vel1out, newVel1);
  (0, _v.copy)(vel2out, newVel2);
};

},{"./v2":11}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = solve;

var _v = require('./v2');

var accel1 = (0, _v.v2)();

function solve(p1, p1mass, p2, p2mass) {
  var gravityConstant = arguments.length <= 4 || arguments[4] === undefined ? 0.99 : arguments[4];

  // handle either obj not having mass
  if (!p1mass || !p2mass) return;

  var mag = undefined;
  var factor = undefined;

  var diffx = p2.cpos.x - p1.cpos.x;
  var diffy = p2.cpos.y - p1.cpos.y;

  (0, _v.set)(accel1, diffx, diffy);
  mag = (0, _v.magnitude)(accel1);

  // Newton's Law of Universal Gravitation -- Vector Form!
  factor = gravityConstant * (p1mass * p2mass / (mag * mag));

  // scale by gravity acceleration
  (0, _v.normalize)(accel1, accel1);
  (0, _v.scale)(accel1, accel1, factor);

  // add the acceleration from gravity to p1 accel
  (0, _v.add)(p1.acel, p1.acel, accel1);
};

},{"./v2":11}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _v = require('./v2');

exports.default = function (cmp) {
  var x = cmp.cpos.x * 2 - cmp.ppos.x,
      y = cmp.cpos.y * 2 - cmp.ppos.y;

  (0, _v.set)(cmp.ppos, cmp.cpos.x, cmp.cpos.y);
  (0, _v.set)(cmp.cpos, x, y);
};

},{"./v2":11}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _v = require('./v2');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dbg = (0, _debug2.default)('pocket-physics:overlapaabaabb2');

// https://github.com/noonat/intersect/blob/master/intersect.js

exports.default = function (center1X, center1Y, width1, height1, center2X, center2Y, width2, height2, result) {

  var dx = center2X - center1X;
  var px = width2 / 2 + width1 / 2 - Math.abs(dx);
  var dy = center2Y - center1Y;
  var py = height2 / 2 + height1 / 2 - Math.abs(dy);

  if (px <= 0) return null;
  if (py <= 0) return null;

  if (!result.resolve) result.resolve = (0, _v.v2)();
  if (!result.hitPos) result.hitPos = (0, _v.v2)();
  if (!result.normal) result.normal = (0, _v.v2)();

  if (px < py) {
    var sx = dx < 0 ? -1 : 1;
    result.resolve.x = px * sx;
    result.normal.x = sx;
    // Really not sure about these values.
    result.hitPos.x = center1X + width1 / 2 * sx;
    result.hitPos.y = center2Y;
  } else {
    var sy = dy < 0 ? -1 : 1;
    result.resolve.y = py * sy;
    result.normal.y = sy;
    // Really not sure about these values.
    result.hitPos.x = center2X;
    result.hitPos.y = center1Y + height1 / 2 * sy;
  }

  return result;
};

},{"./v2":11,"debug":2}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.v2 = v2;
function v2(x, y) {
  return { x: x || 0, y: y || 0 };
}

var copy = exports.copy = function copy(out, a) {
  out.x = a.x;
  out.y = a.y;
  return out;
};

var set = exports.set = function set(out, x, y) {
  out.x = x;
  out.y = y;
  return out;
};

var add = exports.add = function add(out, a, b) {
  out.x = a.x + b.x;
  out.y = a.y + b.y;
  return out;
};

var sub = exports.sub = function sub(out, a, b) {
  out.x = a.x - b.x;
  out.y = a.y - b.y;
  return out;
};

var dot = exports.dot = function dot(a, b) {
  return a.x * b.x + a.y * b.y;
};

var scale = exports.scale = function scale(out, a, factor) {
  out.x = a.x * factor;
  out.y = a.y * factor;
  return out;
};

var distance = exports.distance = function distance(v1, v2) {
  var x = v1.x - v2.x;
  var y = v1.y - v2.y;
  return Math.sqrt(x * x + y * y);
};

var distance2 = exports.distance2 = function distance2(v1, v2) {
  var x = v1.x - v2.x;
  var y = v1.y - v2.y;
  return x * x + y * y;
};

var magnitude = exports.magnitude = function magnitude(v1) {
  var x = v1.x;
  var y = v1.y;
  return Math.sqrt(x * x + y * y);
};

var normalize = exports.normalize = function normalize(out, a) {
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

var normal = exports.normal = function normal(out, e1, e2) {
  out.y = e2.x - e1.x;
  out.x = e1.y - e2.y;
  return normalize(out, out);
};

// the perpendicular dot product, also known as "cross" elsewhere
// http://stackoverflow.com/a/243977/169491
var perpDot = exports.perpDot = function perpDot(v1, v2) {
  return v1.x * v2.y - v1.y * v2.x;
};

},{}]},{},[1]);
