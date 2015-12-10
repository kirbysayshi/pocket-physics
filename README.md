pocket-physics
==============

```
npm install pocket-physics
```

```js
var accelerate = require('pocket-physics/accelerate2d');
var inertia = require('pocket-physics/inertia2d');

var point = {
  cpos: { x: 0, y: 0 },
  ppos: { x: 0, y: 0 },
  acel: { x: 10, y: 0 }
}

// 16 is the delta time between steps in milliseconds
accelerate(point1, 16);
inertia(point);

console.log(point.cpos)
// { x: 5.12, y: 0 }
```

Also works in 3D! Check out a live demo: [![view on requirebin](http://requirebin.com/badge.png)](http://requirebin.com/?gist=bafff38038be6bb60a3e)

```js
var v3 = require('pocket-physics/v3');
var accelerate = require('pocket-physics/accelerate3d');
var inertia = require('pocket-physics/inertia3d');
var constrain = require('pocket-physics/distanceconstraint3d');

var point1 = {
  cpos: { x: 0, y: 0, z: 0 },
  ppos: { x: 0, y: 0, z: 0 },
  acel: { x: 6, y: 0, z: 0 },
  mass: 5.5
}

var point2 = {
  cpos: { x: 10, y: 0, z: 0 },
  ppos: { x: 10, y: 0, z: 0 },
  acel: { x: 0, y: 6, z: 0 },
  mass: 2.5
}

// Keep the points this far apart always.
var goal = v3.distance(point1.cpos, point2.cpos);
// 16 is the delta time between steps in milliseconds
var dt = 16;

accelerate(point1, dt);
accelerate(point2, dt);
constrain(point1, point2, goal);
inertia(point1, dt);
inertia(point2, dt);
```

TODO
====

- [ ] mass and radius as separate arguments when needed instead of whole object
- [ ] Use either `Infinity` or `Number.MAX_VALUE` to denote infinite mass (immoveable objects)
- [ ] 3d collisions

LICENSE
=======

MIT