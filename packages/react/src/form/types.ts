import { Atom, State } from "@iniz/core";

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

export type extractStateValue<T> = T extends Atom<infer V>
  ? extractStateValue<V>
  : T extends State<infer V>
  ? V
  : T extends { [k in keyof T]: any }
  ? { [k in keyof T]: extractStateValue<T[k]> }
  : T;
