import { describe, expect, it } from "vitest";
import { atom, isAtom } from "./atom";

describe("atom", () => {
  it("should pass isAtom", () => {
    expect(isAtom(atom(1))).toBeTruthy();
  });

  it("should return same atom if passed again", () => {
    const a1 = atom(2);
    expect(a1).toBe(atom(a1));
  });

  it("should reflect value assigned correctly", () => {
    const a1 = atom(100);

    expect(a1.value).toBe(100);

    const newValue = Math.random();
    a1.value = newValue;
    expect(a1.value).toBe(newValue);
  });
});

describe("isAtom", () => {
  it("should not fail when passed weird values", () => {
    expect(() => isAtom(undefined)).not.toThrow();
    expect(() => isAtom(null)).not.toThrow();
  });
});
