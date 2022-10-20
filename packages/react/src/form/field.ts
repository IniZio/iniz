import { atom } from "@iniz/core";

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

type ExtractReturnTypes<T extends readonly ((i: any) => any)[]> = {
  [K in keyof T]: T[K] extends (i: any) => infer R ? Awaited<R> : never;
};

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

export function field<
  TValue,
  TSyncValidators extends readonly ((...args: any) => any)[],
  TAsyncValidators extends readonly ((...args: any) => Promise<any>)[]
>(
  name: string,
  initialValue?: TValue,
  syncValidators: TSyncValidators = [] as any,
  asyncValidators: TAsyncValidators = [] as any,
  // TODO: Handle onSubmit
  mode: "onChange" | "onBlur" | "onTouched" | "all" = "onChange",
  {
    propName = "value",
    handlerName = "onChange",
    map = onChangeMap,
  }: {
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

  let validationVersion = 0;
  const validate = () => {
    const version = ++validationVersion;
    pending(true);

    try {
      errors({
        ...syncValidators.reduce(
          (es, v) => ({ ...es, ...v({ value: value() }) }),
          {} as SyncValidatorsReturnTypes
        ),
      } as any);

      if (asyncValidators.length === 0) {
        pending(false);
        return;
      }
    } catch {
      pending(false);
    }

    Promise.all(asyncValidators.map((v) => v({ value: value() })))
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
        pending(false);
      });
  };

  return atom({
    touched,
    errors,
    pending,

    reset: () => {
      value(initialValue as any);
      touched(false);
    },

    props: atom({
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
    }),
  });
}
