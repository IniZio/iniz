/** @jsxImportSource @iniz/react */

import { useSideEffect } from "@iniz/react";
import {
  field,
  Field,
  form,
  group,
  useForm,
  validators,
} from "@iniz/react/form";
import { useCallback } from "react";

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

const hobby = form.field();

const relative = form.group({
  phone: form.field({ validators: [validators.maxLength(10)] }),
});

export default function FormPage() {
  const profileForm = useForm(
    {
      firstname: "First",
      lastname: "Last",
      gender: "M",
      age: 1,
      contact: {
        email: "bcd@bbb.org",
      },
      hobbies: ["Sleeping", "Idling"],
      relatives: [{ phone: "1213123" }, { phone: "329234sfdasdfsss" }],
    },
    form.group({
      firstname: form.field(),
      lastname: form.field(),
      gender: form.field(),
      age: form.field({ validators: [validators.min(10)] }),
      contact: form.group({
        email: form.field({
          validators: [emailSuffixValidator("bcd.com")],
          mode: "onBlur",
        } as const),
      }),
      hobbies: form.array(hobby),
      relatives: form.array(relative),
    })
  );

  const onSubmit = () => {
    alert("Submitted Form");
  };

  useSideEffect(() => {
    console.log("=== profile form", JSON.stringify(profileForm.value));
  });

  const setValue = useCallback(() => {
    profileForm.setValue({
      firstname: "Harry",
      lastname: "Potter",
      gender: "F",
      age: 989,
      contact: {
        email: "bcd@bcd.com",
      },
      hobbies: ["Swimming"],
      relatives: [{ phone: "56456" }],
    });
  }, [profileForm]);

  return (
    <form onSubmit={profileForm.handleSubmit(onSubmit)}>
      <Field>
        {() => (
          <textarea
            value={JSON.stringify(profileForm.dirtyFields, null, 4)}
            rows={35}
            style={{ width: 400 }}
            readOnly
          ></textarea>
        )}
      </Field>
      {profileForm.isValidating ? "Validating..." : ""}
      <Field field={profileForm.controls.firstname}>
        {(field) => (
          <div>
            <input {...profileForm.register(field)} />
          </div>
        )}
      </Field>
      <Field field={profileForm.controls.lastname}>
        {(field) => (
          <div>
            <input {...profileForm.register(field)} />
          </div>
        )}
      </Field>
      <Field field={profileForm.controls.contact.controls.email}>
        {(field) => (
          <div>
            <input {...profileForm.register(field)} />
            {field.isValidating ? "Validating..." : ""}
            {field.errors.emailSuffix &&
              `Only email with domain '${field.errors.emailSuffix.suffix}' can signup`}
            <button type="button" onClick={field.validate}>
              Validate
            </button>
          </div>
        )}
      </Field>
      <Field field={profileForm.controls.gender}>
        {(field) => (
          <div>
            <select {...profileForm.register(field)}>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value={null}>Unspecified</option>
            </select>
          </div>
        )}
      </Field>
      <Field field={profileForm.controls.age}>
        {(field) => (
          <div>
            <input {...profileForm.register(field)} type="number" />
            <span>
              {field.errors.min &&
                `At lease ${field.errors.min.min} is needed but got ${field.errors.min.actual}`}
            </span>
            <button type="button" onClick={field.validate}>
              Validate
            </button>
          </div>
        )}
      </Field>
      {profileForm.controls.hobbies.touched ? "Touched" : "Not touched"}
      <Field field={profileForm.controls.hobbies}>
        {(fields) => (
          <div>
            {fields.controls.map((field, index) => (
              <div key={index}>
                <input {...profileForm.register(field)} />
                <button
                  type="button"
                  onClick={() => fields.controls.splice(index, 1)}
                >
                  -
                </button>
                {field.touched ? "Touched" : "Not touched"}
              </div>
            ))}
            <button
              type="button"
              onClick={() => fields.controls.push(field("hobby", "Eating", {}))}
            >
              + row
            </button>
          </div>
        )}
      </Field>
      {profileForm.controls.relatives.touched ? "Touched" : "Not touched"}
      <Field field={profileForm.controls.relatives}>
        {(fields) => (
          <div>
            {fields.controls.map((group, index) => (
              <div key={index}>
                <input {...profileForm.register(group.controls.phone)} />
                <span>
                  {group.controls.phone.errors.maxLength &&
                    `At most ${group.controls.phone.errors.maxLength.maxLength} is allowed but got ${group.controls.phone.errors.maxLength.actual}`}
                </span>
                <button
                  type="button"
                  onClick={() => fields.controls.splice(index, 1)}
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                fields.controls.push(group({ phone: "123" }, relative.arg))
              }
            >
              + row
            </button>
          </div>
        )}
      </Field>
      <button type="button" onClick={setValue}>
        Set value
      </button>
      <button type="button" onClick={profileForm.markAsFresh}>
        Mark as fresh
      </button>
      <button type="button" onClick={profileForm.reset}>
        Reset
      </button>
      <button type="button" onClick={profileForm.validate}>
        Validate
      </button>
      <button type="submit">Submit</button>
    </form>
  );
}
