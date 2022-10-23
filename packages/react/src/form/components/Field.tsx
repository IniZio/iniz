import { ReactElement } from "react";
import { extractStateValue } from "../types";

export function Field<
  TField,
  TChildren extends (field: extractStateValue<TField>) => ReactElement
>({ field, children }: { field: TField; children: TChildren }) {
  return children(field as any);
}
