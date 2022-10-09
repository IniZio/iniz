import { describe, expect, it } from "vitest";
import { atom } from "./atom";
import { effect } from "./effect";
import { ref } from "./ref";

describe("ref", () => {
  const a1 = atom({ untracked: ref({ count: 1 }), tracked: { count: 1 } });

  let untrackedEffectCount = -1;
  let trackedEffectCount = -1;
  effect(() => {
    a1.value.untracked;
    a1.value.untracked;
    untrackedEffectCount++;
  });
  effect(() => {
    a1.value.tracked.count;
    trackedEffectCount++;
  });

  it("should not trigger effect on update ref", () => {
    expect(untrackedEffectCount).toBe(0);
    a1.value.untracked.count = 2;
    expect(untrackedEffectCount).toBe(0);
  });

  it("should still trigger effect for non-ref", () => {
    expect(trackedEffectCount).toBe(0);
    a1.value.tracked.count = 3;
    expect(trackedEffectCount).toBe(1);
  });

  it("should trigger effect if the ref property is re-assigned", () => {
    expect(untrackedEffectCount).toBe(0);
    a1.value.untracked = ref({ count: 2 });
    expect(untrackedEffectCount).toBe(1);
  });

  // TODO: Currently observer paths is not reviewed on condition changes.
  it.todo("should regain reactivity once assigned non-ref", () => {
    expect(untrackedEffectCount).toBe(1);
    a1.value.untracked = { count: 3 };
    expect(untrackedEffectCount).toBe(2);
    a1.value.untracked.count = 4;
    expect(untrackedEffectCount).toBe(3);
  });
});
