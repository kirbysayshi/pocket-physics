(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _scienceHalt = _interopRequireDefault(require("science-halt"));

var _index = require("../src/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var cvs = document.createElement("canvas");
var ctx = cvs.getContext("2d");
cvs.width = cvs.height = 800;
cvs.style.border = "1px solid gray";
document.body.appendChild(cvs);
var box1 = {
  cpos: (0, _index.v2)(350, 90),
  ppos: (0, _index.v2)(349, 80),
  acel: (0, _index.v2)(),
  w: 100,
  h: 150,
  mass: 10
};
var box2 = {
  cpos: (0, _index.v2)(350, 600),
  ppos: (0, _index.v2)(350, 600),
  acel: (0, _index.v2)(),
  w: 100,
  h: 150,
  mass: 10
};
var points = [];
var collision = {
  resolve: (0, _index.v2)(),
  hitPos: (0, _index.v2)(),
  normal: (0, _index.v2)()
};
points.push(box1, box2);
var running = true;
(0, _scienceHalt["default"])(function () {
  return running = false;
});

(function step() {
  var dt = 1;

  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    (0, _index.accelerate)(point, dt);
  }

  var isOverlapping = (0, _index.overlapAABBAABB)(box1.cpos.x, box1.cpos.y, box1.w, box1.h, box2.cpos.x, box2.cpos.y, box2.w, box2.h, collision);

  if (isOverlapping) {
    // for debugging
    render(points, ctx); // move to non-overlapping position

    var overlapHalf = (0, _index.scale)((0, _index.v2)(), collision.resolve, 0.5);
    (0, _index.add)(box2.cpos, box2.cpos, overlapHalf);
    (0, _index.add)(box2.ppos, box2.ppos, overlapHalf);
    (0, _index.sub)(box1.cpos, box1.cpos, overlapHalf);
    (0, _index.sub)(box1.ppos, box1.ppos, overlapHalf); // for debugging

    render(points, ctx);
    var box1v = (0, _index.v2)();
    var box2v = (0, _index.v2)();
    var restitution = 1;
    var staticFriction = 0.9;
    var dynamicFriction = 0.01;
    (0, _index.collisionResponseAABB)(box1.cpos, box1.ppos, box1.mass, restitution, staticFriction, dynamicFriction, box2.cpos, box2.ppos, box2.mass, restitution, staticFriction, dynamicFriction, collision.normal, box1v, box2v); // Apply the new velocity

    (0, _index.sub)(box1.ppos, box1.cpos, box1v);
    (0, _index.sub)(box2.ppos, box2.cpos, box2v); // for debugging

    render(points, ctx);
  }

  for (var _i = 0; _i < points.length; _i++) {
    var _point = points[_i];
    (0, _index.inertia)(_point);
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

},{"../src/index":16,"science-halt":6}],2:[function(require,module,exports){
(function (process){
/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */
function log(...args) {
	// This hackery is required for IE8/9, where
	// the `console.log` function doesn't have 'apply'
	return typeof console === 'object' &&
		console.log &&
		console.log(...args);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = require('./common')(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};

}).call(this,require('_process'))
},{"./common":3,"_process":5}],3:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = require('ms');

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* Active `debug` instances.
	*/
	createDebug.instances = [];

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return match;
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.enabled = createDebug.enabled(namespace);
		debug.useColors = createDebug.useColors();
		debug.color = selectColor(namespace);
		debug.destroy = destroy;
		debug.extend = extend;
		// Debug.formatArgs = formatArgs;
		// debug.rawLog = rawLog;

		// env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		createDebug.instances.push(debug);

		return debug;
	}

	function destroy() {
		const index = createDebug.instances.indexOf(this);
		if (index !== -1) {
			createDebug.instances.splice(index, 1);
			return true;
		}
		return false;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}

		for (i = 0; i < createDebug.instances.length; i++) {
			const instance = createDebug.instances[i];
			instance.enabled = createDebug.enabled(instance.namespace);
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;

},{"ms":4}],4:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

},{}],5:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],6:[function(require,module,exports){

module.exports = function(onhalt, opt_msg, opt_keycode) {
  document.addEventListener('keydown', function(e) {
    if (e.which == (opt_keycode || 27)) {
      onhalt();
      console.log(opt_msg || 'HALT IN THE NAME OF SCIENCE!');
    }
  })
}
},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aabbFriction = void 0;

var _v = require("./v2");

var aabbFriction = function aabbFriction(cpos1, ppos1, mass1, staticFriction1, dynamicFriction1, cpos2, ppos2, mass2, staticFriction2, dynamicFriction2, collisionNormal, vel1out, vel2out) {
  var vel1 = (0, _v.v2)();
  var vel2 = (0, _v.v2)(); // Compute current velocities of each body

  (0, _v.sub)(vel1, cpos1, ppos1);
  (0, _v.sub)(vel2, cpos2, ppos2); // assume collision has already modified velocity
  // Compute relative velocity vector.

  var relativeVelocity = (0, _v.v2)();
  (0, _v.sub)(relativeVelocity, vel2, vel1); // Normalized tangent to the velocity vector

  var tangent = (0, _v.v2)();
  var reg1 = (0, _v.v2)();
  var impulseScalar = (0, _v.dot)(relativeVelocity, collisionNormal);
  (0, _v.scale)(reg1, collisionNormal, impulseScalar);
  (0, _v.sub)(tangent, relativeVelocity, reg1);
  (0, _v.normalize)(tangent, tangent); // Magnitude of friction to apply along friction vector

  var jt = (0, _v.dot)(relativeVelocity, tangent) / (1 / mass1 + 1 / mass2); // Use pythagorean theorum as approximation for friction

  var muStatic = Math.sqrt(staticFriction1 * staticFriction1 + staticFriction2 * staticFriction2);
  var muDynamic = Math.sqrt(dynamicFriction1 * dynamicFriction1 + dynamicFriction2 * dynamicFriction2);
  var frictionImpulse = (0, _v.v2)(); // technically impulse scalar should be the relative velocity * normal
  // _before_ the collision is resolved, but let's see what we get here.
  // Since it's perfectly elastic until friction, it might not matter.

  if (Math.abs(jt) < impulseScalar * muStatic) {
    (0, _v.scale)(frictionImpulse, tangent, jt);
  } else {
    (0, _v.scale)(frictionImpulse, tangent, -frictionImpulse * muDynamic);
  }

  (0, _v.scale)(vel1out, frictionImpulse, 1 / mass1 * -1);
  (0, _v.scale)(vel2out, frictionImpulse, 1 / mass2);
};

exports.aabbFriction = aabbFriction;

},{"./v2":23}],8:[function(require,module,exports){
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

},{"./v2":23}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collideCircleCircle = void 0;

var _v = require("./v2");

var _debug = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var debug = (0, _debug["default"])("pocket-physics:collide-circle-circle"); // Preallocations!

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
}; // It's very important that this function not do any distance checking.
// It is assumed that if this function is called, then the points are
// definitely colliding, and that after being called with preserveInertia
// === false, another call with === true should be made, even if the first
// calculation has moved the points away from physically touching.

