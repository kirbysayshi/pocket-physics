export type Vector2 = { x: number; y: number; };

export function v2 (x?: number, y?: number) {
  return { x: x || 0, y: y || 0 }
}

export const copy = (out: Vector2, a: Vector2) => {
  out.x = a.x;
  out.y = a.y;
  return out;
}

export const set = (out: Vector2, x: number, y: number) => {
  out.x = x;
  out.y = y;
  return out;
}

export const add = (out: Vector2, a: Vector2, b: Vector2) => {
  out.x = a.x + b.x;
  out.y = a.y + b.y;
  return out;
}

export const sub = (out: Vector2, a: Vector2, b: Vector2) => {
  out.x = a.x - b.x;
  out.y = a.y - b.y;
  return out;
}

export const dot = (a: Vector2, b: Vector2) => a.x * b.x + a.y * b.y

export const scale = (out: Vector2, a: Vector2, factor: number) => {
  out.x = a.x * factor;
  out.y = a.y * factor;
  return out;
}

export const distance = (v1: Vector2, v2: Vector2) => {
  const x = v1.x - v2.x;
  const y = v1.y - v2.y;
  return Math.sqrt(x*x + y*y);
}

export const distance2 = (v1: Vector2, v2: Vector2) => {
  const x = v1.x - v2.x;
  const y = v1.y - v2.y;
  return x*x + y*y;
}

export const magnitude = (v1: Vector2) => {
  const x = v1.x;
  const y = v1.y;
  return Math.sqrt(x*x + y*y);
}

export const normalize = (out: Vector2, a: Vector2) => {
  const x = a.x;
  const y = a.y;
  let len = x*x + y*y;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    out.x = a.x * len;
    out.y = a.y * len;
  }
  return out;
}

/**
 * Compute the normal pointing away perpendicular from two vectors.
 * Given v1(0,0) -> v2(10, 0), the normal will be (0, 1)
 * */
export const normal = (out: Vector2, v1: Vector2, v2: Vector2) => {
  out.y = v2.x - v1.x;
  out.x = v1.y - v2.y;
  return normalize(out, out);
}

// the perpendicular dot product, also known as "cross" elsewhere
// http://stackoverflow.com/a/243977/169491
export const perpDot = (v1: Vector2, v2: Vector2) => {
  return v1.x * v2.y - v1.y * v2.x;
}

/**
 * This is mostly useful for moving a verlet-style [current, previous]
 * by the same amount, translating them while preserving velocity.
 * @param by the vector to add to each subsequent vector
 * @param vN any number of vectors to translate
 */
export const translate = (by: Vector2, ...vN: Vector2[]) => {
  for (let i = 0; i < vN.length; i++) {
    const v = vN[i];
    add(v, v, by);
  }
}