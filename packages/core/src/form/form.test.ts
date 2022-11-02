import { describe, expect, it } from "vitest";
import { form } from "./form";
import { validators } from "./validators";

describe("form", () => {
  it("only submit if valid", async () => {
    const contactForm = form(
      {
        contact: {
          email: "ABC",
        },
      },
      form.group({
        contact: form.group({
          email: form.field({
            validators: [validators.minLength(5)],
            mode: "onBlur",
          }),
          phone: form.field({
            validators: [
              ({ value }: { value: any }) =>
                Promise.resolve(value ? null : { fail: 1 }),
            ],
          }),
        }),
      })
    );

    let submitCount = 0;
    const onSubmit = () => {
      submitCount++;
    };

    await contactForm.handleSubmit(onSubmit)();
    expect(submitCount).toBe(0);

    contactForm.controls.contact.controls.email.setValue("AtLeast5characters");
    contactForm.controls.contact.controls.phone.setValue("SomeValue");
    await contactForm.handleSubmit(onSubmit)();
    expect(submitCount).toBe(1);

    contactForm.controls.contact.controls.phone.setValue("");
    await contactForm.handleSubmit(onSubmit)();
    expect(submitCount).toBe(1);
  });
});