var collideCircleCircle = function collideCircleCircle(p1, p1radius, p1mass, p2, p2radius, p2mass, preserveInertia, damping) {
  debug("p1 cpos %o, mass %d, radius %d", p1.cpos, p1mass, p1radius);
  debug("p2 cpos %o, mass %d, radius %d", p2.cpos, p2mass, p2radius);
  var dist2 = (0, _v.distance2)(p1.cpos, p2.cpos);
  var target = p1radius + p2radius;
  var min2 = target * target; //if (dist2 > min2) return;

  (0, _v.sub)(vel1, p1.cpos, p1.ppos);
  (0, _v.sub)(vel2, p2.cpos, p2.ppos);
  (0, _v.sub)(diff, p1.cpos, p2.cpos);
  var dist = Math.sqrt(dist2);
  var factor = (dist - target) / dist; // Avoid division by zero in case points are directly atop each other.

  if (dist === 0) factor = 1;
  debug("point dist %d, edge dist %d, factor %d", dist, dist - target, factor);
  debug("diff %o", diff);
  var mass1 = p1mass === undefined ? 1 : p1mass;
  var mass2 = p2mass === undefined ? 1 : p2mass;
  var massT = mass1 + mass2;
  debug("massT %d, mass1 %d, mass2 %d", massT, mass1, mass2); // Move a away

  move.x = diff.x * factor * (mass2 / massT);
  move.y = diff.y * factor * (mass2 / massT);

  if (mass1 > 0) {
    debug("moving p1", move);
    (0, _v.sub)(p1.cpos, p1.cpos, move);
  } // Move b away


  move.x = diff.x * factor * (mass1 / massT);
  move.y = diff.y * factor * (mass1 / massT);

  if (mass2 > 0) {
    debug("moving p2", move);
    (0, _v.add)(p2.cpos, p2.cpos, move);
  }

  debug("p1.cpos %o", p1.cpos);
  debug("p2.cpos %o", p2.cpos);
  if (!preserveInertia) return;
  damping = damping || 1;
  var f1 = damping * (diff.x * vel1.x + diff.y * vel1.y) / (dist2 || 1);
  var f2 = damping * (diff.x * vel2.x + diff.y * vel2.y) / (dist2 || 1);
  debug("inertia. f1 %d, f2 %d", f1, f2);
  vel1.x += (f2 * diff.x - f1 * diff.x) / (mass1 || 1); // * (mass2 / massT);

  vel2.x += (f1 * diff.x - f2 * diff.x) / (mass2 || 1); // * (mass1 / massT);

  vel1.y += (f2 * diff.y - f1 * diff.y) / (mass1 || 1); // * (mass2 / massT);

  vel2.y += (f1 * diff.y - f2 * diff.y) / (mass2 || 1); // * (mass1 / massT);

  debug("velocity. p1 %o, p2 %o", vel1, vel2);
  (0, _v.set)(p1.ppos, p1.cpos.x - vel1.x, p1.cpos.y - vel1.y);
  (0, _v.set)(p2.ppos, p2.cpos.x - vel2.x, p2.cpos.y - vel2.y);
  debug("p1.ppos %o", p1.ppos);
  debug("p2.ppos %o", p2.ppos);
};

