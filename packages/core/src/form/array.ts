import { atom, Atom } from "../atom";
import { computed } from "../computed";
import { state } from "../state";
import { State } from "./../state";
import { field, FieldControl, FieldInstance, isFieldControl } from "./field";
import { group, GroupControl, GroupInstance, isGroupControl } from "./group";

export type ArrayInstance<
  TValue extends any[],
  TAA extends ArrayControl<TValue, any>["args"][0]
> = {
  value: TValue;
  setValue: (val: TValue) => void;
  controls: {
    [k in keyof TValue]: TAA extends FieldControl<any, any>
      ? FieldInstance<
          TValue[k],
          Exclude<TAA["args"][0]["validators"], undefined>
        >
      : TAA extends ArrayControl<any, any>
      ? ArrayInstance<TValue[k], TAA["args"][0]>
      : TAA extends GroupControl<any, any>
      ? GroupInstance<TValue[k], TAA["args"][0]>
      : never;
  };
  touchedFields: {
    [k in keyof TValue]: TAA extends FieldControl<any, any>
      ? FieldInstance<
          TValue[k],
          Exclude<TAA["args"][0]["validators"], undefined>
        >["touched"]
      : TAA extends ArrayControl<any, any>
      ? ArrayInstance<TValue[k], TAA["args"][0]>["touchedFields"]
      : TAA extends GroupControl<any, any>
      ? GroupInstance<TValue[k], TAA["args"][0]>["touchedFields"]
      : never;
  };
  fieldErrors: {
    [k in keyof TValue]: TAA extends FieldControl<any, any>
      ? FieldInstance<
          TValue[k],
          Exclude<TAA["args"][0]["validators"], undefined>
        >["errors"]
      : TAA extends ArrayControl<any, any>
      ? ArrayInstance<TValue[k], TAA["args"][0]>["fieldErrors"]
      : TAA extends GroupControl<any, any>
      ? GroupInstance<TValue[k], TAA["args"][0]>["fieldErrors"]
      : never;
  };
  hasError: boolean;
  touched: boolean;
  validate: () => Promise<void>;
  pending: boolean;
  markAsFresh: () => void;
  reset: () => void;
};

export function array<TValue extends any[], TA extends TArrayControlArgs0>(
  initialValue: TValue,
  arrayControl: TA
) {
  // @ts-ignore
  const controls: Atom<any[]> = atom(
    initialValue.map((v, index) =>
      isFieldControl(arrayControl)
        ? field(String(index), v, ...arrayControl.args)
        : // @ts-ignore
        isArrayControl(arrayControl)
        ? // @ts-ignore
          array(v, ...arrayControl.args)
        : // @ts-ignore
        isGroupControl(arrayControl)
        ? // @ts-ignore
          group(v, ...arrayControl.args)
        : null
    )
  );

  const value = computed(() => controls().map((control: any) => control.value));

  const setValue = (val: TValue) => {
    controls(
      val.map((v, index) =>
        isFieldControl(arrayControl)
          ? field(String(index), v, ...arrayControl.args)
          : isArrayControl(arrayControl)
          ? // @ts-ignore
            array(v, ...arrayControl.args)
          : isGroupControl(arrayControl)
          ? // @ts-ignore
            group(v, ...arrayControl.args)
          : null
      )
    );
  };

  const touchedFields = computed(() =>
    controls().map((control: any) => control.touchedFields ?? control.touched)
  );

  const fieldErrors = computed(() =>
    controls().map((control: any) => control.errors)
  );

  const hasError = computed(() =>
    controls().reduce(
      (hasError, control: any) => hasError || control.hasError,
      false
    )
  );

  const touched = computed(() =>
    controls().reduce(
      (touched, control: any) => touched || control.touched,
      false
    )
  );

  const pending = computed(() =>
    controls().reduce(
      (pending, control: any) => pending || control.pending,
      false
    )
  );

  function markAsFresh() {
    controls().forEach((control: any) => control.markAsFresh());
  }

  const reset = () => {
    setValue(initialValue);
    controls().forEach((control: any) => control.reset());
  };

  const validate = async () => {
    await Promise.all(controls().map((control: any) => control.validate()));
  };

  return state({
    value,
    setValue,
    controls,
    touchedFields,
    fieldErrors,
    hasError,
    touched,
    validate,
    pending,
    markAsFresh,
    reset,
  }) as State<ArrayInstance<TValue, TA>>;
}

const IS_ARRAY = Symbol.for("IS_ARRAY");

type TArrayControlArgs0 =
  | FieldControl<any, any>
  | ArrayControl<any, any>
  | GroupControl<any, any>;

export type ArrayControl<TValue, TACArgs0 extends TArrayControlArgs0> = {
  $$typeof: typeof IS_ARRAY;
  args: [TACArgs0];
};

export function isArrayControl(
  control: any
): control is ArrayControl<any, any> {
  return control.$$typeof === IS_ARRAY;
}

export function formArray<
  TValue extends any[],
  TArgs extends [TArrayControlArgs0]
>(...args: TArgs): ArrayControl<TValue, TArgs[0]> {
  return {
    $$typeof: IS_ARRAY,
    args,
  };
}
