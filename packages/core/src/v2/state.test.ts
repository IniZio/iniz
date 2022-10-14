import { describe, expect, it } from "vitest";
import { atomV2 } from "./atom";
import { isStateV2, stateV2 } from "./state";

describe("state", () => {
  it("should pass isState", () => {
    expect(isStateV2(stateV2({}))).toBeTruthy();
  });

  it("should return same state if passed again", () => {
    const a1 = stateV2({});
    expect(a1).toBe(stateV2(a1));
  });

  it("should reflect value assigned correctly", () => {
    const a1 = stateV2({ value: 100 });

    expect(a1.value).toBe(100);

    const newValue = Math.random();
    a1.value = newValue;
    expect(a1.value).toBe(newValue);
  });
});

describe("primitive", () => {
  it("should pass isState", () => {
    expect(isStateV2(atomV2({}))).toBeTruthy();
  });

  it("should return same primitive if passed again", () => {
    const a1 = atomV2(30);
    expect(a1).toBe(stateV2(a1));
  });

  it("should reflect value assigned correctly", () => {
    const p1 = atomV2(3);
    expect(p1.value).toBe(3);

    const newValue = Math.random();
    p1(newValue);
    expect(p1()).toBe(newValue);
  });
});

describe("isState", () => {
  it("should not fail when passed weird values", () => {
    expect(() => isStateV2(undefined)).not.toThrow();
    expect(() => isStateV2(null)).not.toThrow();
  });
});
