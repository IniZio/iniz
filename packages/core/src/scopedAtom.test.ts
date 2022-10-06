import { describe, expect, it } from "vitest";
import { atom } from "./atom";
import { effect } from "./effect";
import { scopedAtom } from "./scopedAtom";

describe("scopedAtom", () => {
  let a2Notify = 0,
    a3Notify = 0;

  const a1 = atom({ a: { b: { c1: 10, c2: "abc", c3: { d: [] } } } });

  const a2 = scopedAtom(a1, { tilNextTick: true, onNotify: () => a2Notify++ });
  const a3 = scopedAtom(a2, { tilNextTick: true, onNotify: () => a3Notify++ });

  let effectCount = -1;
  effect(() => {
    a3.value.a.b.c2;
    effectCount++;
  });

  it("should scope updates ", () => {
    a3.value.a.b.c2 = "bcd";

    expect(a2.value.a.b.c2).toBe("bcd");
  });

  // TODO: In fact the atom should not be scoped at all.
  // The final result should be that a change will notify both activeObserver and that useAtom's marker,
  // other useAtoms of same atom will not get the onNotify triggered
  it.todo("should still trigger effect properly", () => {
    expect(effectCount).toBe(1);
    expect(a2Notify).toBe(0);
    expect(a3Notify).toBe(1);
  });
});
