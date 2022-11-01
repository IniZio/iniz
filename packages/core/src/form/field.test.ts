import { describe, expect, it } from "vitest";
import { field } from "./field";

describe("field", () => {
  it("should reflect setValue", () => {
    const email = field("email", "what@email.com");
    expect(email.value).toBe("what@email.com");
    email.setValue("another@email.com");
    expect(email.value).toBe("another@email.com");
  });

  it("should reset to initialValue", () => {
    const email = field("email", "what@email.com");
    email.setValue("another@email.com");
    expect(email.value).toBe("another@email.com");
    email.reset();
    expect(email.value).toBe("what@email.com");
  });

  it("should dirty on change value", () => {
    const email = field("email", "what@email.com");
    email.setValue("another@email.com");
    expect(email.dirty).toBe(false);
    email.setValue("thirdtime@email.com", { shouldDirty: true });
    expect(email.dirty).toBe(true);
    expect(email.touched).toBe(false);
    email.setValue("touch@email.com", { shouldTouch: true });
    expect(email.touched).toBe(true);
    expect(email.dirty).toBe(true);
  });

  it("should validate with different modes", () => {
    let email = field("", "", {
      validators: [() => ({ fail: true })],
      mode: "onTouched",
    });

    // onTouch
    email.setValue("1");
    expect(email.hasError).toBe(false);
    email.setValue("2", { shouldTouch: true });
    expect(email.hasError).toBe(true);

    // onBlur
    email = field("", "", {
      validators: [() => ({ fail: true })],
      mode: "onBlur",
    });
    email.setValue("1");
    expect(email.hasError).toBe(false);
    email.onBlur();
    expect(email.hasError).toBe(true);

    // onChange
    email = field("", "", {
      validators: [() => ({ fail: true })],
      mode: "onChange",
    });
    email.setValue("1");
    expect(email.hasError).toBe(true);
  });

  it("should validate with both sync and async", async () => {
    const email = field("", "", {
      validators: [
        () => ({ fail1: true }),
        () =>
          new Promise<{ fail2: boolean }>((res) => {
            setTimeout(() => res({ fail2: true } as const), 1000);
          }),
      ],
    });

    await email.validate();
    expect(email.errors.fail2).toBe(true);
    expect(email.errors.fail1).toBe(true);
  });

  it("should keep value and reset other status when markAsFresh", () => {
    const email = field("", "");

    email.setValue("abc", { shouldDirty: true, shouldTouch: true });
    expect(email.value).toBe("abc");
    expect(email.touched).toBe(true);
    expect(email.dirty).toBe(true);
    email.markAsFresh();
    expect(email.touched).toBe(false);
    expect(email.dirty).toBe(false);
    expect(email.value).toBe("abc");
  });
});
