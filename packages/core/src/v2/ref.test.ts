import { describe, expect, it } from "vitest";
import { effectV2 } from "./effect";
import { refV2 } from "./ref";
import { stateV2 } from "./state";

describe("ref", () => {
  const a1 = stateV2({ untracked: refV2({ count: 1 }), tracked: { count: 1 } });

  let untrackedEffectCount = -1;
  let trackedEffectCount = -1;
  effectV2(() => {
    a1.untracked.count;
    a1.untracked;
    untrackedEffectCount++;
  });
  effectV2(() => {
    a1.tracked.count;
    trackedEffectCount++;
  });

  it("should not trigger effect on update ref", () => {
    expect(untrackedEffectCount).toBe(0);
    a1.untracked.count = 2;
    expect(untrackedEffectCount).toBe(0);
  });

  it("should still trigger effect for non-ref", () => {
    expect(trackedEffectCount).toBe(0);
    a1.tracked.count = 3;
    expect(trackedEffectCount).toBe(1);
  });

  it("should trigger effect if the ref property is re-assigned", () => {
    expect(untrackedEffectCount).toBe(0);
    a1.untracked = refV2({ count: 2 });
    expect(untrackedEffectCount).toBe(1);
  });

  it("should regain reactivity once assigned non-ref", () => {
    expect(untrackedEffectCount).toBe(1);
    a1.untracked = { count: 3 };
    expect(untrackedEffectCount).toBe(2);
    a1.untracked.count = 4;
    expect(untrackedEffectCount).toBe(3);
  });
});
