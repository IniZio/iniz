import { Atom } from "./atom";

export type extractValue<T> = T extends Atom<infer V> ? V : T;
