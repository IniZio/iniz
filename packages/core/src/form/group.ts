import { Atom, atom } from "../atom";
import { computed } from "../computed";
import { State, state } from "../state";
import { array, ArrayControl, ArrayInstance, isArrayControl } from "./array";
import { field, FieldControl, FieldInstance, isFieldControl } from "./field";

export type GroupInstance<
  TValue extends Record<keyof TGG, any>,
  TGG extends GroupControl<any, any>["arg"]
> = {
  value: {
    [k in keyof TGG]: TGG[k] extends FieldControl<any, any>
      ? FieldInstance<
          TValue[k],
          Exclude<TGG[k]["arg"]["validators"], undefined>
        >["value"]
      : TGG[k] extends GroupControl<any, any>
      ? GroupInstance<TValue[k], TGG[k]["arg"]>["value"]
      : TGG[k] extends ArrayControl<any, any>
      ? ArrayInstance<TValue[k], TGG[k]["arg"]>["value"]
      : never;
  };
  setValue: (val: TValue) => void;
  controls: {
    [k in keyof TGG]: TGG[k] extends FieldControl<any, any>
      ? FieldInstance<
          TValue[k],
          Exclude<TGG[k]["arg"]["validators"], undefined>
        >
      : TGG[k] extends GroupControl<any, any>
      ? GroupInstance<TValue[k], TGG[k]["arg"]>
      : TGG[k] extends ArrayControl<any, any>
      ? ArrayInstance<TValue[k], TGG[k]["arg"]>
      : never;
  };
  touchedFields: {
    [k in keyof TGG]: TGG[k] extends FieldControl<any, any>
      ? FieldInstance<
          TValue[k],
          Exclude<TGG[k]["arg"]["validators"], undefined>
        >["touched"]
      : TGG[k] extends GroupControl<any, any>
      ? GroupInstance<TValue[k], TGG[k]["arg"]>["touchedFields"]
      : TGG[k] extends ArrayControl<any, any>
      ? ArrayInstance<TValue[k], TGG[k]["arg"]>["touchedFields"]
      : never;
  };
  dirtyFields: {
    [k in keyof TGG]: TGG[k] extends FieldControl<any, any>
      ? FieldInstance<
          TValue[k],
          Exclude<TGG[k]["arg"]["validators"], undefined>
        >["dirty"]
      : TGG[k] extends GroupControl<any, any>
      ? GroupInstance<TValue[k], TGG[k]["arg"]>["dirtyFields"]
      : TGG[k] extends ArrayControl<any, any>
      ? ArrayInstance<TValue[k], TGG[k]["arg"]>["dirtyFields"]
      : never;
  };
  fieldErrors: {
    [k in keyof TGG]: TGG[k] extends FieldControl<any, any>
      ? FieldInstance<
          TValue[k],
          Exclude<TGG[k]["arg"]["validators"], undefined>
        >["errors"]
      : TGG[k] extends GroupControl<any, any>
      ? GroupInstance<TValue[k], TGG[k]["arg"]>["fieldErrors"]
      : TGG[k] extends ArrayControl<any, any>
      ? ArrayInstance<TValue[k], TGG[k]["arg"]>["fieldErrors"]
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
  TValue extends Record<keyof TG, any>,
  TG extends TGroupControlArg
>(initialValue: TValue, groupControl: TG) {
  const controls: Atom<Record<any, any>> = atom(
    Object.entries(groupControl).reduce(
      // @ts-ignore
      (acc, [name, control]) => ({
        ...acc,
        [name]: isFieldControl(control)
          ? field(name, initialValue[name], control.arg)
          : // @ts-ignore
          isGroupControl(control)
          ? // @ts-ignore
            group(initialValue[name], control.arg)
          : // @ts-ignore
          isArrayControl(control)
          ? // @ts-ignore
            array(initialValue[name], control.arg)
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
        [name]: control.errors,
      }),
      {}
    )
  );

  const hasError = computed(() =>
    Object.entries(controls()).reduce(
      (hasError, [name, control]) => hasError || control.hasError,
      false
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

  const isValidating = computed(() =>
    Object.entries(controls()).reduce(
      (isValidating, [name, control]) => isValidating || control.isValidating,
      false
    )
  );

  const setValue = (val: TValue) => {
    Object.entries(controls()).forEach(([name, control]) => {
      control.setValue(val[name]);
    });
  };

  const validate = async () => {
    await Promise.all(
      Object.entries(controls()).map(([name, control]) => control.validate())
    );
  };

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

  return state({
    value,
    setValue,
    controls,
    touchedFields,
    dirtyFields,
    fieldErrors,
    hasError,
    touched,
    dirty,
    isValidating,
    validate,
    markAsFresh,
    reset,
  }) as State<GroupInstance<TValue, TG>>;
}

const IS_GROUP = Symbol.for("IS_GROUP");

type TGroupControlArg = {
  [index: string]:
    | FieldControl<any, any>
    | ArrayControl<any, any>
    | GroupControl<any, any>;
};

export type GroupControl<TValue, TGCArg extends TGroupControlArg> = {
  $$typeof: typeof IS_GROUP;
  arg: TGCArg;
};

export function isGroupControl(
  control: any
): control is GroupControl<any, any> {
  return control.$$typeof === IS_GROUP;
}

export function formGroup<TValue, TArg extends Parameters<typeof group>[1]>(
  arg: TArg
): GroupControl<TValue, TArg> {
  return {
    $$typeof: IS_GROUP,
    arg,
  };
}