exports.collideCircleCircle = collideCircleCircle;

},{"./v2":23,"debug":2}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collideCircleEdge = collideCircleEdge;

var _v = require("./v2");

var _collidecirclecircle = require("./collidecirclecircle");

var _debug = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var debug = (0, _debug["default"])('pocket-physics:collide-circle-edge'); // Preallocations

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

function collideCircleEdge(point3, radius3, mass3, point1, mass1, point2, mass2, preserveInertia, damping) {
  debug('point3 %o', point3);
  debug('endpoint1 %o', point1);
  debug('endpoint2 %o', point2); // Edge direction (edge in local space)

  (0, _v.sub)(edge, point2.cpos, point1.cpos); // Normalize collision edge (assume collision axis is edge)

  (0, _v.normalize)(edgeDir, edge); // Vector from endpoint1 to particle

  (0, _v.sub)(hypo, point3.cpos, point1.cpos);
  debug('edge %o', edge);
  debug('hypo %o', hypo);
  debug('edgeDir %o', edgeDir); // Where is the particle on the edge, before, after, or on?
  // Also used for interpolation later.

  var projection = (0, _v.dot)(edge, hypo);
  var maxDot = (0, _v.dot)(edge, edge);
  var edgeMag = Math.sqrt(maxDot);
  debug('projection %d', projection);
  debug('maxDot %d', maxDot);
  debug('edgeMag %d', edgeMag); // Colliding beyond the edge...

  if (projection < 0 || projection > maxDot) return; // Create interpolation factor of where point closest
  // to particle is on the line.

  var t = projection / maxDot;
  var u = 1 - t;
  debug('t %d, u %d', t, u); // Find the point of collision on the edge.

  (0, _v.scale)(collisionPoint, edgeDir, t * edgeMag);
  (0, _v.add)(collisionPoint, collisionPoint, point1.cpos);
  var dist = (0, _v.distance)(collisionPoint, point3.cpos);
  debug('collision distance %d, radius %d', dist, radius3); // Bail if point and edge are too far apart.

  if (dist > radius3) return; // Distribute mass of colliding point into two fake points
  // and use those to collide against each endpoint independently.

  var standinMass1 = u * mass3;
  var standinMass2 = t * mass3;
  debug('standinMass 1,2 %d,%d', standinMass1, standinMass2);
  var standin1 = {
    cpos: (0, _v.v2)(),
    ppos: (0, _v.v2)()
  };
  var standin2 = {
    cpos: (0, _v.v2)(),
    ppos: (0, _v.v2)()
  }; // Slide standin1 along edge to be in front of endpoint1

  (0, _v.scale)(standin1.cpos, edgeDir, t * edgeMag);
  (0, _v.sub)(standin1.cpos, point3.cpos, standin1.cpos);
  (0, _v.scale)(standin1.ppos, edgeDir, t * edgeMag);
  (0, _v.sub)(standin1.ppos, point3.ppos, standin1.ppos); // Slide standin2 along edge to be in front of endpoint2

  (0, _v.scale)(standin2.cpos, edgeDir, u * edgeMag);
  (0, _v.add)(standin2.cpos, point3.cpos, standin2.cpos);
  (0, _v.scale)(standin2.ppos, edgeDir, u * edgeMag);
  (0, _v.add)(standin2.ppos, point3.ppos, standin2.ppos);
  debug('standin1 %o', standin1);
  debug('standin2 %o', standin2);
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
  var edgeRadius = 0;
  debug('collide standin1 with endpoint1'); // Collide standins with endpoints

  (0, _collidecirclecircle.collideCircleCircle)(standin1, radius3, standinMass1, point1, edgeRadius, mass1, preserveInertia, damping);
  debug('collide standin2 with endpoint2');
  (0, _collidecirclecircle.collideCircleCircle)(standin2, radius3, standinMass2, point2, edgeRadius, mass2, preserveInertia, damping);
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
  (0, _v.scale)(standin2Delta.cpos, standin2Delta.cpos, t);
  debug('standin1Delta cpos %o', standin1Delta.cpos);
  debug('standin2Delta cpos %o', standin2Delta.cpos); // Apply cpos changes to point3

  (0, _v.add)(point3.cpos, point3.cpos, standin1Delta.cpos);
  (0, _v.add)(point3.cpos, point3.cpos, standin2Delta.cpos);
  debug('new endpoint1.cpos %o', point1.cpos);
  debug('new endpoint2.cpos %o', point2.cpos);
  debug('new point3.cpos %o', point3.cpos);
  if (!preserveInertia) return; // TODO: instead of adding diff, get magnitude of diff and scale
  // in reverse direction of standin velocity from point3.cpos because
  // that is what circlecircle does.
  // Compute standin1 ppos change

  (0, _v.sub)(standin1Delta.ppos, standin1.ppos, standin1Before.ppos); // Compute standin2 ppos change

  (0, _v.sub)(standin2Delta.ppos, standin2.ppos, standin2Before.ppos);
  (0, _v.scale)(standin1Delta.ppos, standin1Delta.ppos, u);
  (0, _v.scale)(standin2Delta.ppos, standin2Delta.ppos, t);
  debug('standin1Delta ppos %o', standin1Delta.ppos);
  debug('standin2Delta ppos %o', standin2Delta.ppos); // Apply ppos changes to point3

  (0, _v.add)(point3.ppos, point3.ppos, standin1Delta.ppos);
  (0, _v.add)(point3.ppos, point3.ppos, standin2Delta.ppos);
  debug('new endpoint1.ppos %o', point1.ppos);
  debug('new endpoint2.ppos %o', point2.ppos);
  debug('new point3.ppos %o', point3.ppos);
}

