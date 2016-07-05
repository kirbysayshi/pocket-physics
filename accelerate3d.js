import v3 from './v3';

export default (cmp, dt) => {
  // apply acceleration to current position, convert dt to seconds
  cmp.cpos.x += cmp.acel.x * dt * dt * 0.001;
  cmp.cpos.y += cmp.acel.y * dt * dt * 0.001;
  cmp.cpos.z += cmp.acel.z * dt * dt * 0.001;

  // reset acceleration
  v3.set(cmp.acel, 0, 0, 0);
};