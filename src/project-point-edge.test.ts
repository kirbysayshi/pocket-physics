import {
  createPointEdgeProjectionResult,
  projectPointEdge,
} from "./project-point-edge";
import { v2 } from "./v2";

const projection = createPointEdgeProjectionResult();

test("point above edge 2", () => {
  const ball = v2(0, 5);
  const p0 = v2(-10, 0);
  const p1 = v2(10, 0);

  projectPointEdge(ball, p0, p1, projection);

  expect(projection).toMatchInlineSnapshot(`
    Object {
      "distance": 5,
      "edgeNormal": Object {
        "x": 0,
        "y": 1,
      },
      "projectedPoint": Object {
        "x": 0,
        "y": 0,
      },
      "similarity": 5,
      "u": 0.5,
    }
  `);
});

test("point below edge 2", () => {
  const ball = v2(0, -5);
  const p0 = v2(-10, 0);
  const p1 = v2(10, 0);

  projectPointEdge(ball, p0, p1, projection);

  expect(projection).toMatchInlineSnapshot(`
    Object {
      "distance": 5,
      "edgeNormal": Object {
        "x": 0,
        "y": 1,
      },
      "projectedPoint": Object {
        "x": 0,
        "y": 0,
      },
      "similarity": -5,
      "u": 0.5,
    }
  `);
});

test("point above and behind edge 2", () => {
  const ball = v2(-15, 5);
  const p0 = v2(-10, 0);
  const p1 = v2(10, 0);

  projectPointEdge(ball, p0, p1, projection);

  expect(projection).toMatchInlineSnapshot(`
    Object {
      "distance": 5,
      "edgeNormal": Object {
        "x": 0,
        "y": 1,
      },
      "projectedPoint": Object {
        "x": -15,
        "y": 0,
      },
      "similarity": 5,
      "u": -0.25,
    }
  `);
});

test("point above and ahead of edge 2", () => {
  const ball = v2(15, 5);
  const p0 = v2(-10, 0);
  const p1 = v2(10, 0);

  projectPointEdge(ball, p0, p1, projection);

  expect(projection).toMatchInlineSnapshot(`
    Object {
      "distance": 5,
      "edgeNormal": Object {
        "x": 0,
        "y": 1,
      },
      "projectedPoint": Object {
        "x": 15,
        "y": 0,
      },
      "similarity": 5,
      "u": 1.25,
    }
  `);
});

test("point below and behind edge 2", () => {
  const ball = v2(-15, -5);
  const p0 = v2(-10, 0);
  const p1 = v2(10, 0);

  projectPointEdge(ball, p0, p1, projection);

  expect(projection).toMatchInlineSnapshot(`
    Object {
      "distance": 5,
      "edgeNormal": Object {
        "x": 0,
        "y": 1,
      },
      "projectedPoint": Object {
        "x": -15,
        "y": 0,
      },
      "similarity": -5,
      "u": -0.25,
    }
  `);
});

test("point below and ahead edge 2", () => {
  const ball = v2(15, -5);
  const p0 = v2(-10, 0);
  const p1 = v2(10, 0);

  projectPointEdge(ball, p0, p1, projection);

  expect(projection).toMatchInlineSnapshot(`
    Object {
      "distance": 5,
      "edgeNormal": Object {
        "x": 0,
        "y": 1,
      },
      "projectedPoint": Object {
        "x": 15,
        "y": 0,
      },
      "similarity": -5,
      "u": 1.25,
    }
  `);
});