;

},{"./collidecirclecircle":9,"./v2":23,"debug":2}],11:[function(require,module,exports){
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

  if (collisionNormal && collisionNormal.x !== 0 && collisionNormal.y !== 0) {
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

},{"./v2":23}],12:[function(require,module,exports){
"use strict";

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.solveDistanceConstraint = solveDistanceConstraint;

var _v = require("./v2");

var _debug = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var dbg = (0, _debug["default"])('pocket-physics:distanceconstraint');

function solveDistanceConstraint(p1, p1mass, p2, p2mass, goal) {
  var imass1 = 1 / (p1mass || 1);
  var imass2 = 1 / (p2mass || 1);
  var imass = imass1 + imass2; // Current relative vector

  var delta = (0, _v.sub)((0, _v.v2)(), p2.cpos, p1.cpos);
  var deltaMag = (0, _v.magnitude)(delta);
  dbg('goal', goal);
  dbg('delta', delta); // Difference between current distance and goal distance

  var diff = (deltaMag - goal) / deltaMag;
  dbg('delta mag', deltaMag);
  dbg('diff', diff); // approximate mass

  (0, _v.scale)(delta, delta, diff / imass);
  dbg('delta diff/imass', delta);
  var p1correction = (0, _v.scale)((0, _v.v2)(), delta, imass1);
  var p2correction = (0, _v.scale)((0, _v.v2)(), delta, imass2);
  dbg('p1correction', p1correction);
  dbg('p2correction', p2correction);
  if (p1mass) (0, _v.add)(p1.cpos, p1.cpos, p1correction);
  if (p2mass) (0, _v.sub)(p2.cpos, p2.cpos, p2correction);
}

;

},{"./v2":23,"debug":2}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.solveGravitation = solveGravitation;

var _v = require("./v2");

var accel1 = (0, _v.v2)();

function solveGravitation(p1, p1mass, p2, p2mass) {
  var gravityConstant = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.99;
  // handle either obj not having mass
  if (!p1mass || !p2mass) return;
  var mag;
  var factor;
  var diffx = p2.cpos.x - p1.cpos.x;
  var diffy = p2.cpos.y - p1.cpos.y;
  (0, _v.set)(accel1, diffx, diffy);
  mag = (0, _v.magnitude)(accel1); // Newton's Law of Universal Gravitation -- Vector Form!

  factor = gravityConstant * (p1mass * p2mass / (mag * mag)); // scale by gravity acceleration

  (0, _v.normalize)(accel1, accel1);
  (0, _v.scale)(accel1, accel1, factor); // add the acceleration from gravity to p1 accel

  (0, _v.add)(p1.acel, p1.acel, accel1);
}

},{"./v2":23}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "aabbFriction", {
  enumerable: true,
  get: function get() {
    return _aabbFriction.aabbFriction;
  }
});
Object.defineProperty(exports, "accelerate", {
  enumerable: true,
  get: function get() {
    return _accelerate2d.accelerate;
  }
});
Object.defineProperty(exports, "collideCircleCircle", {
  enumerable: true,
  get: function get() {
    return _collidecirclecircle.collideCircleCircle;
  }
});
Object.defineProperty(exports, "collideCircleEdge", {
  enumerable: true,
  get: function get() {
    return _collidecircleedge.collideCircleEdge;
  }
});
Object.defineProperty(exports, "collisionResponseAABB", {
  enumerable: true,
  get: function get() {
    return _collisionResponseAabb.collisionResponseAABB;
  }
});
Object.defineProperty(exports, "solveDistanceConstraint", {
  enumerable: true,
  get: function get() {
    return _distanceconstraint2d.solveDistanceConstraint;
  }
});
Object.defineProperty(exports, "solveDrag", {
  enumerable: true,
  get: function get() {
    return _drag2d.solveDrag;
  }
});
Object.defineProperty(exports, "solveGravitation", {
  enumerable: true,
  get: function get() {
    return _gravitation2d.solveGravitation;
  }
});
Object.defineProperty(exports, "inertia", {
  enumerable: true,
  get: function get() {
    return _inertia2d.inertia;
  }
});
Object.defineProperty(exports, "overlapAABBAABB", {
  enumerable: true,
  get: function get() {
    return _overlapaabbaabb.overlapAABBAABB;
  }
});
Object.defineProperty(exports, "AABBOverlapResult", {
  enumerable: true,
  get: function get() {
    return _overlapaabbaabb.AABBOverlapResult;
  }
});
Object.defineProperty(exports, "overlapCircleCircle", {
  enumerable: true,
  get: function get() {
    return _overlapcirclecircle.overlapCircleCircle;
  }
});
Object.defineProperty(exports, "rewindToCollisionPoint", {
  enumerable: true,
  get: function get() {
    return _rewindtocollisionpoint.rewindToCollisionPoint;
  }
});
Object.defineProperty(exports, "segmentIntersection", {
  enumerable: true,
  get: function get() {
    return _segmentintersection.segmentIntersection;
  }
});
Object.defineProperty(exports, "solveSpringConstraint", {
  enumerable: true,
  get: function get() {
    return _springconstraint2d.solveSpringConstraint;
  }
});
Object.defineProperty(exports, "Vector2", {
  enumerable: true,
  get: function get() {
    return _v.Vector2;
  }
});
Object.defineProperty(exports, "v2", {
  enumerable: true,
  get: function get() {
    return _v.v2;
  }
});
Object.defineProperty(exports, "copy", {
  enumerable: true,
  get: function get() {
    return _v.copy;
  }
});
Object.defineProperty(exports, "set", {
  enumerable: true,
  get: function get() {
    return _v.set;
  }
});
Object.defineProperty(exports, "add", {
  enumerable: true,
  get: function get() {
    return _v.add;
  }
});
Object.defineProperty(exports, "sub", {
  enumerable: true,
  get: function get() {
    return _v.sub;
  }
});
Object.defineProperty(exports, "dot", {
  enumerable: true,
  get: function get() {
    return _v.dot;
  }
});
Object.defineProperty(exports, "scale", {
  enumerable: true,
  get: function get() {
    return _v.scale;
  }
});
Object.defineProperty(exports, "distance", {
  enumerable: true,
  get: function get() {
    return _v.distance;
  }
});
Object.defineProperty(exports, "distance2", {
  enumerable: true,
  get: function get() {
    return _v.distance2;
  }
});
Object.defineProperty(exports, "magnitude", {
  enumerable: true,
  get: function get() {
    return _v.magnitude;
  }
});
Object.defineProperty(exports, "normalize", {
  enumerable: true,
  get: function get() {
    return _v.normalize;
  }
});
Object.defineProperty(exports, "normal", {
  enumerable: true,
  get: function get() {
    return _v.normal;
  }
});
Object.defineProperty(exports, "perpDot", {
  enumerable: true,
  get: function get() {
    return _v.perpDot;
  }
});
Object.defineProperty(exports, "DeltaTimeMS", {
  enumerable: true,
  get: function get() {
    return _commonTypes.DeltaTimeMS;
  }
});
Object.defineProperty(exports, "Integratable", {
  enumerable: true,
  get: function get() {
    return _commonTypes.Integratable;
  }
});

