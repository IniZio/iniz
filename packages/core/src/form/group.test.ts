import { describe, expect, it } from "vitest";
import { form } from "./form";
import { group } from "./group";
import { validators } from "./validators";

describe("group", () => {
  it("should reflect setValue", () => {
    const signup = group(
      {
        contact: {
          email: "ABC",
        },
      },
      {
        contact: form.group({
          email: form.field({
            validators: [validators.minLength(5)],
            mode: "onBlur",
          }),
        }),
      }
    );

    signup.setValue({
      contact: {
        email: "BCD",
      },
    });
    expect(signup.value).toMatchObject({
      contact: {
        email: "BCD",
      },
    });
    expect(signup.controls.contact.controls.email.value).toBe("BCD");
  });

  it("should reflect field errors on validate", async () => {
    const signup = group(
      {
        contact: {
          email: "ABC",
        },
      },
      {
        contact: form.group({
          email: form.field({
            validators: [validators.minLength(5)],
            mode: "onBlur",
          }),
        }),
      }
    );

    await signup.validate();

    expect(signup.fieldErrors.contact.email).toMatchObject({
      minLength: { minLength: 5, actual: 3 },
    });
  });

  it("should reflect other field status", () => {
    const signup = group(
      {
        contact: {
          email: "ABC",
          phone: "111111111",
        },
      },
      {
        contact: form.group({
          email: form.field({
            validators: [validators.minLength(5)],
            mode: "onBlur",
          }),
          phone: form.field(),
        }),
      }
    );

    signup.controls.contact.controls.email.touched = true;
    signup.controls.contact.controls.phone.dirty = true;

    expect(signup.touchedFields).toMatchObject({
      contact: { email: true, phone: false },
    });
    expect(signup.dirtyFields).toMatchObject({
      contact: { email: false, phone: true },
    });
  });

  it("should perform other form actions on each field", () => {
    const signup = group(
      {
        contact: {
          email: "ABC",
          phone: "111111111",
        },
      },
      {
        contact: form.group({
          email: form.field({
            validators: [validators.minLength(5)],
            mode: "onBlur",
          }),
          phone: form.field(),
        }),
      }
    );

    signup.setValue(
      {
        contact: {
          email: "XYZ",
          phone: "99999999",
        },
      },
      {
        shouldTouch: true,
        shouldDirty: true,
      }
    );

    expect(signup.touchedFields).toMatchObject({
      contact: { email: true, phone: true },
    });
    expect(signup.dirtyFields).toMatchObject({
      contact: { email: true, phone: true },
    });

    signup.markAsFresh();
    expect(signup.touchedFields.contact.email).toBe(false);
    expect(signup.dirtyFields.contact.phone).toBe(false);
    expect(signup.controls.contact.controls.phone.value).toBe("99999999");

    signup.reset();
    expect(signup.controls.contact.controls.phone.value).toBe("111111111");
  });

  it("should wait for all validations before setting isValidating to false", async () => {
    const signup = group(
      {
        contact: {
          email: "ABC",
          phone: "111111111",
        },
      },
      {
        contact: form.group({
          email: form.field({
            validators: [validators.minLength(5)],
            mode: "onBlur",
          }),
          phone: form.field({
            validators: [() => Promise.resolve({ fail: 1 })],
          }),
        }),
      }
    );

    const validatePromise = signup.validate();
    expect(signup.isValidating).toBe(true);

    await validatePromise.then(() => {
      expect(signup.isValidating).toBe(false);
      expect(signup.fieldErrors.contact.email).toMatchObject({
        minLength: { minLength: 5, actual: 3 },
      });
      expect(signup.fieldErrors.contact.phone).toMatchObject({ fail: 1 });
    });
  });
});
