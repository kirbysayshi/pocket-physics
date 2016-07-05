function v2(x, y) {
  return { x: x || 0, y: y || 0 }
}

v2.copy = (out, a) => {
  out.x = a.x;
  out.y = a.y;
  return out;
}

v2.set = (out, x, y) => {
  out.x = x;
  out.y = y;
  return out;
}

v2.add = (out, a, b) => {
  out.x = a.x + b.x;
  out.y = a.y + b.y;
  return out;
}

v2.sub = (out, a, b) => {
  out.x = a.x - b.x;
  out.y = a.y - b.y;
  return out;
}

v2.dot = (a, b) => a.x * b.x + a.y * b.y

v2.scale = (out, a, factor) => {
  out.x = a.x * factor;
  out.y = a.y * factor;
  return out;
}

v2.distance = (v1, v2) => {
  const x = v1.x - v2.x;
  const y = v1.y - v2.y;
  return Math.sqrt(x*x + y*y);
}

v2.distance2 = (v1, v2) => {
  const x = v1.x - v2.x;
  const y = v1.y - v2.y;
  return x*x + y*y;
}

v2.magnitude = v1 => {
  const x = v1.x;
  const y = v1.y;
  return Math.sqrt(x*x + y*y);
}

v2.normalize = (out, a) => {
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

v2.normal = (out, e1, e2) => {
  out.y = e2.x - e1.x;
  out.x = e1.y - e2.y;
  return v2.normalize(out, out);
}

export default v2;
