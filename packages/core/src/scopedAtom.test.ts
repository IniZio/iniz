import { describe, expect, it } from "vitest";
import { atom } from "./atom";
import { effect } from "./effect";
import { scopedAtom } from "./scopedAtom";

describe("scopedAtom", () => {
  let a2Notify = 0;
  let a3Notify = 0;

  const a1 = atom({ a: { b: { c1: 10, c2: "abc", c3: { d: [] } } } });

  const a2 = scopedAtom(a1, { onNotify: () => a2Notify++ });
  const a3 = scopedAtom(a2, { onNotify: () => a3Notify++ });

  let a1EffectCount = -1;
  let a3EffectCount = -1;
  effect(() => {
    a3.value.a.b.c2;
    a3EffectCount++;
  });
  effect(() => {
    a1.value.a.b.c2;
    a1EffectCount++;
  });

  a3.value.a.b.c2 = "bcd";

  it("should scope updates ", () => {
    expect(a2Notify).toBe(0);
    expect(a3Notify).toBe(1);
  });

  it("should still trigger effect properly", () => {
    expect(a1EffectCount).toBe(1);
    expect(a3EffectCount).toBe(1);
  });
});
