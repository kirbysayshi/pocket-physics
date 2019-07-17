export const overlapCircleCircle = (
  ax: number,
  ay: number,
  arad: number,
  bx: number,
  by: number,
  brad: number
) => {
  const x = bx - ax;
  const y = by - ay;
  const rad = arad + brad;
  return x * x + y * y < rad * rad;
};
