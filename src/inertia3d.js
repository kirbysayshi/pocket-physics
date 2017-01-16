import { set } from './v3';

export default cmp => {
  const x = cmp.cpos.x*2 - cmp.ppos.x, y = cmp.cpos.y*2 - cmp.ppos.y, z = cmp.cpos.z*2 - cmp.ppos.z;

  set(cmp.ppos, cmp.cpos.x, cmp.cpos.y, cmp.cpos.z);
  set(cmp.cpos, x, y, z);
};