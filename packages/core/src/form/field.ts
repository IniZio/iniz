import { Atom, atom } from "../atom";
import { computed } from "../computed";
import { State, state } from "../state";

type ExtractReturnTypes<T extends (((i: any) => any) | undefined)[]> = {
  [K in keyof T]: T[K] extends (i: any) => infer R ? Awaited<R> : never;
};

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

export type FieldInstance<
  TValue,
  TValidators extends (((...arg: any) => any) | undefined)[]
> = {
  name: string;
  value?: TValue;
  setValue: (
    val: TValue,
    options?: { shouldDirty?: boolean; shouldTouch?: boolean }
  ) => void;
  touched: boolean;
  dirty: boolean;
  errors: UnionToIntersection<
    Exclude<ExtractReturnTypes<TValidators>[number], null | undefined>
  > extends infer O
    ? { [K in keyof O]?: O[K] | undefined }
    : never;
  hasError: boolean;
  isValidating: Atom<boolean>;
  validate: () => void;
  markAsFresh: () => void;
  reset: () => void;
  onBlur: () => void;
};

export function field<
  TValue extends any,
  TValidators extends ((...arg: any) => any)[]
>(
  name: string,
  initialValue?: TValue,
  {
    validators = [] as unknown as TValidators,
    mode = "onChange",
  }: {
    validators?: TValidators;
    mode?: "onChange" | "onBlur" | "onTouched" | "onSubmit" | "all";
  } = {}
) {
  const value = atom(initialValue);
  const touched = atom(false);
  const dirty = atom(false);
  const isValidating = atom(false);
  /**
   * Here we cast array of validators to object of all validation results
   * 1. ExtractReturnTypes to derive array of return types for all validators
   * 2. `[number]` to change the array to union type
   * 3. Exclude null | undefined to avoid the type become never
   * 4. UnionToIntersection to merge into intersection object
   */
  type ValidatorsReturnTypes = UnionToIntersection<
    Exclude<ExtractReturnTypes<TValidators>[number], null | undefined>
  > extends infer O
    ? { [K in keyof O]?: O[K] }
    : never;

  const errors = atom<ValidatorsReturnTypes>({} as any);
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

    const results = validators.map((v) => v({ value: value() }));
    if (!results.some((err) => typeof (err as any)?.then === "function")) {
      errors(
        results.reduce(
          (es, res) => ({ ...es, ...res }),
          {} as ValidatorsReturnTypes
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
            {} as ValidatorsReturnTypes
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

  return state({
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
  }) as State<FieldInstance<TValue, TValidators>>;
}

const IS_FIELD = Symbol.for("IS_FIELD");

export type FieldControl<
  TValue,
  TFieldControlArg extends Parameters<typeof field>[2]
> = {
  $$typeof: typeof IS_FIELD;
  arg?: TFieldControlArg;
};

export function isFieldControl(
  control: any
): control is FieldControl<any, any> {
  return control.$$typeof === IS_FIELD;
}

export function formField<TValue, TArg extends Parameters<typeof field>[2]>(
  arg?: TArg
): FieldControl<TValue, TArg> {
  return {
    $$typeof: IS_FIELD,
    arg,
  };
}
