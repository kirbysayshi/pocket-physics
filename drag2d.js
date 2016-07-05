
export default (p1, drag) => {
  const x = (p1.ppos.x - p1.cpos.x) * drag;
  const y = (p1.ppos.y - p1.cpos.y) * drag;
  p1.ppos.x = p1.cpos.x + x;
  p1.ppos.y = p1.cpos.y + y;
};