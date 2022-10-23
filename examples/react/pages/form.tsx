/** @jsxImportSource @iniz/react */

import { useSideEffect } from "@iniz/react";
import { Field, form, group, validators } from "@iniz/react/form";
import { useCallback, useState } from "react";

function emailSuffixValidator(suffix: string) {
  return ({ value }: { value: string }) =>
    new Promise<{ emailSuffix: { suffix: string; actual: string } } | null>(
      (resolve) => {
        setTimeout(() => {
          resolve(
            !value.endsWith(suffix)
              ? { emailSuffix: { suffix, actual: value } }
              : null
          );
        }, 2000);
      }
    );
}

const relative = form.group({
  phone: form.field({ syncValidators: [validators.maxLength(10)] }),
});

export default function FormPage() {
  const [profileForm] = useState(() =>
    group(
      {
        firstname: "First",
        lastname: "Last",
        gender: "M",
        age: 10,
        contact: {
          email: "bcd@bcd.com",
        },
        relatives: [{ phone: "1213123" }],
      },
      {
        firstname: form.field({}),
        lastname: form.field({}),
        gender: form.field({}),
        age: form.field({ syncValidators: [validators.min(10)] }),
        contact: form.group({
          email: form.field({
            asyncValidators: [emailSuffixValidator("bcd.com")],
            mode: "onBlur",
          }),
        }),
        relatives: form.array([relative]),
      }
    )
  );

  useSideEffect(() => {
    console.log("=== profile form", JSON.stringify(profileForm.value));
  });

  const reset = useCallback(() => {
    profileForm.setValue({
      firstname: "First",
      lastname: "Last",
      gender: "M",
      age: 10,
      contact: {
        email: "bcd@bcd.com",
      },
      relatives: [{ phone: "1213123" }],
    });
  }, []);

  return (
    <form>
      <Field field={profileForm.controls.firstname}>
        {(field) => (
          <div>
            <input {...field.props} />
          </div>
        )}
      </Field>
      <Field field={profileForm.controls.lastname}>
        {(field) => (
          <div>
            <input {...field.props} />
          </div>
        )}
      </Field>
      <Field field={profileForm.controls.contact.controls.email}>
        {({ pending, touched, errors, props }) => (
          <div>
            <input {...props} />
            {pending ? "Validating..." : ""}
            {touched &&
              errors.emailSuffix &&
              `Only email with domain '${errors.emailSuffix.suffix}' can signup`}
          </div>
        )}
      </Field>
      <Field field={profileForm.controls.gender}>
        {(field) => (
          <div>
            <select {...field.props}>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value={null}>Unspecified</option>
            </select>
          </div>
        )}
      </Field>
      <Field field={profileForm.controls.age}>
        {({ touched, errors, props }) => (
          <div>
            <input {...props} type="number" />
            <span>
              {touched &&
                errors.min &&
                `At lease ${errors.min.min} is needed but got ${errors.min.actual}`}
            </span>
          </div>
        )}
      </Field>
      <Field field={profileForm.controls.relatives}>
        {(fields) => (
          <div>
            {fields.controls.map(
              (
                {
                  controls: {
                    phone: { touched, errors, props },
                  },
                },
                index
              ) => (
                <div key={index}>
                  <input {...props} />
                  <span>
                    {touched &&
                      errors.maxLength &&
                      `At most ${errors.maxLength.maxLength} is allowed but got ${errors.maxLength.actual}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => fields.controls.splice(index, 1)}
                  >
                    -
                  </button>
                </div>
              )
            )}
            <button
              type="button"
              onClick={() =>
                fields.controls.push(group({ phone: "123" }, ...relative.args))
              }
            >
              + row
            </button>
          </div>
        )}
      </Field>
      <button type="button" onClick={reset}>
        Reset
      </button>
    </form>
  );
}
