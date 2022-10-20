/** @jsxImportSource @iniz/react */

import { Field, group, validators } from "@iniz/react/form";
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
    group({
      firstname: group.field("First"),
      lastname: group.field("Last"),
      gender: group.field("F"),
      email: group.field(
        "abc@abc.com",
        [],
        [emailSuffixValidator("bcd.com")],
        "onChange"
      ),
      age: group.field(1, [validators.min(10)], [], "onChange"),
    })
  );

  return (
    <form>
      <Field field={profileForm.firstname}>
        {(field) => (
          <div>
            <input {...field.props} />
          </div>
        )}
      </Field>
      <Field field={profileForm.lastname}>
        {(field) => (
          <div>
            <input {...field.props} />
          </div>
        )}
      </Field>
      <Field field={profileForm.email}>
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
      <Field field={profileForm.gender}>
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
      <Field field={profileForm.age}>
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
