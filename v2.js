function v2(x, y) {
  return { x: x || 0, y: y || 0 }
}

v2.copy = function(out, a) {
  out.x = a.x;
  out.y = a.y;
  return out;
}

v2.set = function(out, x, y) {
  out.x = x;
  out.y = y;
  return out;
}

v2.add = function(out, a, b) {
  out.x = a.x + b.x;
  out.y = a.y + b.y;
  return out;
}

v2.sub = function(out, a, b) {
  out.x = a.x - b.x;
  out.y = a.y - b.y;
  return out;
}

v2.dot = function (a, b) {
  return a.x * b.x + a.y * b.y;
}

v2.scale = function(out, a, factor) {
  out.x = a.x * factor;
  out.y = a.y * factor;
  return out;
}

v2.distance = function(v1, v2) {
  var x = v1.x - v2.x;
  var y = v1.y - v2.y;
  return Math.sqrt(x*x + y*y);
}

v2.distance2 = function(v1, v2) {
  var x = v1.x - v2.x;
  var y = v1.y - v2.y;
  return x*x + y*y;
}

v2.magnitude = function(v1) {
  var x = v1.x;
  var y = v1.y;
  return Math.sqrt(x*x + y*y);
}

v2.normalize = function(out, a) {
  var x = a.x;
  var y = a.y;
  var len = x*x + y*y;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    out.x = a.x * len;
    out.y = a.y * len;
  }
  return out;
}

v2.normal = function (out, e1, e2) {
  out.y = e2.x - e1.x;
  out.x = e1.y - e2.y;
  return v2.normalize(out, out);
}

module.exports = v2;
