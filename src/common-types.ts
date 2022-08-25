import { Vector2 } from "./v2";

export type Integratable<T extends number = number> = {
  cpos: Vector2<T>;
  ppos: Vector2<T>;
  acel: Vector2<T>;
};
export type VelocityDerivable<T extends number = number> = Pick<
  Integratable<T>,
  "cpos" | "ppos"
>;
export type DeltaTimeMS = number;
