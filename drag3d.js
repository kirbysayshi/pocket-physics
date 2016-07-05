
export default (p1, drag) => {
  const x = (p1.ppos.x - p1.cpos.x) * drag;
  const y = (p1.ppos.y - p1.cpos.y) * drag;
  const z = (p1.ppos.z - p1.cpos.z) * drag;
  p1.ppos.x = p1.cpos.x + x;
  p1.ppos.y = p1.cpos.y + y;
  p1.ppos.z = p1.cpos.z + z;
};