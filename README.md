pocket-physics
==============

```
npm install pocket-physics
```

```js
var accelerate = require('pocket-physics/accelerate');
var inertia = require('pocket-physics/inertia');

var point = {
  cpos: { x: 0, y: 0 },
  ppos: { x: 0, y: 0 },
  acel: { x: 10, y: 0 }
}

// 0.1 is the delta time between steps in milliseconds
accelerate(point, 16);
inertia(point);

console.log(point.cpos)
// { x: 5.12, y: 0 }
```

LICENSE
=======

MIT