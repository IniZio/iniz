import { describe, expect, it } from "vitest";
import { validators } from "./validators";

describe("validator", () => {
  it("should validate min", () => {
    const validate = validators.min(10);

    expect(validate({ value: 11 })).toBeNull();
    expect(validate({ value: 9 })).toMatchObject({
      min: { min: 10, actual: 9 },
    });
  });

  it("should validate max", () => {
    const validate = validators.max(9);

    expect(validate({ value: 8 })).toBeNull();
    expect(validate({ value: 10 })).toMatchObject({
      max: { max: 9, actual: 10 },
    });
  });

  it("should validate minLength", () => {
    const validate = validators.minLength(4);

    expect(validate({ value: [1, 2, 3] })).toMatchObject({
      minLength: { minLength: 4, actual: 3 },
    });
    expect(validate({ value: [1, 3, 4, 5] })).toBeNull();
    // @ts-ignore
    expect(validate({ value: null })).toMatchObject({
      minLength: { minLength: 4, actual: 0 },
    });
    // @ts-ignore
    expect(validate({ value: undefined })).toMatchObject({
      minLength: { minLength: 4, actual: 0 },
    });
  });

  it("should validate maxLength", () => {
    const validate = validators.maxLength(3);

    expect(validate({ value: [1, 2, 3] })).toBeNull();
    expect(validate({ value: [1, 3, 4, 5] })).toMatchObject({
      maxLength: { maxLength: 3, actual: 4 },
    });
    expect(validate({ value: [] })).toBeNull();
    // @ts-ignore
    expect(validate({ value: null })).toBeNull();
    // @ts-ignore
    expect(validate({ value: undefined })).toBeNull();
  });

  it("should validate required", () => {
    const validate = validators.required();

    expect(validate({ value: null })).toMatchObject({ required: true });
    expect(validate({ value: undefined })).toMatchObject({ required: true });
    expect(validate({ value: [] })).toMatchObject({ required: true });
    expect(validate({ value: 1 })).toBeNull();
    expect(validate({ value: "" })).toBeNull();
    expect(validate({ value: "false" })).toBeNull();
  });

  it("should validate pattern", () => {
    const validate = validators.pattern(/a\d+bc/);

    expect(validate({ value: "a123bc" })).toBeNull();
    expect(validate({ value: "werwer" })).toMatchObject({ pattern: true });
    // @ts-ignore
    expect(validate({ value: 234 })).toMatchObject({ pattern: true });
    // @ts-ignore
    expect(validate({ value: null })).toMatchObject({ pattern: true });
    // @ts-ignore
    expect(validate({ value: undefined })).toMatchObject({ pattern: true });
  });
});
