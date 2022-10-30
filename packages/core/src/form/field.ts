import { Atom, atom } from "../atom";
import { computed } from "../computed";
import { State, state } from "../state";

export const onChangeMap = (e: any) => {
  const tagName = e?.target?.tagName;
  if (tagName !== undefined) {
    e.persist();
  }

  if (tagName === "INPUT") {
    if (e.target.type === "checkbox" || e.target.type === "radio") {
      return e.target.checked;
    }
    if (e.target.type === "number") {
      return Number(e.target.value);
    }
    return e.target.value;
  }

  if (tagName === "SELECT") {
    const { target } = e;
    if (target.multiple) {
      const value = Array.from(target.options).reduce((acc, node) => {
        // @ts-ignore
        if (node.selected) {
          // @ts-ignore
          acc.push(node.value);
        }
        return acc;
      }, []);
      return value;
    }
    return e.target.value;
  }
  if (tagName !== undefined) {
    return e.target.value;
  }

  return e;
};

type ExtractReturnTypes<T extends readonly (((i: any) => any) | undefined)[]> =
  {
    [K in keyof T]: T[K] extends (i: any) => infer R ? Awaited<R> : never;
  };

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

export type FieldInstance<
  TValue,
  TSyncValidators extends readonly (((...args: any) => any) | undefined)[],
  TAsyncValidators extends readonly (
    | ((...args: any) => Promise<any>)
    | undefined
  )[]
> = {
  value?: TValue;
  setValue: (val: TValue) => void;
  touched: Atom<boolean>;
  errors: Atom<
    (UnionToIntersection<
      Exclude<ExtractReturnTypes<TSyncValidators>[number], null | undefined>
    > extends infer O
      ? { [K in keyof O]?: O[K] | undefined }
      : never) &
      (UnionToIntersection<
        Exclude<ExtractReturnTypes<TAsyncValidators>[number], null | undefined>
      > extends infer O
        ? { [K in keyof O]?: O[K] | undefined }
        : never)
  >;
  hasError: boolean;
  pending: Atom<boolean>;
  validate: () => void;
  markAsFresh: () => void;
  reset: () => void;
  props: {
    [x: string]: string | ((...args: any[]) => void);
    name: string;
    onBlur: () => void;
  };
};

export function field<
  TValue extends any,
  TSyncValidators extends readonly (((...args: any) => any) | undefined)[],
  TAsyncValidators extends readonly ((...args: any) => Promise<any>)[]
>(
  name: string,
  initialValue?: TValue,
  // TODO: Handle onSubmit
  {
    syncValidators = [] as unknown as TSyncValidators,
    asyncValidators = [] as unknown as TAsyncValidators,
    mode = "onChange",
    propName = "value",
    handlerName = "onChange",
    map = onChangeMap,
  }: {
    syncValidators?: TSyncValidators;
    asyncValidators?: TAsyncValidators;
    mode?: "onChange" | "onBlur" | "onTouched" | "all";
    propName?: string;
    handlerName?: string;
    map?: (...args: any[]) => any;
  } = {}
) {
  const value = atom(initialValue);
  const touched = atom(false);
  const pending = atom(false);
  /**
   * Here we cast array of validators to object of all validation results
   * 1. ExtractReturnTypes to derive array of return types for all validators
   * 2. `[number]` to change the array to union type
   * 3. Exclude null | undefined to avoid the type become never
   * 4. UnionToIntersection to merge into intersection object
   */
  type SyncValidatorsReturnTypes = UnionToIntersection<
    Exclude<ExtractReturnTypes<TSyncValidators>[number], null | undefined>
  > extends infer O
    ? { [K in keyof O]?: O[K] }
    : never;
  type AsyncValidatorsReturnTypes = UnionToIntersection<
    Exclude<ExtractReturnTypes<TAsyncValidators>[number], null | undefined>
  > extends infer O
    ? { [K in keyof O]?: O[K] }
    : never;

  const errors = atom<SyncValidatorsReturnTypes & AsyncValidatorsReturnTypes>(
    {} as any
  );
  const hasError = computed(() => Object.keys(errors()).length !== 0);

  let validationVersion = 0;
  function validate() {
    const version = ++validationVersion;

    errors({
      ...syncValidators.reduce(
        (es, v) => ({ ...es, ...v?.({ value: value() }) }),
        {} as SyncValidatorsReturnTypes
      ),
    } as any);
    if (asyncValidators.length === 0) return;

    pending(true);
    return Promise.all(asyncValidators.map((v) => v({ value: value() })))
      .then((results) => {
        // Ensure only latest validation result is taken
        if (version < validationVersion) {
          return;
        }
        errors({
          ...errors(),
          ...results.reduce(
            (es, res) => ({ ...es, ...res }),
            {} as AsyncValidatorsReturnTypes
          ),
        });
      })
      .finally(() => {
        // Ensure only latest validation result is taken
        if (version < validationVersion) {
          return;
        }

        pending(false);
      });
  }

  function markAsFresh() {
    touched(false);
    errors({} as any);
  }

  return state({
    value,
    setValue: ((val: any) => value(val)) as any,

    touched,
    errors,
    hasError,
    pending,

    validate,
    markAsFresh,
    reset: () => {
      value(initialValue as any);
      markAsFresh();
    },

    props: {
      name,
      [propName]: value,
      [handlerName]: (...args: any[]) => {
        value(map(...args));

        if (!touched() && mode === "onTouched") validate();
        if (mode === "onChange") validate();
        if (mode === "all") validate();

        touched(true);
      },
      onBlur: () => {
        if (mode === "onBlur") validate();
        if (mode === "all") validate();
      },
    },
  }) as State<FieldInstance<TValue, TSyncValidators, TAsyncValidators>>;
}

const IS_FIELD = Symbol.for("IS_FIELD");

export type FieldControl<
  TValue,
  TFieldControlArgs extends [Parameters<typeof field>[2]] | []
> = {
  $$typeof: typeof IS_FIELD;
  args: TFieldControlArgs;
};

export function isFieldControl(
  control: any
): control is FieldControl<any, any> {
  return control.$$typeof === IS_FIELD;
}

export function formField<
  TValue,
  TArgs extends [Parameters<typeof field>[2]] | []
>(...args: TArgs): FieldControl<TValue, TArgs> {
  return {
    $$typeof: IS_FIELD,
    args,
  };
}
