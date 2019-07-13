import {
  v2,
  set,
} from './v2';

import debug from 'debug';

const dbg = debug('pocket-physics:overlapaabaabb2');

// https://github.com/noonat/intersect/blob/master/intersect.js

export default (
  center1X, center1Y, width1, height1,
  center2X, center2Y, width2, height2,
  result
) => {

  const dx = center2X - center1X;
  const px = (width2 / 2) + (width1 / 2) - Math.abs(dx);
  const dy = center2Y - center1Y;
  const py = (height2 / 2) + (height1 / 2) - Math.abs(dy);

  if (px <= 0) return null;
  if (py <= 0) return null;

  if (!result.resolve) result.resolve = v2();
  if (!result.hitPos) result.hitPos = v2();
  if (!result.normal) result.normal = v2();

  set(result.resolve, 0, 0);
  set(result.hitPos, 0, 0);
  set(result.normal, 0, 0);

  if (px < py) {
    const sx = dx < 0 ? -1 : 1;
    result.resolve.x = px * sx;
    result.normal.x = sx;
    // Really not sure about these values.
    result.hitPos.x = center1X + (width1 / 2 * sx);
    result.hitPos.y = center2Y;
  } else {
    const sy = dy < 0 ? -1 : 1;
    result.resolve.y = py * sy;
    result.normal.y = sy;
    // Really not sure about these values.
    result.hitPos.x = center2X;
    result.hitPos.y = center1Y + (height1 / 2 * sy);
  }

  return result;
}
