pocket-physics
==============

```
npm install pocket-physics
```

```js
var accelerate = require('pocket-physics/dist/accelerate2d');
var inertia = require('pocket-physics/dist/inertia2d');

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

TODO
====

- [x] mass and radius as separate arguments when needed instead of whole object
- [ ] Use either `Infinity` or `Number.MAX_VALUE` to denote infinite mass (immoveable objects)

LICENSE
=======

MIT