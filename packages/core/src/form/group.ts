import { Atom, atom } from "../atom";
import { computed } from "../computed";
import { effect } from "../effect";
import { State, state } from "../state";
import { array, ArrayControl, ArrayInstance, isArrayControl } from "./array";
import { field, FieldControl, FieldInstance, isFieldControl } from "./field";
import { ValidationErrors } from "./types";

export type GroupOptions = {
  validators?: ((group: GroupInstance<any, any, any>) => any)[];
};

export type GroupChildren = {
  [index: string]:
    | FieldControl<any, any>
    | ArrayControl<any, any, any>
    | GroupControl<any, any, any>;
};

export type GroupInstance<
  TValue extends Record<keyof TChildren, any>,
  TChildren extends GroupChildren,
  TOptions extends GroupOptions
> = {
  value: {
    [k in keyof TChildren]: TChildren[k] extends FieldControl<any, any>
      ? FieldInstance<TValue[k], TChildren[k]["args"][0]>["value"]
      : TChildren[k] extends GroupControl<any, any, any>
      ? GroupInstance<
          TValue[k],
          TChildren[k]["args"][0],
          TChildren[k]["args"][1]
        >["value"]
      : TChildren[k] extends ArrayControl<any, any, any>
      ? ArrayInstance<
          TValue[k],
          TChildren[k]["args"][0],
          TChildren[k]["args"][1]
        >["value"]
      : never;
  };
  errors: ValidationErrors<TOptions["validators"]>;
  setValue: (
    val: TValue,
    options?: { shouldDirty?: boolean; shouldTouch?: boolean }
  ) => void;
  controls: {
    [k in keyof TChildren]: TChildren[k] extends FieldControl<any, any>
      ? FieldInstance<TValue[k], TChildren[k]["args"][0]>
      : TChildren[k] extends GroupControl<any, any, any>
      ? GroupInstance<
          TValue[k],
          TChildren[k]["args"][0],
          TChildren[k]["args"][1]
        >
      : TChildren[k] extends ArrayControl<any, any, any>
      ? ArrayInstance<
          TValue[k],
          TChildren[k]["args"][0],
          TChildren[k]["args"][1]
        >
      : never;
  };
  touchedFields: {
    [k in keyof TChildren]: TChildren[k] extends FieldControl<any, any>
      ? FieldInstance<TValue[k], TChildren[k]["args"][0]>["touched"]
      : TChildren[k] extends GroupControl<any, any, any>
      ? GroupInstance<
          TValue[k],
          TChildren[k]["args"][0],
          TChildren[k]["args"][1]
        >["touchedFields"]
      : TChildren[k] extends ArrayControl<any, any, any>
      ? ArrayInstance<
          TValue[k],
          TChildren[k]["args"][0],
          TChildren[k]["args"][1]
        >["touchedFields"]
      : never;
  };
  dirtyFields: {
    [k in keyof TChildren]: TChildren[k] extends FieldControl<any, any>
      ? FieldInstance<TValue[k], TChildren[k]["args"][0]>["dirty"]
      : TChildren[k] extends GroupControl<any, any, any>
      ? GroupInstance<
          TValue[k],
          TChildren[k]["args"][0],
          TChildren[k]["args"][1]
        >["dirtyFields"]
      : TChildren[k] extends ArrayControl<any, any, any>
      ? ArrayInstance<
          TValue[k],
          TChildren[k]["args"][0],
          TChildren[k]["args"][1]
        >["dirtyFields"]
      : never;
  };
  fieldErrors: {
    [k in keyof TChildren]: TChildren[k] extends FieldControl<any, any>
      ? FieldInstance<TValue[k], TChildren[k]["args"][0]>["errors"]
      : TChildren[k] extends GroupControl<any, any, any>
      ? GroupInstance<
          TValue[k],
          TChildren[k]["args"][0],
          TChildren[k]["args"][1]
        >["fieldErrors"]
      : TChildren[k] extends ArrayControl<any, any, any>
      ? ArrayInstance<
          TValue[k],
          TChildren[k]["args"][0],
          TChildren[k]["args"][1]
        >["fieldErrors"]
      : never;
  };
  hasError: boolean;
  touched: boolean;
  dirty: boolean;
  isValidating: boolean;
  validate: () => Promise<void>;
  markAsFresh: () => void;
  reset: () => void;
};

export function group<
  TValue extends Record<keyof TChildren, any>,
  TChildren extends GroupChildren,
  TOptions extends GroupOptions
