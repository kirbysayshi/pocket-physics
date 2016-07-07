import { set, v2, } from './v2';

export default (
  pos1X, pos1Y, half1W, half1H,
  vel1X, vel1Y,
  pos2X, pos2Y, half2W, half2H,
  vel2X, vel2Y,
  result
) => {

  const min1X = pos1X - half1W;
  const min1Y = pos1Y - half1H;
  const max1X = pos1X + half1W;
  const max1Y = pos1Y + half1H;

  const min2X = pos2X - half2W;
  const min2Y = pos2Y - half2H;
  const max2X = pos2X + half2W;
  const max2Y = pos2Y + half2H;

  const topLeftX = min1X - max2X;
  const topLeftY = min1Y - max2Y;

  if (!result.hasOwnProperty('min')) result.min = v2();
  if (!result.hasOwnProperty('max')) result.max = v2();

  const fullSizeW = half1W*2 + half2W*2;
  const fullSizeH = half1H*2 + half2H*2;

  const fullCenterX = topLeftX + (fullSizeW / 2);
  const fullCenterY = topLeftY + (fullSizeH / 2);

  //set(result.min, topLeftX )
  //result.min = topLeftX
}