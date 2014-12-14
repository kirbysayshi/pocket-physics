function v3(x, y, z) {
  return { x: x || 0, y: y || 0, z: z || 0 }
}

v3.copy = function(out, a) {
  out.x = a.x;
  out.y = a.y;
  out.z = a.z;
  return out;
}

v3.set = function(out, x, y, z) {
  out.x = x;
  out.y = y;
  out.z = z;
  return out;
}

v3.add = function(out, a, b) {
  out.x = a.x + b.x;
  out.y = a.y + b.y;
  out.z = a.z + b.z;
  return out;
}

v3.sub = function(out, a, b) {
  out.x = a.x - b.x;
  out.y = a.y - b.y;
  out.z = a.z - b.z;
  return out;
}

v3.scale = function(out, a, factor) {
  out.x = a.x * factor;
  out.y = a.y * factor;
  out.z = a.z * factor;
  return out;
}

v3.distance = function(v1, v2) {
  var x = v1.x - v2.x;
  var y = v1.y - v2.y;
  var z = v1.z - v2.z;
  return Math.sqrt(x*x + y*y + z*z);
}

v3.distance2 = v3.dot = function(v1, v2) {
  var x = v1.x - v2.x;
  var y = v1.y - v2.y;
  var z = v1.z - v2.z;
  return x*x + y*y + z*z;
}

v3.magnitude = function(v1) {
  var x = v1.x;
  var y = v1.y;
  var z = v1.z;
  return Math.sqrt(x*x + y*y + z*z);
}

v3.normalize = function(out, a) {
  var x = a.x;
  var y = a.y;
  var z = a.z;
  var len = x*x + y*y + z*z;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    out.x = a.x * len;
    out.y = a.y * len;
    out.z = a.z * len;
  }
  return out;
}

module.exports = v3;