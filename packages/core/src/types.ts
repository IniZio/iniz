import { Atom } from "./atom";
import { Store } from "./store";

export type FilterFirstElement<T extends unknown[]> = T extends [
  unknown,
  ...infer R
]
  ? R
  : [];

export type FilterFirstTwoElements<T extends unknown[]> = T extends [
  unknown,
  unknown,
  ...infer R
]
  ? R
  : [];

export type extractStoreValue<T> = T extends Atom<infer V>
  ? extractStoreValue<V>
  : T extends Store<infer V>
  ? V
  : T extends { [k in keyof T]: any }
  ? { [k in keyof T]: extractStoreValue<T[k]> }
  : T;
