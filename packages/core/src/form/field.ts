import { atom } from "../atom";
import { computed } from "../computed";
import { State, state } from "../state";
import { ValidationErrors } from "./types";

type ExtractReturnTypes<T extends (((i: any) => any) | undefined)[]> = {
  [K in keyof T]: T[K] extends (i: any) => infer R ? Awaited<R> : never;
};

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

export type FieldOptions = {
  validators?: ((field: FieldInstance<any, any>) => any)[];
  mode?: "onChange" | "onBlur" | "onTouched" | "onSubmit" | "all";
};

export type FieldInstance<TValue, TOptions extends FieldOptions> = {
  name: string;
  value: TValue;
  setValue: (
    val: TValue,
    options?: { shouldDirty?: boolean; shouldTouch?: boolean }
  ) => void;
  touched: boolean;
  dirty: boolean;
  errors: ValidationErrors<TOptions["validators"]>;
  hasError: boolean;
  isValidating: boolean;
  validate: () => void;
  markAsFresh: () => void;
  reset: () => void;
  onBlur: () => void;
};

export function field<TValue extends any, TOptions extends FieldOptions>(
  name: string,
  initialValue?: TValue,
  { validators = [], mode = "onChange" }: TOptions = {} as any
) {
  let instance: State<FieldInstance<TValue, TOptions>>;

  const value = atom(initialValue);
  const touched = atom(false);
  const dirty = atom(false);
  const isValidating = atom(false);

  const errors = atom<ValidationErrors<TOptions["validators"]>>({} as any);
  const hasError = computed(() => Object.keys(errors()).length !== 0);

  function setValue(
    val: TValue,
    {
      shouldDirty,
      shouldTouch,
    }: { shouldDirty?: boolean; shouldTouch?: boolean } = {}
  ) {
    if (shouldDirty) dirty(true);
    if (shouldTouch) touched(true);

    value(val as any);

    if (touched() && mode === "onTouched") validate();
    if (mode === "onChange") validate();
    if (mode === "all") validate();
  }

  function onBlur() {
    touched(true);

    if (!touched() && mode === "onTouched") validate();
    if (mode === "onBlur") validate();
    if (mode === "all") validate();
  }

  let validationVersion = 0;
  function validate() {
    const version = ++validationVersion;

    const results = validators.map((v) => v(instance));
    if (!results.some((err) => typeof (err as any)?.then === "function")) {
      errors(
        results.reduce(
          (es, res) => ({ ...es, ...res }),
          {} as ValidationErrors<TOptions["validators"]>
        )
      );
      return;
    }

    isValidating(true);
    return Promise.all(results)
      .then((results) => {
        // Ensure only latest validation result is taken
        if (version < validationVersion) {
          return;
        }
        errors(
          results.reduce(
            (es, res) => ({ ...es, ...res }),
            {} as ValidationErrors<TOptions["validators"]>
          )
        );
      })
      .finally(() => {
        // Ensure only latest validation result is taken
        if (version < validationVersion) {
          return;
        }

        isValidating(false);
      });
  }

  function markAsFresh() {
    dirty(false);
    touched(false);
    errors({} as any);
  }

  instance = state({
    name,
    value,
    setValue,
    onBlur,

    touched,
    dirty,
    errors,
    hasError,
    isValidating,

    validate,
    markAsFresh,
    reset: () => {
      value(initialValue as any);
      markAsFresh();
    },
  }) as any;

  return instance;
}

const IS_FIELD = Symbol.for("IS_FIELD");

export type FieldControl<TValue, TFieldControlArg extends FieldOptions> = {
  $$typeof: typeof IS_FIELD;
  args: [TFieldControlArg | undefined];
};

export function isFieldControl(
  control: any
): control is FieldControl<any, any> {
  return control.$$typeof === IS_FIELD;
}

export function formField<TValue, TOptions extends FieldOptions>(
  options?: TOptions
): FieldControl<TValue, TOptions> {
  return {
    $$typeof: IS_FIELD,
    args: [options],
  };
}
