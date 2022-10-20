import { atom, Atom } from "@iniz/core";
import { field, FieldInstance } from "./field";

function formGroup<TG extends { [key: string]: FieldControl }>(
  groupControl: TG
) {
  const generated = Object.entries(groupControl).reduce(
    (acc, [name, control]) => ({
      ...acc,
      [name]: field(name, ...control.args),
    }),
    {}
  );

  return atom(generated as any)() as ReturnType<
    Atom<{
      [k in keyof TG]: FieldInstance<
        Exclude<TG[k]["args"][1], undefined>,
        Exclude<TG[k]["args"][2], undefined>
      >;
    }>
  >;
}

const IS_FIELD = Symbol.for("IS_FIELD");

// Group field wil not need name since it comes from the property name, thus excluded from arguments
type FilterFirstElement<T extends unknown[]> = T extends [unknown, ...infer R]
  ? R
  : [];

type FieldControl = {
  $$typeof: typeof IS_FIELD;
  args: FilterFirstElement<Parameters<typeof field>>;
};

function formField(
  ...args: FilterFirstElement<Parameters<typeof field>>
): FieldControl {
  return {
    $$typeof: IS_FIELD,
    args,
  };
}

export const group = Object.assign(formGroup, {
  field: formField,
});
