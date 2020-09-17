import {
  Vector2,
  sub,
  v2,
  normal,
  dot,
  distance,
  set,
} from "./v2";

export type PointEdgeProjection = {
  // distance between the point and the projected point on the line
  distance: number;
  // dot product between edge normal (perp of endpoint1 -> endpoint2) and normal
  // from edge to point. If positive, they are pointing in the same direction
  // (aka the point is on the side of the segment in the direction of the
  // normal). If negative, the point is on the opposite side. The absolute value
  // of this will always match the distance.
  similarity: number;
  // What percentage along the line the projection is. < 0 means behind the
  // edge, > 1 means ahead of the edge endpoints.
  u: number;
  // The point in absolute space of the projection along the edge
  projectedPoint: Vector2;
  // The normal of the edge (endpoint1 -> endpoint2): Given v1(0,0) -> v2(10, 0), the normal will be (0, 1)
  edgeNormal: Vector2;
};

/**
 * Create a pre-made result object for tests.
 */
export function createPointEdgeProjectionResult(): PointEdgeProjection {
  return {
    distance: 0,
    similarity: 0,
    u: 0,
    projectedPoint: v2(),
    edgeNormal: v2(),
  };
}

const edgeDelta = v2();
const perp = v2();

export function projectPointEdge(
  point: Vector2,
  endpoint1: Vector2,
  endpoint2: Vector2,
  result: PointEdgeProjection
) {
  sub(edgeDelta, endpoint2, endpoint1);
  if (edgeDelta.x === 0 && edgeDelta.y === 0) {
    throw new Error('ZeroLengthEdge');
  }

  // http://paulbourke.net/geometry/pointlineplane/
  // http://paulbourke.net/geometry/pointlineplane/DistancePoint.java
  const u =
    ((point.x - endpoint1.x) * edgeDelta.x + (point.y - endpoint1.y) * edgeDelta.y) /
    (edgeDelta.x * edgeDelta.x + edgeDelta.y * edgeDelta.y);

  result.u = u;

  const proj = set(
    result.projectedPoint,
    endpoint1.x + u * edgeDelta.x,
    endpoint1.y + u * edgeDelta.y
  );

  result.distance = distance(proj, point);

  // given:
  // E1----------------------E2        Proj
  //           |                        |
  //           | EdgeNorm               | perp
  //           |                       Point
  // 
  // What is the similarity (dot product) between EdgeNorm and Perp?
  const edgeNorm = normal(result.edgeNormal, endpoint1, endpoint2);
  sub(perp, point, proj);
  result.similarity = dot(edgeNorm, perp);
}
