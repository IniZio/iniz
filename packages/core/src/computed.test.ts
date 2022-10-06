import { describe, expect, it } from "vitest";
import { atom } from "./atom";
import { batch } from "./batch";
import { computed } from "./computed";

describe("computed", () => {
  it("should update according to atoms", () => {
    const a1 = atom("abc");
    const a2 = atom(2);

    const c1 = computed(() => `${a1.value} ${a2.value}`);

    expect(c1.value).toBe("abc 2");

    a1.value = "bbb";

    expect(c1.value).toBe("bbb 2");
  });

  it("should only update after batch", () => {
    const a1 = atom("abc");
    const a2 = atom(2);

    const c1 = computed(() => `${a1.value} ${a2.value}`);
    expect(c1.value).toBe("abc 2");

    batch(() => {
      a1.value = "xyz";
      a2.value = 10;
      expect(c1.value).toBe("abc 2");
    });

    expect(c1.value).toBe("xyz 10");
  });
});
