import { Atom, atom } from "../atom";
import { computed } from "../computed";
import { State, state } from "../state";
import { FilterFirstElement } from "../types";
import { array, ArrayControl, ArrayInstance, isArrayControl } from "./array";
import { field, FieldControl, FieldInstance, isFieldControl } from "./field";

export type GroupInstance<
  TValue extends Record<keyof TGG, any>,
  TGG extends GroupControl<any, any>["args"][0]
> = {
  value: {
    [k in keyof TGG]: TGG[k] extends FieldControl<any, any>
      ? FieldInstance<
          TValue[k],
          Exclude<TGG[k]["args"][1], undefined>,
          Exclude<TGG[k]["args"][2], undefined>
        >["value"]
      : TGG[k] extends GroupControl<any, any>
      ? GroupInstance<TValue[k], TGG[k]["args"][0]>["value"]
      : TGG[k] extends ArrayControl<any, any>
      ? ArrayInstance<TValue[k], TGG[k]["args"][0]>["value"]
      : never;
  };
  setValue: (val: TValue) => void;
  controls: {
    [k in keyof TGG]: TGG[k] extends FieldControl<any, any>
      ? FieldInstance<
          TValue[k],
          Exclude<TGG[k]["args"][0]["syncValidators"], undefined>,
          Exclude<TGG[k]["args"][0]["asyncValidators"], undefined>
        >
      : TGG[k] extends GroupControl<any, any>
      ? GroupInstance<TValue[k], TGG[k]["args"][0]>
      : TGG[k] extends ArrayControl<any, any>
      ? ArrayInstance<TValue[k], TGG[k]["args"][0]>
      : never;
  };
  touchedFields: {
    [k in keyof TGG]: TGG[k] extends FieldControl<any, any>
      ? FieldInstance<
          TValue[k],
          Exclude<TGG[k]["args"][1], undefined>,
          Exclude<TGG[k]["args"][2], undefined>
        >["touched"]
      : TGG[k] extends GroupControl<any, any>
      ? GroupInstance<TValue[k], TGG[k]["args"][0]>["touchedFields"]
      : TGG[k] extends ArrayControl<any, any>
      ? ArrayInstance<TValue[k], TGG[k]["args"][0]>["touchedFields"]
      : never;
  };
  fieldErrors: {
    [k in keyof TGG]: TGG[k] extends FieldControl<any, any>
      ? FieldInstance<
          TValue[k],
          Exclude<TGG[k]["args"][1], undefined>,
          Exclude<TGG[k]["args"][2], undefined>
        >["errors"]
      : TGG[k] extends GroupControl<any, any>
      ? GroupInstance<TValue[k], TGG[k]["args"][0]>["fieldErrors"]
      : TGG[k] extends ArrayControl<any, any>
      ? ArrayInstance<TValue[k], TGG[k]["args"][0]>["fieldErrors"]
      : never;
  };
  hasError: boolean;
  touched: boolean;
  pending: boolean;
  validate: () => Promise<void>;
  markAsFresh: () => void;
  reset: () => void;
};

export function group<
  TValue extends Record<keyof TG, any>,
  TG extends TGroupControlArgs0
>(initialValue: TValue, groupControl: TG) {
  const controls: Atom<Record<any, any>> = atom(
    Object.entries(groupControl).reduce(
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

  const pending = computed(() =>
    Object.entries(controls()).reduce(
      (pending, [name, control]) => pending || control.pending,
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
    fieldErrors,
    hasError,
    touched,
    pending,
    validate,
    markAsFresh,
    reset,
  }) as State<GroupInstance<TValue, TG>>;
}

const IS_GROUP = Symbol.for("IS_GROUP");

type TGroupControlArgs0 = {
  [index: string]:
    | FieldControl<any, any>
    | ArrayControl<any, any>
    | GroupControl<any, any>;
};

export type GroupControl<TValue, TGCArgs0 extends TGroupControlArgs0> = {
  $$typeof: typeof IS_GROUP;
  args: [TGCArgs0];
};

export function isGroupControl(
  control: any
): control is GroupControl<any, any> {
  return control.$$typeof === IS_GROUP;
}

export function formGroup<
  TValue,
  TArgs extends FilterFirstElement<Parameters<typeof group>>
>(...args: TArgs): GroupControl<TValue, TArgs[0]> {
  return {
    $$typeof: IS_GROUP,
    args,
  };
}
