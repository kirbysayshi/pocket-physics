
module.exports = function(p1, drag) {
  var x = (p1.ppos.x - p1.cpos.x) * drag;
  var y = (p1.ppos.y - p1.cpos.y) * drag;
  p1.ppos.x = p1.cpos.x + x;
  p1.ppos.y = p1.cpos.y + y;
}