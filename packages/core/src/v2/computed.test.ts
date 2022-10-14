import { describe, expect, it } from "vitest";
import { atomV2 } from "./atom";
import { batchV2 } from "./batch";
import { computedV2 } from "./computed";

describe("computed", () => {
  it("should update according to atoms", () => {
    const a1 = atomV2("abc");
    const a2 = atomV2(2);

    const c1 = computedV2(() => `${a1.value} ${a2.value}`);

    expect(c1.value).toBe("abc 2");

    a1.value = "bbb";

    expect(c1.value).toBe("bbb 2");
  });

  it("should only update after batch", () => {
    const a1 = atomV2("abc");
    const a2 = atomV2(2);

    const c1 = computedV2(() => `${a1.value} ${a2.value}`);
    expect(c1.value).toBe("abc 2");

    batchV2(() => {
      a1.value = "xyz";
      a2.value = 10;
      expect(c1.value).toBe("abc 2");
    });

    expect(c1.value).toBe("xyz 10");
  });

  // TODO: I am actually not sure how to fit this logic in yet lol
  it.todo("should forbidden updating", () => {
    const a1 = atomV2("abc");
    const a2 = atomV2(2);

    const c1 = computedV2(() => `${a1.value} ${a2.value}`);

    expect(() => (c1.value = "BCD")).toThrowError();
  });
});
