import {
  copy,
  set,
  sub,
  v2,
} from './v2';

import debug from 'debug';

const dbg = debug('pocket-physics:overlapaabaabb');

function AABB (centerX, centerY, width, height, outMin, outMax) {
  const halfW = width / 2;
  const halfH = height / 2;

  outMin.x = centerX - halfW;
  outMin.y = centerY - halfH;
  outMax.x = centerX + halfW;
  outMax.y = centerY + halfH;
}

// http://hamaluik.com/posts/simple-aabb-collision-using-minkowski-difference/

function closestPointOnBoundsToPoint (minX, minY, maxX, maxY, startX, startY, out) {
  let minDist = Math.abs(startX - minX);
  let boundsPointX = minX;
  let boundsPointY = startY;

  if (Math.abs(maxX - startX) < minDist) {
    dbg('maxX - startX %d, minDist %d', maxX - startX, minDist);
    minDist = Math.abs(maxX - startX);
    boundsPointX = maxX;
    boundsPointY = startY;
  }

  if (Math.abs(maxY - startY) < minDist) {
    minDist = Math.abs(maxY - startY);
    boundsPointX = startX;
    boundsPointY = maxY;
  }

  if (Math.abs(minY - startY) < minDist) {
    minDist = Math.abs(minY - startY);
    boundsPointX = startX;
    boundsPointY = minY;
  }

  out.x = boundsPointX;
  out.y = boundsPointY;
  return out;
}

const box1min = v2();
const box1max = v2();

const box2min = v2();
const box2max = v2();

const box3bottomLeft = v2();
const box3bottomRight = v2();

const combinedSize = v2();

const box3min = v2();
const box3max = v2();

export default (
  center1X, center1Y, width1, height1,
  center2X, center2Y, width2, height2,
  result
) => {

  // compute min/max for each aabb
  AABB(center1X, center1Y, width1, height1, box1min, box1max);
  AABB(center2X, center2Y, width2, height2, box2min, box2max);

  dbg('box1min %o', box1min);
  dbg('box1max %o', box1max);

  dbg('box2min %o', box2min);
  dbg('box2max %o', box2max);

  // minkowski difference
  sub(box3bottomLeft, box1min, box2max);
  set(combinedSize, width1 + width2, height1 + height2);
  set(box3min, box3bottomLeft.x, box3bottomLeft.y);
  set(box3max, box3bottomLeft.x + combinedSize.x, box3bottomLeft.y + combinedSize.y);

  dbg('box3bottomLeft %o', box3bottomLeft);

  dbg('combinedSize %o', combinedSize);
  dbg('box3min (mdiff) %o', box3min);
  dbg('box3max (mdiff) %o', box3max);

  // TODO: this is not the penetration vector, it's the vector needed to
  // move one box to not intersect with the other. Very different.

  if (
    box3min.x <= 0
    && box3min.y <= 0
    && box3max.x >= 0
    && box3max.y >= 0
  ) {
    if (result) {
      closestPointOnBoundsToPoint(
        box3min.x, box3min.y,
        box3max.x, box3max.y,
        0, 0,
        result);
    }
    return true;
  } else {
    return false;
  }
}
