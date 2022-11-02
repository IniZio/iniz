import { atom, Atom } from "../atom";
import { computed } from "../computed";
import { state } from "../state";
import { State } from "./../state";
import { field, FieldControl, FieldInstance, isFieldControl } from "./field";
import { group, GroupControl, GroupInstance, isGroupControl } from "./group";

type ArrayOptions =
  | FieldControl<any, any>
  | ArrayControl<any, any>
  | GroupControl<any, any>;

export type ArrayInstance<TValue extends any[], TAA extends ArrayOptions> = {
  value: TValue;
  setValue: (
    val: TValue,
    options?: { shouldDirty?: boolean; shouldTouch?: boolean }
  ) => void;
  controls: {
    [k in keyof TValue]: TAA extends FieldControl<any, any>
      ? FieldInstance<TValue[k], TAA["arg"]>
      : TAA extends ArrayControl<any, any>
      ? ArrayInstance<TValue[k], TAA["arg"]>
      : TAA extends GroupControl<any, any>
      ? GroupInstance<TValue[k], TAA["arg"]>
      : never;
  };
  touchedFields: {
    [k in keyof TValue]: TAA extends FieldControl<any, any>
      ? FieldInstance<TValue[k], TAA["arg"]>["touched"]
      : TAA extends ArrayControl<any, any>
      ? ArrayInstance<TValue[k], TAA["arg"]>["touchedFields"]
      : TAA extends GroupControl<any, any>
      ? GroupInstance<TValue[k], TAA["arg"]>["touchedFields"]
      : never;
  };
  dirtyFields: {
    [k in keyof TValue]: TAA extends FieldControl<any, any>
      ? FieldInstance<TValue[k], TAA["arg"]>["dirty"]
      : TAA extends ArrayControl<any, any>
      ? ArrayInstance<TValue[k], TAA["arg"]>["dirtyFields"]
      : TAA extends GroupControl<any, any>
      ? GroupInstance<TValue[k], TAA["arg"]>["dirtyFields"]
      : never;
  };
  errors: {
    [k in keyof TValue]: TAA extends FieldControl<any, any>
      ? FieldInstance<TValue[k], TAA["arg"]>["errors"]
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

export function array<TValue extends any[], TA extends ArrayOptions>(
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

  const setValue = (
    val: TValue,
    {
      shouldDirty,
      shouldTouch,
    }: { shouldDirty?: boolean; shouldTouch?: boolean } = {}
  ) => {
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

    controls().forEach((control) => {
      control.setValue(control.value, { shouldDirty, shouldTouch });
    });
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

export type ArrayControl<TValue, TACArg extends ArrayOptions> = {
  $$typeof: typeof IS_ARRAY;
  arg: TACArg;
};

export function isArrayControl(
  control: any
): control is ArrayControl<any, any> {
  return control.$$typeof === IS_ARRAY;
}

export function formArray<TValue extends any[], TArg extends ArrayOptions>(
  arg: TArg
): ArrayControl<TValue, TArg> {
  return {
    $$typeof: IS_ARRAY,
    arg,
  };
}
