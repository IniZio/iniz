import { atom, Atom } from "@iniz/core";
import { extractStateValue } from "@iniz/core/dist/types/types";
import { field, FieldControl, FieldInstance, isFieldControl } from "./field";
import { group, GroupControl, GroupInstance, isGroupControl } from "./group";
import { FilterFirstElement } from "./types";

export type ArrayInstance<TGG extends ArrayControl<any>["args"][0]> = {
  [k in keyof TGG]: TGG[k] extends FieldControl
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

export function array<TA extends TArrayControlArgs0>(
  name: string,
  arrayControl: TA
) {
  const generated: any = arrayControl.map((control) =>
    isFieldControl(control)
      ? field(name, ...control.args)
      : isArrayControl(control)
      ? array(name, ...control.args)
      : isGroupControl(control)
      ? group(name, ...control.args)
      : null
  );

  return atom(generated)() as extractStateValue<Atom<ArrayInstance<TA>>>;
}

const IS_ARRAY = Symbol.for("IS_ARRAY");

type TArrayControlArgs0 = (
  | FieldControl
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
