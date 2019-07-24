pocket-physics
==============

Demos at [github.io/kirbysayshi/pocket-physics](github.io/kirbysayshi/pocket-physics).

```
npm install pocket-physics
```

```js
var { accelerate, inertia } = require('pocket-physics');

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

Maintenance
===========

Demos to gh-pages:

```
yarn demos:deploy
```

Publishing:

```
npm publish
```

LICENSE
=======

MIT