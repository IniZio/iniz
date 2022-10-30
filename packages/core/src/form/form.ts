import { atom } from "../atom";
import {
  array,
  ArrayControl,
  ArrayInstance,
  formArray,
  isArrayControl,
} from "./array";
import {
  field,
  FieldControl,
  FieldInstance,
  formField,
  isFieldControl,
} from "./field";
import {
  formGroup,
  group,
  GroupControl,
  GroupInstance,
  isGroupControl,
} from "./group";

type FormInstance<TValue, TControl> = (TControl extends FieldControl<any, any>
  ? FieldInstance<
      TValue,
      Exclude<TControl["args"][0]["syncValidators"], undefined>,
      Exclude<TControl["args"][0]["asyncValidators"], undefined>
    >
  : TControl extends GroupControl<any, any>
  ? GroupInstance<TValue, TControl["args"][0]>
  : TControl extends ArrayControl<any[], any>
  ? TValue extends any[]
    ? ArrayInstance<TValue, TControl["args"][0]>
    : never
  : never) & {
  isSubmitting: boolean;
  handleSubmit: <TFn extends (...args: any[]) => any>(
    onSubmit: TFn
  ) => (event?: any) => void;
};

function _form<
  TValue,
  TControl extends
    | FieldControl<any, any>
    | GroupControl<any, any>
    | ArrayControl<any, any>
>(initialValue: TValue, control: TControl): FormInstance<TValue, TControl> {
  const instance = isFieldControl(control)
    ? field("", initialValue, ...control.args)
    : // @ts-ignore
    isGroupControl(control)
    ? // @ts-ignore
      group(initialValue, ...control.args)
    : // @ts-ignore
    isArrayControl(control)
    ? // @ts-ignore
      array(initialValue, ...control.args)
    : null;

  if (instance === null) {
    throw Error("Invalid form control");
  }

  const isSubmitting = atom(false);

  const handleSubmit =
    <TFn extends (...args: any[]) => any>(onSubmit: TFn) =>
    async (event?: any) => {
      event?.preventDefault();

      await instance.validate();
      if (instance.hasError) return;

      isSubmitting(true);

      try {
        await onSubmit(instance.value);
      } finally {
        isSubmitting(false);
      }
    };

  return Object.assign(instance, {
    handleSubmit,
  }) as any;
}

export const form = Object.assign(_form, {
  field: formField,
  group: formGroup,
  array: formArray,
});
