import v2 from './v2';
const accel1 = v2();

export default function solve(p1, p1mass, p2, p2mass, gravityConstant=0.99) {
  // handle either obj not having mass
  if (!p1mass || !p2mass) return;

  let mag;
  let factor;

  const diffx = p2.cpos.x - p1.cpos.x;
  const diffy = p2.cpos.y - p1.cpos.y;

  v2.set(accel1, diffx, diffy);
  mag = v2.magnitude(accel1);

  // Newton's Law of Universal Gravitation -- Vector Form!
  factor = gravityConstant * ((p1mass * p2mass) / (mag * mag));

  // scale by gravity acceleration
  v2.normalize(accel1, accel1);
  v2.scale(accel1, accel1, factor);

  // add the acceleration from gravity to p1 accel
  v2.add(p1.acel, p1.acel, accel1);
};