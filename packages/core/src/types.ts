import { Atom } from "./atom";

export type extractAtomValue<T> = T extends Atom<infer V> ? V : T;
