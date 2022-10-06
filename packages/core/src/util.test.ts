import { describe, expect, it } from "vitest";
import { canProxy } from "./util";

describe("isProxy", () => {
  it("should return false for primitives", () => {
    expect(canProxy(1)).toBeFalsy();
    expect(canProxy("abc")).toBeFalsy();
    expect(canProxy(/w+/)).toBeFalsy();
    expect(canProxy(new ArrayBuffer(1))).toBeFalsy();
  });

  it("should return false for class", () => {
    expect(canProxy(class {})).toBeFalsy();
  });

  it("should return true for trackable types", () => {
    expect(canProxy({})).toBeTruthy();
    expect(canProxy([])).toBeTruthy();
    expect(canProxy({ a: { b: [{ c: "1" }] } })).toBeTruthy();
  });

  it.todo("should accept Map/Set", () => {
    expect(canProxy(new Map())).toBeTruthy();
    expect(canProxy(new Set())).toBeTruthy();
    expect(canProxy(new WeakMap())).toBeTruthy();
    expect(canProxy(new WeakSet())).toBeTruthy();
  });
});
