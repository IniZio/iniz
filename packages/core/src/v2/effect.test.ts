import { describe, expect, it } from "vitest";
import { effectV2 } from "./effect";
import { primitiveV2 } from "./primitive";
import { stateV2 } from "./state";

describe("effect", () => {
  it("should call when included primitve updates", () => {
    const a1 = primitiveV2("abc");
    const a2 = primitiveV2(2);

    let effectCount = -1;
    effectV2(() => {
      a1.value;
      a2.value;
      effectCount++;
    });

    expect(effectCount).toBe(0);
    a1.value = `xyz`;
    expect(effectCount).toBe(1);
    a2.value = 2.5;
    expect(effectCount).toBe(2);
  });

  it("should call when included state updates", () => {
    const a3 = stateV2<string[]>([]);
    let anotherEffectCount = -1;

    effectV2(() => {
      a3[0];
      anotherEffectCount++;
    });

    a3.push("bb");
    expect(anotherEffectCount).toBe(1);
  });
});
