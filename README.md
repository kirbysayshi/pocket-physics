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

Also works in 3D!

```js
var accelerate = require('pocket-physics/accelerate3d');
var inertia = require('pocket-physics/inertia3d');
var constrain = require('pocket-physics/distanceconstraint3d');

var point1 = {
  cpos: { x: 0, y: 0 },
  ppos: { x: 0, y: 0 },
  acel: { x: 10, y: 0 }
}

var point2 = {
  cpos: { x: 10, y: 0 },
  ppos: { x: 0, y: 0 },
  acel: { x: 0, y: 0 }
}

// Keep the points this far apart always.
var goal = 10;

// 16 is the delta time between steps in milliseconds
accelerate(point1, 16);
accelerate(point2, 16);
constrain(point1, point2, goal);
inertia(point1);
inertia(point2);

console.log(point1.cpos)
// { x: 0, y: 0, z: 5.12 }
```

LICENSE
=======

MIT