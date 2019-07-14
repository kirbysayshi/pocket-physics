import { Vector2 } from "./v2";

export type Integratable = { cpos: Vector2; ppos: Vector2; acel: Vector2; };
export type VelocityDerivable = Pick<Integratable, 'cpos' | 'ppos'>;
export type DeltaTimeMS = number;
