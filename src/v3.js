export function v3 (x, y, z) {
  return { x: x || 0, y: y || 0, z: z || 0 }
}

export const copy = (out, a) => {
  out.x = a.x;
  out.y = a.y;
  out.z = a.z;
  return out;
}

export const set = (out, x, y, z) => {
  out.x = x;
  out.y = y;
  out.z = z;
  return out;
}

export const add = (out, a, b) => {
  out.x = a.x + b.x;
  out.y = a.y + b.y;
  out.z = a.z + b.z;
  return out;
}

export const sub = (out, a, b) => {
  out.x = a.x - b.x;
  out.y = a.y - b.y;
  out.z = a.z - b.z;
  return out;
}

export const scale = (out, a, factor) => {
  out.x = a.x * factor;
  out.y = a.y * factor;
  out.z = a.z * factor;
  return out;
}

export const distance = (v1, v2) => {
  const x = v1.x - v2.x;
  const y = v1.y - v2.y;
  const z = v1.z - v2.z;
  return Math.sqrt(x*x + y*y + z*z);
}

export const distance2 = v3.dot = (v1, v2) => {
  const x = v1.x - v2.x;
  const y = v1.y - v2.y;
  const z = v1.z - v2.z;
  return x*x + y*y + z*z;
}

export const magnitude = v1 => {
  const x = v1.x;
  const y = v1.y;
  const z = v1.z;
  return Math.sqrt(x*x + y*y + z*z);
}

export const normalize = (out, a) => {
  const x = a.x;
  const y = a.y;
  const z = a.z;
  let len = x*x + y*y + z*z;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    out.x = a.x * len;
    out.y = a.y * len;
    out.z = a.z * len;
  }
  return out;
}