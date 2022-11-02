import { describe, expect, it } from "vitest";
import { array } from "./array";
import { form } from "./form";
import { validators } from "./validators";

describe("array", () => {
  it("should reflect setValue", () => {
    const contacts = array(
      [{ phone: "1213123" }, { phone: "329234sfdasdfsss" }],
      form.group({
        phone: form.field({ validators: [validators.maxLength(10)] }),
      })
    );

    expect(contacts.controls[0].value.phone).toBe("1213123");
    contacts.setValue([
      { phone: "45dfg" },
      { phone: "329234sfdasdfsss" },
      { phone: "oioii" },
    ]);
    expect(contacts.controls[0].value.phone).toBe("45dfg");
    expect(contacts.controls[2].value.phone).toBe("oioii");
  });

  it("should reflect field errors on validate", async () => {
    const contacts = array(
      [{ phone: "1213123" }, { phone: "329234sfdasdfsss" }],
      form.group({
        phone: form.field({ validators: [validators.maxLength(10)] }),
      })
    );

    await contacts.validate();
    expect(contacts.fieldErrors[1].phone).toMatchObject({
      maxLength: { maxLength: 10, actual: 16 },
    });
  });

  it("should reflect other field status", () => {
    const contacts = array(
      [{ phone: "1213123" }, { phone: "329234sfdasdfsss" }],
      form.group({
        phone: form.field({ validators: [validators.maxLength(10)] }),
      })
    );

    contacts.controls[1].controls.phone.touched = true;
    contacts.controls[0].controls.phone.dirty = true;
    expect(contacts.touchedFields).toMatchObject([
      { phone: false },
      { phone: true },
    ]);
    expect(contacts.dirtyFields).toMatchObject([
      { phone: true },
      { phone: false },
    ]);
  });

  it("should perform other form actions on each field", () => {
    const contacts = array(
      [{ phone: "1213123" }, { phone: "329234sfdasdfsss" }],
      form.group({
        phone: form.field({ validators: [validators.maxLength(10)] }),
      })
    );

    contacts.setValue(
      [{ phone: "45dfg" }, { phone: "329234sfdasdfsss" }, { phone: "oioii" }],
      { shouldDirty: true, shouldTouch: true }
    );
    expect(contacts.touchedFields).toMatchObject([
      { phone: true },
      { phone: true },
      { phone: true },
    ]);
    expect(contacts.dirtyFields).toMatchObject([
      { phone: true },
      { phone: true },
      { phone: true },
    ]);

    contacts.markAsFresh();
    expect(contacts.controls[0].controls.phone.dirty).toBe(false);
    expect(contacts.controls[1].controls.phone.touched).toBe(false);
  });

  it("should wait for all validations before setting isValidating to false", async () => {
    const contacts = array(
      [{ phone: "1213123" }, { phone: "329234sfdasdfsss" }],
      form.group({
        phone: form.field({ validators: [validators.maxLength(10)] }),
        email: form.field({
          validators: [() => Promise.resolve({ fail: true })],
        }),
      })
    );

    const validatePromise = contacts.validate();
    expect(contacts.isValidating).toBe(true);

    await validatePromise.then(() => {
      expect(contacts.isValidating).toBe(false);
      expect(contacts.fieldErrors[0].email).toMatchObject({
        fail: true,
      });
      expect(contacts.fieldErrors[1].phone).toMatchObject({
        maxLength: { maxLength: 10, actual: 16 },
      });
    });
  });
});
