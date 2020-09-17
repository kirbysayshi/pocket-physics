export type Vector2<V extends number = number> = { x: V; y: V; };

export function v2<V extends number> (x?: V, y?: V): Vector2<V> {
  return { x: x || 0 as V, y: y || 0 as V}
}

export const copy = (out: Vector2, a: Vector2) => {
  out.x = a.x;
  out.y = a.y;
  return out;
}

export const set = <V extends number>(out: Vector2<V>, x: V, y: V) => {
  out.x = x;
  out.y = y;
  return out;
}

export const add = <V extends number>(out: Vector2<V>, a: Vector2<V>, b: Vector2<V>) => {
  out.x = a.x + b.x as V;
  out.y = a.y + b.y as V;
  return out;
}

export const sub = <V extends number>(out: Vector2<V>, a: Vector2<V>, b: Vector2<V>) => {
  out.x = a.x - b.x as V;
  out.y = a.y - b.y as V;
  return out;
}

export const dot = <V extends number>(a: Vector2<V>, b: Vector2<V>) => a.x * b.x + a.y * b.y

export const scale = <V extends number>(out: Vector2<V>, a: Vector2<V>, factor: number) => {
  out.x = a.x * factor as V;
  out.y = a.y * factor as V;
  return out;
}

export const distance = <V extends number>(v1: Vector2<V>, v2: Vector2<V>) => {
  const x = v1.x - v2.x;
  const y = v1.y - v2.y;
  return Math.sqrt(x*x + y*y);
}

export const distance2 = <V extends number>(v1: Vector2<V>, v2: Vector2<V>) => {
  const x = v1.x - v2.x;
  const y = v1.y - v2.y;
  return x*x + y*y;
}

export const magnitude = <V extends number>(v1: Vector2<V>) => {
  const x = v1.x;
  const y = v1.y;
  return Math.sqrt(x*x + y*y);
}

export const normalize = <V extends number>(out: Vector2<V>, a: Vector2<V>) => {
  const x = a.x;
  const y = a.y;
  let len = x*x + y*y;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    out.x = a.x * len as V;
    out.y = a.y * len as V;
  }
  return out;
}

/**
 * Compute the normal pointing away perpendicular from two vectors.
 * Given v1(0,0) -> v2(10, 0), the normal will be (0, 1)
 * */
export const normal = <V extends number>(out: Vector2<V>, v1: Vector2<V>, v2: Vector2<V>) => {
  out.y = v2.x - v1.x as V;
  out.x = v1.y - v2.y as V;
  return normalize(out, out);
}

// the perpendicular dot product, also known as "cross" elsewhere
// http://stackoverflow.com/a/243977/169491
export const perpDot = <V extends number>(v1: Vector2<V>, v2: Vector2<V>) => {
  return v1.x * v2.y - v1.y * v2.x;
}

/**
 * This is mostly useful for moving a verlet-style [current, previous]
 * by the same amount, translating them while preserving velocity.
 * @param by the vector to add to each subsequent vector
 * @param vN any number of vectors to translate
 */
export const translate = <V extends number>(by: Vector2<V>, ...vN: Vector2<V>[]) => {
  for (let i = 0; i < vN.length; i++) {
    const v = vN[i];
    add(v, v, by);
  }
}

/**
 * 
 * @param v Print this vector for nice logs
 */
export function vd(v: Vector2) {
  return `(${v.x}, ${v.y})`;
}

/**
 * Rotate a vector around another point. Taken nearly verbatim from gl-matrix
 */
export const rotate2d = <V extends Vector2>(
  out: V,
  target: V,
  origin: V,
  rad: number
) => {
  //Translate point to the origin
  const p0 = target.x - origin.x;
  const p1 = target.y - origin.y;
  const sinC = Math.sin(rad);
  const cosC = Math.cos(rad);

  //perform rotation and translate to correct position
  out.x = p0 * cosC - p1 * sinC + origin.x;
  out.y = p0 * sinC + p1 * cosC + origin.y;

  return out;
}

/**
 * Compute the Theta angle between a vector and the origin.
 */
export function angleOf(v: Vector2) {
  return Math.atan2(v.y, v.x);
}