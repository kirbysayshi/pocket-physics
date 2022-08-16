import {
  add,
  copy,
  distance,
  distance2,
  dot,
  normal,
  normalize,
  perpDot,
  rotate2d,
  scale,
  sub,
  translate,
  v2,
  Vector2,
} from "./v2";

test("generics + nominal types", () => {
  type Millis = number & { _millis: true };
  type Nanos = number & { _nanos: true };

  const v0 = v2<Nanos>();
  const v1 = v2<Nanos>();
  const out = v2<Millis>();

  // @ts-expect-error
  add(out, v0, v1);

  // @ts-expect-error
  sub(out, v0, v1);

  // @ts-expect-error
  dot(v0, v2<Millis>());

  // @ts-expect-error
  copy(out, v1);

  const c: Vector2<Nanos> = copy(v2(), v1);
  const s: Vector2<Nanos> = sub(v2(), v0, v1);

  // @ts-expect-error
  scale(out, v0, 5);

  // @ts-expect-error
  distance(v1, v2<Millis>());

  // @ts-expect-error
  distance2(v1, v2<Millis>());

  // @ts-expect-error
  normalize(v1, v2<Millis>());

  // @ts-expect-error
  normal(out, v0, v1);

  // @ts-expect-error
  perpDot(v1, v2<Millis>());

  // @ts-expect-error
  translate(out, v0, v1);

  // @ts-expect-error
  rotate2d(out, v0, v1, Math.PI / 2);
});

test("rotate", () => {
  const out = v2();
  const origin = v2();
  const point = v2(1, 0);
  rotate2d(out, point, origin, Math.PI / 2);
  expect(out).toMatchInlineSnapshot(`
    Object {
      "x": 6.123233995736766e-17,
      "y": 1,
    }
  `);
});