var _aabbFriction = require("./aabb-friction");

var _accelerate2d = require("./accelerate2d");

var _collidecirclecircle = require("./collidecirclecircle");

var _collidecircleedge = require("./collidecircleedge");

var _collisionResponseAabb = require("./collision-response-aabb");

var _distanceconstraint2d = require("./distanceconstraint2d");

var _drag2d = require("./drag2d");

var _gravitation2d = require("./gravitation2d");

var _inertia2d = require("./inertia2d");

var _overlapaabbaabb = require("./overlapaabbaabb2");

var _overlapcirclecircle = require("./overlapcirclecircle");

var _rewindtocollisionpoint = require("./rewindtocollisionpoint");

var _segmentintersection = require("./segmentintersection");

var _springconstraint2d = require("./springconstraint2d");

var _v = require("./v2");

var _commonTypes = require("./common-types");

},{"./aabb-friction":7,"./accelerate2d":8,"./collidecirclecircle":9,"./collidecircleedge":10,"./collision-response-aabb":11,"./common-types":12,"./distanceconstraint2d":13,"./drag2d":14,"./gravitation2d":15,"./inertia2d":17,"./overlapaabbaabb2":18,"./overlapcirclecircle":19,"./rewindtocollisionpoint":20,"./segmentintersection":21,"./springconstraint2d":22,"./v2":23}],17:[function(require,module,exports){
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

},{"./v2":23}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.overlapAABBAABB = void 0;

var _v = require("./v2");

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

},{"./v2":23}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rewindToCollisionPoint = rewindToCollisionPoint;

