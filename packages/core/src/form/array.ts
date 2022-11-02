import { atom, Atom } from "../atom";
import { computed } from "../computed";
import { state } from "../state";
import { State } from "./../state";
import { field, FieldControl, FieldInstance, isFieldControl } from "./field";
import { group, GroupControl, GroupInstance, isGroupControl } from "./group";

export type ArrayInstance<
  TValue extends any[],
  TAA extends ArrayControl<TValue, any>["arg"]
> = {
  value: TValue;
  setValue: (val: TValue) => void;
  controls: {
    [k in keyof TValue]: TAA extends FieldControl<any, any>
      ? FieldInstance<TValue[k], Exclude<TAA["arg"]["validators"], undefined>>
      : TAA extends ArrayControl<any, any>
      ? ArrayInstance<TValue[k], TAA["arg"]>
      : TAA extends GroupControl<any, any>
      ? GroupInstance<TValue[k], TAA["arg"]>
      : never;
  };
  touchedFields: {
    [k in keyof TValue]: TAA extends FieldControl<any, any>
      ? FieldInstance<
          TValue[k],
          Exclude<TAA["arg"]["validators"], undefined>
        >["touched"]
      : TAA extends ArrayControl<any, any>
      ? ArrayInstance<TValue[k], TAA["arg"]>["touchedFields"]
      : TAA extends GroupControl<any, any>
      ? GroupInstance<TValue[k], TAA["arg"]>["touchedFields"]
      : never;
  };
  dirtyFields: {
    [k in keyof TValue]: TAA extends FieldControl<any, any>
      ? FieldInstance<
          TValue[k],
          Exclude<TAA["arg"]["validators"], undefined>
        >["dirty"]
      : TAA extends ArrayControl<any, any>
      ? ArrayInstance<TValue[k], TAA["arg"]>["dirtyFields"]
      : TAA extends GroupControl<any, any>
      ? GroupInstance<TValue[k], TAA["arg"]>["dirtyFields"]
      : never;
  };
  errors: {
    [k in keyof TValue]: TAA extends FieldControl<any, any>
      ? FieldInstance<
          TValue[k],
          Exclude<TAA["arg"]["validators"], undefined>
        >["errors"]
      : TAA extends ArrayControl<any, any>
      ? ArrayInstance<TValue[k], TAA["arg"]>["errors"]
      : TAA extends GroupControl<any, any>
      ? GroupInstance<TValue[k], TAA["arg"]>["errors"]
      : never;
  };
  hasError: boolean;
  touched: boolean;
  dirty: boolean;
  validate: () => Promise<void>;
  isValidating: boolean;
  markAsFresh: () => void;
  reset: () => void;
};

export function array<TValue extends any[], TA extends TArrayControlArg>(
  initialValue: TValue,
  arrayControl: TA
) {
  const controls: Atom<any[]> = atom(
    // @ts-ignore
    initialValue.map((v, index) =>
      isFieldControl(arrayControl)
        ? field(String(index), v, arrayControl.arg)
        : // @ts-ignore
        isArrayControl(arrayControl)
        ? // @ts-ignore
          array(v, arrayControl.arg)
        : // @ts-ignore
        isGroupControl(arrayControl)
        ? // @ts-ignore
          group(v, arrayControl.arg)
        : null
    )
  );

  const value = computed(() => controls().map((control: any) => control.value));

  const setValue = (val: TValue) => {
    controls(
      val.map((v, index) =>
        isFieldControl(arrayControl)
          ? field(String(index), v, arrayControl.arg)
          : isArrayControl(arrayControl)
          ? // @ts-ignore
            array(v, arrayControl.arg)
          : isGroupControl(arrayControl)
          ? // @ts-ignore
            group(v, arrayControl.arg)
          : null
      )
    );
  };

  const touchedFields = computed(() =>
    controls().map((control: any) => control.touchedFields ?? control.touched)
  );

  const dirtyFields = computed(() =>
    controls().map((control: any) => control.dirtyFields ?? control.dirty)
  );

  const errors = computed(() =>
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

  const dirty = computed(() =>
    controls().reduce((dirty, control: any) => dirty || control.dirty, false)
  );

  const isValidating = computed(() =>
    controls().reduce(
      (isValidating, control: any) => isValidating || control.isValidating,
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
    dirtyFields,
    errors,
    hasError,
    touched,
    dirty,
    validate,
    isValidating,
    markAsFresh,
    reset,
  }) as State<ArrayInstance<TValue, TA>>;
}

const IS_ARRAY = Symbol.for("IS_ARRAY");

type TArrayControlArg =
  | FieldControl<any, any>
  | ArrayControl<any, any>
  | GroupControl<any, any>;

export type ArrayControl<TValue, TACArg extends TArrayControlArg> = {
  $$typeof: typeof IS_ARRAY;
  arg: TACArg;
};

export function isArrayControl(
  control: any
): control is ArrayControl<any, any> {
  return control.$$typeof === IS_ARRAY;
}

export function formArray<TValue extends any[], TArg extends TArrayControlArg>(
  arg: TArg
): ArrayControl<TValue, TArg> {
  return {
    $$typeof: IS_ARRAY,
    arg,
  };
}