>(initialValue: TValue, children: TChildren, options?: TOptions) {
  let instance: State<GroupInstance<TValue, TChildren, TOptions>>;

  const controls: Atom<Record<any, any>> = atom(
    Object.entries(children).reduce(
      // @ts-ignore
      (acc, [name, control]) => ({
        ...acc,
        [name]: isFieldControl(control)
          ? field(name, initialValue[name], ...control.args)
          : // @ts-ignore
          isGroupControl(control)
          ? // @ts-ignore
            group(initialValue[name], ...control.args)
          : // @ts-ignore
          isArrayControl(control)
          ? // @ts-ignore
            array(initialValue[name], ...control.args)
          : null,
      }),
      {}
    )
  );

  const value = computed(() =>
    Object.entries(controls()).reduce(
      (acc, [name, control]) => ({
        ...acc,
        [name]: control.value,
      }),
      {}
    )
  );

  const touchedFields = computed(() =>
    Object.entries(controls()).reduce(
      (acc, [name, control]) => ({
        ...acc,
        [name]: control.touchedFields ?? control.touched,
      }),
      {}
    )
  );

  const dirtyFields = computed(() =>
    Object.entries(controls()).reduce(
      (acc, [name, control]) => ({
        ...acc,
        [name]: control.dirtyFields ?? control.dirty,
      }),
      {}
    )
  );

  const fieldErrors = computed(() =>
    Object.entries(controls()).reduce(
      (acc, [name, control]) => ({
        ...acc,
        [name]: control.fieldErrors ?? control.errors,
      }),
      {}
    )
  );

  const errors = atom<ValidationErrors<TOptions["validators"]>>({} as any);
  const hasError = computed(() =>
    Object.entries(controls()).reduce(
      (hasError, [name, control]) => hasError || control.hasError,
      Object.keys(errors()).length !== 0
    )
  );

  const touched = computed(() =>
    Object.entries(controls()).reduce(
      (touched, [name, control]) => touched || control.touched,
      false
    )
  );

  const dirty = computed(() =>
    Object.entries(controls()).reduce(
      (dirty, [name, control]) => dirty || control.dirty,
      false
    )
  );

  const isValidatingField = atom(false);
  const isValidatingChildren = computed(() =>
    Object.entries(controls()).reduce(
      (isValidating, [name, control]) => isValidating || control.isValidating,
      false
    )
  );
  const isValidating = computed(
    () => isValidatingField() || isValidatingChildren()
  );

  const setValue = (
    val: TValue,
    {
      shouldDirty,
      shouldTouch,
    }: { shouldDirty?: boolean; shouldTouch?: boolean } = {}
  ) => {
    Object.entries(controls()).forEach(([name, control]) => {
      control.setValue(val[name], { shouldDirty, shouldTouch });
    });
  };

  let validationVersion = 0;
  function validateField() {
    const version = ++validationVersion;
    isValidatingField(true);

    return Promise.all(
      options?.validators?.map((v) => v(instance as any)) ?? []
    )
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

        isValidatingField(false);
      });
  }
  async function validate() {
    return Promise.all([
      validateField(),
      Promise.all(
        Object.entries(controls()).map(([name, control]) => control.validate())
      ),
    ]);
  }

  const markAsFresh = () => {
    Object.entries(controls()).forEach(([name, control]) => {
      control.markAsFresh();
    });
  };

  const reset = () => {
    Object.entries(controls()).forEach(([name, control]) => {
      control.reset();
    });
  };

  instance = state({
    value,
    setValue,
    controls,
    touchedFields,
    dirtyFields,
    errors,
    fieldErrors,
    hasError,
    touched,
    dirty,
    isValidating,
    validate,
    markAsFresh,
    reset,
  }) as any;

  return instance;
}

const IS_GROUP = Symbol.for("IS_GROUP");

export type GroupControl<
  TValue,
  TChildren extends GroupChildren,
  TOptions extends GroupOptions
> = {
  $$typeof: typeof IS_GROUP;
  args: [TChildren, TOptions | undefined];
};

export function isGroupControl(
  control: any
): control is GroupControl<any, any, any> {
  return control.$$typeof === IS_GROUP;
}

export function formGroup<
  TValue,
  TChildren extends GroupChildren,
  TOptions extends GroupOptions
>(
  children: TChildren,
  options?: TOptions
): GroupControl<TValue, TChildren, TOptions> {
  return {
    $$typeof: IS_GROUP,
    args: [children, options],
  };
}
