var v3 = require('./v3');

module.exports = function(cmp) {
  var x = cmp.cpos.x*2 - cmp.ppos.x
    , y = cmp.cpos.y*2 - cmp.ppos.y
    , z = cmp.cpos.z*2 - cmp.ppos.z;

  v3.set(cmp.ppos, cmp.cpos.x, cmp.cpos.y, cmp.cpos.z);
  v3.set(cmp.cpos, x, y, z);
}