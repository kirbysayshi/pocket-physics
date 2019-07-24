import { set } from "./v2";
import { Integratable } from "./common-types";

export const inertia = (cmp: Integratable) => {
  const x = cmp.cpos.x * 2 - cmp.ppos.x;
  const y = cmp.cpos.y * 2 - cmp.ppos.y;

  set(cmp.ppos, cmp.cpos.x, cmp.cpos.y);
  set(cmp.cpos, x, y);
};
