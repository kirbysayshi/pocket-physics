import v2 from './v2';

export default cmp => {
  const x = cmp.cpos.x*2 - cmp.ppos.x, y = cmp.cpos.y*2 - cmp.ppos.y;

  v2.set(cmp.ppos, cmp.cpos.x, cmp.cpos.y);
  v2.set(cmp.cpos, x, y);
};