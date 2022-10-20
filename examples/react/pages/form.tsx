/** @jsxImportSource @iniz/react */

import { atom } from "@iniz/react";
import { field, Field, validators } from "@iniz/react/form";
import { useState } from "react";

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

export default function FormPage() {
  const [profileForm] = useState(() =>
    atom({
      controls: {
        firstname: field("firstname", "First"),
        lastname: field("lastname", "Last"),
        gender: field("gender", "F"),
        email: field(
          "email",
          "abc@abc.com",
          [],
          [emailSuffixValidator("bcd.com")],
          "onChange"
        ),
        age: field("age", 1, [validators.min(10)], [], "onChange"),
      },
    })()
  );

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
      <Field field={profileForm.controls.email}>
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
    </form>
  );
}
