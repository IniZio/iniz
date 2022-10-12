import { atom } from "@iniz/core";
import { useState } from "react";

export function useAtom<TValue>(atomOrInitialValue: TValue) {
  return useState(() => atom(atomOrInitialValue))[0];
}
