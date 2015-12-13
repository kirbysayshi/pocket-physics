module.exports = function (ax, ay, az, arad, bx, by, bz, brad) {
  var x = bx - ax;
  var y = by - ay;
  var z = bz - az;
  var rad = arad + brad;
  return x*x + y*y + z*z < rad*rad;
}