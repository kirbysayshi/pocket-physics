import { Vector2, sub, v2, normalize, normal, dot, scale, add, distance, copy } from "./v2";

export type PointEdgeProjection = {
  // distance between the point and the projected point on the line
  distance: number; 
  // dot product between edge normal (endpoint1 -> endpoint2) and normal
  // from edge to point 
  similarty: number;
  // What percentage along the line the projection is. < 0 means behind the
  // edge, > 1 means ahead of the edge endpoints.
  t: number;
  // The point in absolute space of the projection along the edge
  projectedPoint: Vector2;
  // The normal of the edge (endpoint1 -> endpoint2)
  edgeNormal: Vector2;
};

// TODO: assume that result is fully initialized to prevent duplicate v2()

const edge = v2();
const edgeDir = v2();
const hypo = v2();
const edgePointingToCircleDirection = v2();

export function projectPointEdge(
  point: Vector2,
  endpoint1: Vector2,
  endpoint2: Vector2,
  result: PointEdgeProjection,
) {
  // Edge direction (edge in local space)
  sub(edge, endpoint1, endpoint2);

  // Normalize collision edge (assume collision axis is edge)
  normalize(edgeDir, edge);

  // We know which way the edges were wound, so we implicitly know which order
  // these points should be used in to compute the normal.
  normal(result.edgeNormal, endpoint1, endpoint2);

  // Vector from endpoint1 to particle
  sub(hypo, point, endpoint1);

  // Where is the particle on the edge, before, after, or on?
  // Also used for interpolation later.
  const projection = dot(edge, hypo);
  const maxDot = dot(edge, edge);
  const edgeMag = Math.sqrt(maxDot);

  // Projection is beyond the enpoints!
  // If we were doing an intersection test, we'd use this to say there
  // was no intersection.
  // if (projection < 0 || projection > maxDot) return;

  // Create interpolation factor of where point closest
  // to particle is on the line.
  const t = projection / maxDot;
  const u = 1 - t;

  // Find the point of projection on the edge.
  
  scale(result.projectedPoint, edgeDir, t * edgeMag);
  add(result.projectedPoint, result.projectedPoint, endpoint1);

  sub(edgePointingToCircleDirection, point, result.projectedPoint);

  // both the edge normal and the segment from edge to circle are
  // facing a similar direction
  const similarity = dot(edgePointingToCircleDirection, result.edgeNormal);

  const pointToProjectionDistance = distance(point, result.projectedPoint);

  result.distance = pointToProjectionDistance;
  result.similarty = similarity;
  result.t = t;

  return result;
}
