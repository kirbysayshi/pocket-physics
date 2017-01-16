export default (ax, ay, az, arad, bx, by, bz, brad) => {
  const x = bx - ax;
  const y = by - ay;
  const z = bz - az;
  const rad = arad + brad;
  return x*x + y*y + z*z < rad*rad;
};