import {
  ArrayControl,
  FieldControl,
  form,
  FormInstance,
  GroupControl,
} from "@iniz/core/form";
import { useState } from "react";

export function useForm<
  TValue,
  TControl extends
    | FieldControl<any, any>
    | GroupControl<any, any>
    | ArrayControl<any, any>
>(initialValue: TValue, control: TControl): FormInstance<TValue, TControl> {
  return useState(() => form(initialValue, control))[0];
}
