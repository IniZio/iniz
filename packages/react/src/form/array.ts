import { atom, Atom, computed } from "@iniz/core";
import { field, FieldControl, FieldInstance, isFieldControl } from "./field";
import { group, GroupControl, GroupInstance, isGroupControl } from "./group";
import { extractStateValue, FilterFirstTwoElements } from "./types";

export type ArrayInstance<
  TValue extends { [k in keyof TGG]: any },
  TGG extends ArrayControl<any, any>["args"][0]
> = {
  value: {
    [k in keyof TGG]: TGG[k] extends FieldControl<any, any>
      ? ReturnType<
          FieldInstance<
            TValue[k],
            Exclude<TGG[k]["args"][0]["syncValidators"], undefined>,
            Exclude<TGG[k]["args"][0]["asyncValidators"], undefined>
          >
        >["value"]
      : TGG[k] extends ArrayControl<any, any>
      ? ArrayInstance<TValue[k], TGG[k]["args"][0]>["value"]
      : TGG[k] extends GroupControl<any, any>
      ? GroupInstance<TValue[k], TGG[k]["args"][0]>["value"]
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
      : TGG[k] extends ArrayControl<any, any>
      ? ArrayInstance<TValue[k], TGG[k]["args"][0]>
      : TGG[k] extends GroupControl<any, any>
      ? GroupInstance<TValue[k], TGG[k]["args"][0]>
      : never;
  };
};

export function array<
  TValue extends { [k in keyof TA]: any },
  TA extends TArrayControlArgs0
>(name: string, initialValue: TValue, arrayControl: TA) {
  const controls: Atom<any[]> = atom(
    arrayControl.map((control, index) =>
      isFieldControl(control)
        ? field(name, initialValue[index], ...control.args)
        : isArrayControl(control)
        ? // @ts-ignore
          array(name, initialValue[index], ...control.args)
        : isGroupControl(control)
        ? // @ts-ignore
          group(name, initialValue[index], ...control.args)
        : null
    )
  );

  const value = computed(() => controls().map((control: any) => control.value));

  const setValue = (val: TValue) => {
    controls().forEach((control, index) => {
      control.setValue(val[index]);
    });
  };

  return atom({ value, setValue, controls })() as extractStateValue<
    ArrayInstance<TValue, TA>
  >;
}

const IS_ARRAY = Symbol.for("IS_ARRAY");

type TArrayControlArgs0 = (
  | FieldControl<any, any>
  | ArrayControl<any, any>
  | GroupControl<any, any>
)[];

export type ArrayControl<TValue, TACArgs0 extends TArrayControlArgs0> = {
  $$typeof: typeof IS_ARRAY;
  args: [TACArgs0];
};

export function isArrayControl(
  control: any
): control is ArrayControl<any, any> {
  return control.$$typeof === IS_ARRAY;
}

export function formArray<
  TValue,
  TArgs extends FilterFirstTwoElements<Parameters<typeof array>>
>(...args: TArgs): ArrayControl<TValue, TArgs[0]> {
  return {
    $$typeof: IS_ARRAY,
    args,
  };
}
