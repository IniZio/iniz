/** @jsxImportSource @iniz/react */

import { useSideEffect } from "@iniz/react";
import { Field, form, group, validators } from "@iniz/react/form";
import { useEffect, useState } from "react";

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
  phone: form.field("11111111", [validators.maxLength(10)]),
});

export default function FormPage() {
  const [profileForm] = useState(() =>
    group("register", {
      firstname: form.field("First"),
      lastname: form.field("Last"),
      gender: form.field("F"),
      age: form.field(1, [validators.min(10)], []),
      contact: form.group({
        email: form.field(
          "abc@abc.com",
          [],
          [emailSuffixValidator("bcd.com")],
          "onChange"
        ),
      }),
      relatives: form.array([relative, relative]),
    })
  );

  useSideEffect(() => {
    // console.log("=== profile form", JSON.stringify(profileForm.value));
  });

  useEffect(() => {
    // profileForm.value = {
    //   firstname: 'YOLO',
    //   lastname: 'Last',
    //   gender: 'M',
    //   age: 2,
    //   contact: {
    //     email: 'bcd@bcd.com'
    //   },
    //   relatives: [{ phone: '22222222' }]
    // }
    setTimeout(() => {
      profileForm.controls.age.value = 11;
    });
    console.log("=== profile form", profileForm.controls.age.value);
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
              onClick={() => fields.controls.push(group("", ...relative.args))}
            >
              + row
            </button>
          </div>
        )}
      </Field>
    </form>
  );
}
