import v3 from './v3';
const accel1 = v3();

export default function solve(p1, p1mass, p2, p2mass, gravityConstant=0.99) {
  // handle either obj not having mass
  if (!p1mass || !p2mass) return;

  let mag;
  let factor;

  const diffx = p2.cpos.x - p1.cpos.x;
  const diffy = p2.cpos.y - p1.cpos.y;
  const diffz = p2.cpos.z - p1.cpos.z;

  v3.set(accel1, diffx, diffy, diffz);
  mag = v3.magnitude(accel1);

  // Newton's Law of Universal Gravitation -- Vector Form!
  factor = gravityConstant * ((p1mass * p2mass) / (mag * mag));

  // scale by gravity acceleration
  v3.normalize(accel1, accel1);
  v3.scale(accel1, accel1, factor);

  // add the acceleration from gravity to p1 accel
  v3.add(p1.acel, p1.acel, accel1);
};