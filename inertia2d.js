import { set } from './v2';

export default cmp => {
  const x = cmp.cpos.x*2 - cmp.ppos.x, y = cmp.cpos.y*2 - cmp.ppos.y;

  set(cmp.ppos, cmp.cpos.x, cmp.cpos.y);
  set(cmp.cpos, x, y);
};