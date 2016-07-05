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

},{"./v2":11}],2:[function(require,module,exports){
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

},{"./v2":11,"debug":6}],3:[function(require,module,exports){
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  mass: 100000
};
var RADIUS = 15;
var DAMPING = 0.1;
var points = generatePoints(CENTER, RADIUS, 40);
var colliding = [];

points.unshift(GRAVITATIONAL_POINT);

var running = true;
(0, _scienceHalt2.default)(function () {
  return running = false;
});

(function step() {
  var force = (0, _v2.default)();
  var dt = 1;
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

  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    (0, _inertia2d2.default)(point, dt);
  }

  for (var i = 0; i < colliding.length; i += 2) {
    var pointA = colliding[i];
    var pointB = colliding[i + 1];
    (0, _collidecirclecircle2.default)(pointA, pointA.radius, pointA.mass, pointB, pointB.radius, pointB.mass, true, DAMPING);
  }

  render(points, ctx);
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

function generatePoints(center, baseRadius, num) {
  var all = [];
  var minRadius = 10;
  for (var i = 0; i < num; i++) {
    var x = Math.cos(i) * center.x + center.x;
    var y = Math.sin(i) * center.y + center.y;
    all.push({
      cpos: { x: x, y: y },
      ppos: { x: x, y: y },
      acel: { x: 0, y: 0 },
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

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(point.ppos.x, point.ppos.y, point.radius, 0, Math.PI * 2, false);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(point.cpos.x, point.cpos.y, point.radius, 0, Math.PI * 2, false);
    ctx.fill();
  }
}

},{"../accelerate2d":1,"../collidecirclecircle":2,"../gravitation2d":4,"../inertia2d":5,"../overlapcirclecircle":10,"../v2":11,"science-halt":9}],4:[function(require,module,exports){
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

},{"./v2":11}],5:[function(require,module,exports){
'use strict';

var v2 = require('./v2');

module.exports = function (cmp) {
  var x = cmp.cpos.x * 2 - cmp.ppos.x,
      y = cmp.cpos.y * 2 - cmp.ppos.y;

  v2.set(cmp.ppos, cmp.cpos.x, cmp.cpos.y);
  v2.set(cmp.cpos, x, y);
};

},{"./v2":11}],6:[function(require,module,exports){

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

},{"./debug":7}],7:[function(require,module,exports){

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

},{"ms":8}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){

module.exports = function(onhalt, opt_msg, opt_keycode) {
  document.addEventListener('keydown', function(e) {
    if (e.which == (opt_keycode || 27)) {
      onhalt();
      console.log(opt_msg || 'HALT IN THE NAME OF SCIENCE!');
    }
  })
}
},{}],10:[function(require,module,exports){
"use strict";

module.exports = function (ax, ay, arad, bx, by, brad) {
  var x = bx - ax;
  var y = by - ay;
  var rad = arad + brad;
  return x * x + y * y < rad * rad;
};

},{}],11:[function(require,module,exports){
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

},{}]},{},[3]);
