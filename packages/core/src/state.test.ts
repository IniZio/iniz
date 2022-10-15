import { describe, expect, it } from "vitest";
import { atom } from "./atom";
import { effect } from "./effect";
import { isState, state } from "./state";

describe("state", () => {
  it("should pass isState", () => {
    expect(isState(state({}))).toBeTruthy();
  });

  it("should return same state if passed again", () => {
    const a1 = state({});
    expect(a1).toBe(state(a1));
  });

  it("should reflect value assigned correctly", () => {
    const a1 = state({ value: 100 });

    expect(a1.value).toBe(100);

    const newValue = Math.random();
    a1.value = newValue;
    expect(a1.value).toBe(newValue);
  });

  it("should reject non-proxiable values", () => {
    expect(() => state(1 as any)).toThrow();
    expect(() => state("abc" as any)).toThrow();
    expect(() => state(new Map() as any)).toThrow();
    expect(() => state(new Set() as any)).toThrow();
    expect(() => state(new Date() as any)).toThrow();
  });
});

describe("atom", () => {
  it("should pass isState", () => {
    expect(isState(atom({}))).toBeTruthy();
  });

  it("should return same atom if passed again", () => {
    const a1 = atom({ a: { b: { c: [{ d: 10 }] } } });
    const aa1 = atom(a1);
    expect(a1).toBe(aa1);
    expect(aa1.value.a.b.c[0].d).toBe(10);
  });

  it("should can apply on sub-path and trigger original atom updates", () => {
    const a1 = atom({ a: { b: { c: [{ d: 10 }] } } });
    expect(a1.value.a.b.c[0].d).toBe(10);
    const aa2 = atom(a1.value.a.b);
    expect(aa2.value.c[0].d).toBe(10);
    let effectCount = -1;
    effect(() => {
      a1().a.b.c[0].d;
      effectCount++;
    });
    expect(effectCount).toBe(0);
    aa2().c[0].d = 100;
    expect(a1().a.b.c[0].d).toBe(100);
    expect(effectCount).toBe(1);
  });

  it("should reflect value assigned correctly", () => {
    const p1 = atom(3);
    expect(p1()).toBe(3);

    const newValue = Math.random();
    p1(newValue);
    expect(p1.value).toBe(newValue);
  });
});

describe("isState", () => {
  it("should not fail when passed weird values", () => {
    expect(() => isState(undefined)).not.toThrow();
    expect(() => isState(null)).not.toThrow();
  });
});