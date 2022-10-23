import { formArray } from "./array";
import { formField } from "./field";
import { formGroup } from "./group";

export const form = Object.assign(
  {},
  {
    field: formField,
    group: formGroup,
    array: formArray,
  }
);
