import v2 from './v2';

const s1 = v2();
const s2 = v2();

export default function segmentIntersection(p0, p1, p2, p3, intersectionPoint) {
  v2.sub(s1, p1, p0);
  v2.sub(s2, p3, p2);

  const s = (-s1.y * (p0.x - p2.x) + s1.x * (p0.y - p2.y)) / (-s2.x * s1.y + s1.x * s2.y);
  const t = ( s2.x * (p0.y - p2.y) - s2.y * (p0.x - p2.x)) / (-s2.x * s1.y + s1.x * s2.y);

  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    // Collision detected
    intersectionPoint.x = p0.x + (t * s1.x);
    intersectionPoint.y = p0.y + (t * s1.y);
    return true;
  }

  return false;
};