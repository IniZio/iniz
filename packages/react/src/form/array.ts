import { atom, Atom } from "@iniz/core";
import { field, FieldControl, FieldInstance, isFieldControl } from "./field";
import { group, GroupControl, GroupInstance, isGroupControl } from "./group";
import { extractStateValue, FilterFirstElement } from "./types";

export type ArrayInstance<TGG extends ArrayControl<any>["args"][0]> = {
  controls: {
    [k in keyof TGG]: TGG[k] extends FieldControl<any>
      ? FieldInstance<
          Exclude<TGG[k]["args"][1], undefined>,
          Exclude<TGG[k]["args"][2], undefined>
        >
      : TGG[k] extends ArrayControl<any>
      ? ArrayInstance<TGG[k]["args"][0]>
      : TGG[k] extends GroupControl<any>
      ? GroupInstance<TGG[k]["args"][0]>
      : never;
  };
};

export function array<TA extends TArrayControlArgs0>(
  name: string,
  arrayControl: TA
) {
  const controls: any = atom(
    arrayControl.map((control) =>
      isFieldControl(control)
        ? field(name, ...control.args)
        : isArrayControl(control)
        ? // @ts-ignore
          array(name, ...control.args)
        : isGroupControl(control)
        ? // @ts-ignore
          group(name, ...control.args)
        : null
    )
  );

  return atom({ controls })() as extractStateValue<Atom<ArrayInstance<TA>>>;
}

const IS_ARRAY = Symbol.for("IS_ARRAY");

type TArrayControlArgs0 = (
  | FieldControl<any>
  | ArrayControl<any>
  | GroupControl<any>
)[];

export type ArrayControl<TACArgs0 extends TArrayControlArgs0> = {
  $$typeof: typeof IS_ARRAY;
  args: [TACArgs0];
};

export function isArrayControl(control: any): control is ArrayControl<any> {
  return control.$$typeof === IS_ARRAY;
}

export function formArray<
  TArgs extends FilterFirstElement<Parameters<typeof array>>
>(...args: TArgs): ArrayControl<TArgs[0]> {
  return {
    $$typeof: IS_ARRAY,
    args,
  };
}