var _v = require("./v2");

var _segmentintersection = require("./segmentintersection");

var _debug = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var debug = (0, _debug["default"])("pocket-physics:rewind-to-collision-point");
var tunnelPoint = (0, _v.v2)();
var offset = (0, _v.v2)();

function rewindToCollisionPoint(point3, point1, point2) {
  // detect if a collision has occurred but would have been missed due to
  // point3 moving beyond the edge in one time step.
  var hasTunneled = (0, _segmentintersection.segmentIntersection)(point3.cpos, point3.ppos, point1.cpos, point2.cpos, tunnelPoint);
  if (!hasTunneled) return;
  debug("hasTunneled %s", hasTunneled); // Translate point3 to tunnelPoint

  (0, _v.sub)(offset, point3.cpos, tunnelPoint);
  debug("offset %o", offset);
  debug("point3.cpos %o", point3.cpos);
  debug("point3.ppos %o", point3.ppos);
  (0, _v.sub)(point3.cpos, point3.cpos, offset);
  (0, _v.sub)(point3.ppos, point3.ppos, offset);
  debug("corrected point3.cpos %o", point3.cpos);
  debug("corrected point3.ppos %o", point3.ppos);
}

function debuggerIfNaN(point) {
  if (isNaN(point.x) || isNaN(point.y)) {
    debugger;
  }
}

},{"./segmentintersection":21,"./v2":23,"debug":2}],21:[function(require,module,exports){
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

},{"./v2":23}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.solveSpringConstraint = solveSpringConstraint;

var _v = require("./v2");

var _debug = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var debug = (0, _debug["default"])("pocket-physics:springconstraint");

function solveSpringConstraint(follower, followerMass, target, targetMass, stiffness, damping) {
  var p1 = follower;
  var p2 = target;
  var p1mass = followerMass;
  var p2mass = targetMass;
  var imass1 = 1 / (p1mass || 1);
  var imass2 = 1 / (p2mass || 1);
  var imass = imass1 + imass2; // Current relative vector

  var delta = (0, _v.sub)((0, _v.v2)(), p2.cpos, p1.cpos);
  debug("target", target);
  debug("delta", delta); //scale(delta, delta, stiffness * damping * imass2);

  (0, _v.scale)(delta, delta, stiffness * damping * imass1);
  debug("delta * stiffness * damping", delta);
  (0, _v.add)(p1.acel, p1.acel, delta);
}

},{"./v2":23,"debug":2}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.v2 = v2;
exports.perpDot = exports.normal = exports.normalize = exports.magnitude = exports.distance2 = exports.distance = exports.scale = exports.dot = exports.sub = exports.add = exports.set = exports.copy = void 0;

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

exports.perpDot = perpDot;

},{}]},{},[1]);
