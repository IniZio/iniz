import { atom, Atom, computed } from "@iniz/core";
import { array, ArrayControl, ArrayInstance, isArrayControl } from "./array";
import { field, FieldControl, FieldInstance, isFieldControl } from "./field";
import { extractStateValue, FilterFirstElement } from "./types";

export type GroupInstance<TGG extends GroupControl<any>["args"][0]> = {
  value: {
    [k in keyof TGG]: TGG[k] extends FieldControl<any>
      ? ReturnType<
          FieldInstance<
            Exclude<TGG[k]["args"][0], undefined>,
            Exclude<TGG[k]["args"][1], undefined>,
            Exclude<TGG[k]["args"][2], undefined>
          >
        >["value"]
      : TGG[k] extends GroupControl<any>
      ? GroupInstance<TGG[k]["args"][0]>["value"]
      : TGG[k] extends ArrayControl<any>
      ? ArrayInstance<TGG[k]["args"][0]>["value"]
      : never;
  };
  controls: {
    [k in keyof TGG]: TGG[k] extends FieldControl<any>
      ? FieldInstance<
          Exclude<TGG[k]["args"][0], undefined>,
          Exclude<TGG[k]["args"][1], undefined>,
          Exclude<TGG[k]["args"][2], undefined>
        >
      : TGG[k] extends GroupControl<any>
      ? GroupInstance<TGG[k]["args"][0]>
      : TGG[k] extends ArrayControl<any>
      ? ArrayInstance<TGG[k]["args"][0]>
      : never;
  };
};

export function group<TG extends TGroupControlArgs0>(
  name: string,
  groupControl: TG
) {
  const controls: any = atom(
    Object.entries(groupControl).reduce(
      (acc, [name, control]) => ({
        ...acc,
        [name]: isFieldControl(control)
          ? field(name, ...control.args)
          : isGroupControl(control)
          ? // @ts-ignore
            group(name, ...control.args)
          : isArrayControl(control)
          ? // @ts-ignore
            array(name, ...control.args)
          : null,
      }),
      {}
    )
  );

  const value = computed(() =>
    Object.entries(controls()).reduce(
      (acc, [name, control]) => ({
        ...acc,
        [name]: (control as any).value,
      }),
      {}
    )
  );

  return atom({
    value,
    controls,
  })() as extractStateValue<Atom<GroupInstance<TG>>>;
}

const IS_GROUP = Symbol.for("IS_GROUP");

type TGroupControlArgs0 = {
  [index: string]: FieldControl<any> | ArrayControl<any> | GroupControl<any>;
};

export type GroupControl<TGCArgs0 extends TGroupControlArgs0> = {
  $$typeof: typeof IS_GROUP;
  args: [TGCArgs0];
};

export function isGroupControl(control: any): control is GroupControl<any> {
  return control.$$typeof === IS_GROUP;
}

export function formGroup<
  TArgs extends FilterFirstElement<Parameters<typeof group>>
>(...args: TArgs): GroupControl<TArgs[0]> {
  return {
    $$typeof: IS_GROUP,
    args,
  };
}
