import { describe, expect, it } from "vitest";
import { atom } from "./atom";
import { batch } from "./batch";
import { computed } from "./computed";

describe("computed", () => {
  it("should update according to atoms", () => {
    const a1 = atom("abc");
    const a2 = atom(2);

    const c1 = computed(() => `${a1()} ${a2()}`);

    expect(c1()).toBe("abc 2");

    a1("bbb");

    expect(c1()).toBe("bbb 2");
  });

  it("should only update after batch", () => {
    const a1 = atom("abc");
    const a2 = atom(2);

    const c1 = computed(() => `${a1()} ${a2()}`);
    expect(c1()).toBe("abc 2");

    batch(() => {
      a1("xyz");
      a2(10);
      expect(c1()).toBe("abc 2");
    });

    expect(c1()).toBe("xyz 10");
  });

  // TODO: I am actually not sure how to fit this logic in yet lol
  it.todo("should forbidden updating", () => {
    const a1 = atom("abc");
    const a2 = atom(2);

    const c1 = computed(() => `${a1()} ${a2()}`);

    expect(() => c1("BCD")).toThrowError();
  });
});
