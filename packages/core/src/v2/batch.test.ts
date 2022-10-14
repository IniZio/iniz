import { describe, expect, it } from "vitest";
import { atomV2 } from "./atom";
import { batchV2 } from "./batch";
import { effectV2 } from "./effect";

describe("batch", () => {
  it("should plus/minus batch levels according to batch closure", () => {
    const a1 = atomV2("abc");
    const a2 = atomV2(2);

    // Start from -1 since effect executes once immediately
    let effectCount = -1;
    let effectValue;
    effectV2(() => {
      effectValue = a1.value + a2.value;
      effectCount++;
    });

    a1.value = `xyz`;
    a2.value = 2.5;

    expect(effectCount).toBe(2);
    expect(effectValue).toBe("xyz2.5");

    batchV2(() => {
      expect(effectCount).toBe(2);
      a1.value = `bcd`;
      a2.value = 3;
      expect(effectCount).toBe(2);
    });

    expect(effectValue).toBe("bcd3");
    expect(effectCount).toBe(3);
  });
});
