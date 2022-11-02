import {
  ArrayControl,
  FieldControl,
  FieldInstance,
  form,
  GroupControl,
} from "@iniz/core/form";
import { useState } from "react";
import { useSideEffect } from "../useSideEffect";
import { createRegister } from "./createRegister";

export function useForm<
  TValue,
  TControl extends
    | FieldControl<any, any>
    | GroupControl<any, any, any>
    | ArrayControl<any, any, any>
>(initialValue: TValue, control: TControl) {
  const instance = useState(() => form(initialValue, control))[0];
  const refMap = useState(() => new Map<FieldInstance<any, any>, any>())[0];
  const register = useState(() => createRegister(refMap))[0];

  // Focus first error field after validation
  useSideEffect(() => {
    if (!instance.isValidating && instance.hasError) {
      [...refMap].find(([field, _]) => field.hasError)?.[1]?.current?.focus();
    }
  });

  return Object.assign(instance, { register });
}
