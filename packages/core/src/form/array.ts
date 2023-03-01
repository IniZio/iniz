import { atom, Atom } from "../atom";
import { computed } from "../computed";
import { store } from "../store";
import { Store } from "../store";
import { field, FieldControl, FieldInstance, isFieldControl } from "./field";
import { group, GroupControl, GroupInstance, isGroupControl } from "./group";

export type ArrayOptions = {};

export type ArrayTemplate =
  | FieldControl<any, any>
  | ArrayControl<any, any, any>
  | GroupControl<any, any, any>;

export type ArrayInstance<
  TValue extends any[],
  TTemplate extends ArrayTemplate,
  TOptions extends ArrayOptions
> = {
  value: TValue;
  setValue: (
    val: TValue,
    options?: { shouldDirty?: boolean; shouldTouch?: boolean }
  ) => void;
  controls: {
    [k in keyof TValue]: TTemplate extends FieldControl<any, any>
      ? FieldInstance<TValue[k], TTemplate["args"][0]>
      : TTemplate extends ArrayControl<any, any, any>
      ? ArrayInstance<TValue[k], TTemplate["args"][0], TTemplate["args"][1]>
      : TTemplate extends GroupControl<any, any, any>
      ? GroupInstance<TValue[k], TTemplate["args"][0], TTemplate["args"][1]>
      : never;
  };
  touchedFields: {
    [k in keyof TValue]: TTemplate extends FieldControl<any, any>
      ? FieldInstance<TValue[k], TTemplate["args"][0]>["touched"]
      : TTemplate extends ArrayControl<any, any, any>
      ? ArrayInstance<
          TValue[k],
          TTemplate["args"][0],
          TTemplate["args"][1]
        >["touchedFields"]
      : TTemplate extends GroupControl<any, any, any>
      ? GroupInstance<
          TValue[k],
          TTemplate["args"][0],
          TTemplate["args"][1]
        >["touchedFields"]
      : never;
  };
  dirtyFields: {
    [k in keyof TValue]: TTemplate extends FieldControl<any, any>
      ? FieldInstance<TValue[k], TTemplate["args"][0]>["dirty"]
      : TTemplate extends ArrayControl<any, any, any>
      ? ArrayInstance<
          TValue[k],
          TTemplate["args"][0],
          TTemplate["args"][1]
        >["dirtyFields"]
      : TTemplate extends GroupControl<any, any, any>
      ? GroupInstance<
          TValue[k],
          TTemplate["args"][0],
          TTemplate["args"][1]
        >["dirtyFields"]
      : never;
  };
  fieldErrors: {
    [k in keyof TValue]: TTemplate extends FieldControl<any, any>
      ? FieldInstance<TValue[k], TTemplate["args"][0]>["errors"]
      : TTemplate extends ArrayControl<any, any, any>
      ? ArrayInstance<
          TValue[k],
          TTemplate["args"][0],
          TTemplate["args"][1]
        >["fieldErrors"]
      : TTemplate extends GroupControl<any, any, any>
      ? GroupInstance<
          TValue[k],
          TTemplate["args"][0],
          TTemplate["args"][1]
        >["fieldErrors"]
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

export function array<
  TValue extends any[],
  TTemplate extends ArrayTemplate,
  TOptions extends ArrayOptions
>(initialValue: TValue, template: TTemplate, _options?: TOptions) {
  const controls: Atom<any[]> = atom(
    // @ts-ignore
    initialValue.map((v, index) =>
      isFieldControl(template)
        ? field(String(index), v, ...template.args)
        : // @ts-ignore
        isArrayControl(template)
        ? // @ts-ignore
          array(v, ...template.args)
        : // @ts-ignore
        isGroupControl(template)
        ? // @ts-ignore
          group(v, ...template.args)
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
        isFieldControl(template)
          ? field(String(index), v, ...template.args)
          : isArrayControl(template)
          ? // @ts-ignore
            array(v, ...template.args)
          : isGroupControl(template)
          ? // @ts-ignore
            group(v, ...template.args)
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

  const fieldErrors = computed(() =>
    controls().map((control: any) => control.fieldErrors ?? control.errors)
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

  return store({
    value,
    setValue,
    controls,
    touchedFields,
    dirtyFields,
    fieldErrors,
    hasError,
    touched,
    dirty,
    validate,
    isValidating,
    markAsFresh,
    reset,
  }) as Store<ArrayInstance<TValue, TTemplate, TOptions>>;
}

const IS_ARRAY = Symbol.for("IS_ARRAY");

export type ArrayControl<
  TValue,
  TTemplate extends ArrayTemplate,
  TOptions extends ArrayOptions
> = {
  $$typeof: typeof IS_ARRAY;
  args: [TTemplate, TOptions | undefined];
};

export function isArrayControl(
  control: any
): control is ArrayControl<any, any, any> {
  return control.$$typeof === IS_ARRAY;
}

export function formArray<
  TValue extends any[],
  TTemplate extends ArrayTemplate,
  TOptions extends ArrayOptions
>(
  template: TTemplate,
  options?: TOptions
): ArrayControl<TValue, TTemplate, TOptions> {
  return {
    $$typeof: IS_ARRAY,
    args: [template, options],
  };
}
