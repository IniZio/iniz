import { extractStateValue } from "@iniz/core/dist/types/types";
import { ReactElement } from "react";

export function Field<
  TField,
  TChildren extends (field: extractStateValue<TField>) => ReactElement
>({ field, children }: { field: TField; children: TChildren }) {
  return children(field as any);
}
