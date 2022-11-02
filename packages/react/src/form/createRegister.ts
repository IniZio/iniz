import { FieldInstance } from "@iniz/core/form";
import { createRef, RefObject } from "react";

const onChangeMap = (e: any) => {
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

export const createRegister =
  (refMap: Map<FieldInstance<any, any>, RefObject<HTMLElement>>) =>
  <TField extends FieldInstance<any, any>>(
    field: TField
  ): {
    name: TField["name"];
    value: TField["value"];
    ref: any;
    onChange: (evt: any) => void;
    onBlur: (evt: any) => void;
  } => {
    const ref = (() => {
      if (!refMap.has(field)) {
        refMap.set(field, createRef());
      }

      return refMap.get(field)!;
    })();

    return {
      name: field?.name,
      value: field.value,
      ref,
      onChange: (evt: any) => {
        field.setValue(onChangeMap(evt), {
          shouldDirty: true,
          shouldTouch: true,
        });
      },
      onBlur: field.onBlur,
    };
  };
