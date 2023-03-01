import { describe, expect, it } from "vitest";
import { atom } from "./atom";
import { effect } from "./effect";
import { store } from "./store";

describe("effect", () => {
  it("should call when included primitve updates", () => {
    const a1 = atom("abc");
    const a2 = atom(2);

    let effectCount = -1;
    effect(() => {
      a1();
      a2();
      effectCount++;
    });

    expect(effectCount).toBe(0);
    a1(`xyz`);
    expect(effectCount).toBe(1);
    a2(2.5);
    expect(effectCount).toBe(2);
  });

  it("should call when included store updates", () => {
    const a3 = store<string[]>([]);
    let anotherEffectCount = -1;

    effect(() => {
      a3[0];
      anotherEffectCount++;
    });

    a3.push("bb");
    expect(anotherEffectCount).toBe(1);
  });

  it("should call when deeply nested property updates", () => {
    const a3 = store({ a: { b: { c: [{ d: 1 }] } } });
    let deepEffectCount = -1;

    effect(() => {
      a3.a.b.c[0].d;
      deepEffectCount++;
    });

    a3.a.b.c[0].d++;
    expect(deepEffectCount).toBe(1);
  });

  it("should not call after disposed", () => {
    const a1 = atom("abc");

    let effectCount = -1;
    const dispose = effect(() => {
      a1();
      effectCount++;
    });

    expect(effectCount).toBe(0);
    a1(`xyz`);
    expect(effectCount).toBe(1);
    dispose();
    a1(`zyx`);
    expect(effectCount).toBe(1);
  });

  it("should not track dependency in reaction", () => {
    const a1 = atom("abc");
    const a2 = atom(100);

    let actionCount = -1;
    let reactionCount = -1;

    effect(
      () => {
        a1();
        actionCount++;
      },
      () => {
        a2(a2() + 1);
        reactionCount++;
      }
    );

    a1("xxx");
    expect(actionCount).toBe(1);
    expect(reactionCount).toBe(1);

    a2(3);
    expect(actionCount).toBe(1);
    expect(reactionCount).toBe(1);
  });
});
