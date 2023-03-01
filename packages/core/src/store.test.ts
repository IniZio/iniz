import { describe, expect, it } from "vitest";
import { atom } from "./atom";
import { effect } from "./effect";
import { isStore, store } from "./store";

describe("store", () => {
  it("should pass isStore", () => {
    expect(isStore(store({}))).toBeTruthy();
  });

  it("should return same store if passed again", () => {
    const a1 = store({});
    expect(a1).toBe(store(a1));
  });

  it("should reflect value assigned correctly", () => {
    const a1 = store({ value: 100 });

    expect(a1.value).toBe(100);

    const newValue = Math.random();
    a1.value = newValue;
    expect(a1.value).toBe(newValue);
  });

  it("should reject non-proxiable values", () => {
    expect(() => store(1 as any)).toThrow();
    expect(() => store("abc" as any)).toThrow();
    expect(() => store(new Map() as any)).toThrow();
    expect(() => store(new Set() as any)).toThrow();
    expect(() => store(new Date() as any)).toThrow();
  });

  it("should allow function to refer to store itself", () => {
    const a1 = store({
      value: {
        a: { b: 1 },
        inc() {
          this.a.b++;
        },
      },
    });
    expect(a1.value.a.b).toBe(1);
    a1.value.inc();
    a1.value.inc.bind(null)();
    expect(a1.value.a.b).toBe(3);
  });
});

describe("atom", () => {
  it("should pass isStore", () => {
    expect(isStore(atom({}))).toBeTruthy();
  });

  it("should return same atom if passed again", () => {
    const a1 = atom({ a: { b: { c: [{ d: 10 }] } } });
    const aa1 = atom(a1);
    expect(a1).toBe(aa1);
    expect(aa1().a.b.c[0].d).toBe(10);
  });

  it("should can apply on sub-path and trigger original atom updates", () => {
    const a1 = atom({ a: { b: { c: [{ d: 10 }] } } });
    expect(a1().a.b.c[0].d).toBe(10);
    const aa2 = atom(a1().a.b);
    expect(aa2().c[0].d).toBe(10);
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
    expect(p1()).toBe(newValue);
  });

  it("should auto-unwrap atom in atom", () => {
    const child = atom({ b: { c: 1 } });
    const parent = atom({
      a: child,
    });

    let parentEffectCount = -1;
    effect(() => {
      parent().a.b.c;
      parentEffectCount++;
    });

    let childEffectCount = -1;
    effect(() => {
      child().b.c;
      childEffectCount++;
    });

    child().b.c++;
    expect(childEffectCount).toBe(1);
    expect(parentEffectCount).toBe(1);
    expect(parent().a.b.c).toBe(2);

    parent().a.b.c++;
    expect(childEffectCount).toBe(2);
    expect(parentEffectCount).toBe(2);
    expect(parent().a.b.c).toBe(3);
  });
});

describe("isStore", () => {
  it("should not fail when passed weird values", () => {
    expect(() => isStore(undefined)).not.toThrow();
    expect(() => isStore(null)).not.toThrow();
  });
});
