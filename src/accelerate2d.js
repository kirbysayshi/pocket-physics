import { set } from './v2';

export default (cmp, dt) => {
  // apply acceleration to current position, convert dt to seconds
  cmp.cpos.x += cmp.acel.x * dt * dt * 0.001;
  cmp.cpos.y += cmp.acel.y * dt * dt * 0.001;

  // reset acceleration
  set(cmp.acel, 0, 0);
};