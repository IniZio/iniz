import { describe, expect, it } from "vitest";
import { atom } from "./atom";
import { effect } from "./effect";
import { ref } from "./ref";

describe("ref", () => {
  const a1 = atom({ untracked: ref(1), tracked: 1 });

  let untrackedEffectCount = -1;
  let trackedEffectCount = -1;
  effect(() => {
    a1.value.untracked;
    untrackedEffectCount++;
  });
  effect(() => {
    a1.value.tracked;
    trackedEffectCount++;
  });

  it("should not trigger effect on update ref", () => {
    expect(untrackedEffectCount).toBe(0);
    a1.value.untracked = 2;
    expect(untrackedEffectCount).toBe(0);
  });

  it("should still trigger effect for non-ref", () => {
    expect(trackedEffectCount).toBe(0);
    a1.value.tracked = 3;
    expect(trackedEffectCount).toBe(1);
  });
});
