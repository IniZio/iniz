import { atom } from "@iniz/core";
import { useState } from "preact/hooks";

export function useAtom<TValue>(atomOrInitialValue: TValue) {
  return useState(() => atom(atomOrInitialValue))[0];
}
