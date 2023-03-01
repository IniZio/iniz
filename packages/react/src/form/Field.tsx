import { ReactElement } from "react";
import { extractStoreValue } from "./types";

export function Field<
  TField,
  TChildren extends (field: extractStoreValue<TField>) => ReactElement
>({ field, children }: { field?: TField; children: TChildren }) {
  return children(field as any);
}
