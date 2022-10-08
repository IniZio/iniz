import { describe, expect, it } from "vitest";
import { atom } from "./atom";
import { effect } from "./effect";

describe("effect", () => {
  it("should call when included atom updates", () => {
    const a1 = atom("abc");
    const a2 = atom(2);
    const a3 = atom<string[]>([]);

    let effectCount = -1;
    let anotherEffectCount = -1;
    effect(() => {
      a1.value;
      a2.value;
      effectCount++;
    });
    effect(() => {
      a3.value[0];
      anotherEffectCount++;
    });

    expect(effectCount).toBe(0);
    a1.value = `xyz`;
    expect(effectCount).toBe(1);
    a2.value = 2.5;
    expect(effectCount).toBe(2);
    expect(anotherEffectCount).toBe(0);
    a3.value.push("bb");
    expect(effectCount).toBe(2);
    expect(anotherEffectCount).toBe(1);
    a3.value.push("cc");
    expect(anotherEffectCount).toBe(1);
  });
});
