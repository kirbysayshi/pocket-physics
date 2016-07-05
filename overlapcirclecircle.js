export default (ax, ay, arad, bx, by, brad) => {
  const x = bx - ax;
  const y = by - ay;
  const rad = arad + brad;
  return x*x + y*y < rad*rad;
};