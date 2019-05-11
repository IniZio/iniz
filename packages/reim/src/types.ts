import {Draft} from 'immer'

export interface ReimOptions<T> {
  name?: string;
  actions?: Actions<T>
}

export type Mutation<TS> = {(state: Draft<TS> | TS): void | TS} | Partial<TS>
export type Action<TS> = (...args: any[]) => Mutation<TS>
export type Actions<TS> = {[index: string]: Action<TS>}

// export type Effect<TR> = (...args: any[]) => (store: TR) => any
// export type Effects<TR> = {[index: string]: Effect<TR>}

export type Cache<TS, TF> =
  TF extends ((s: TS) => any)
    ? ReturnType<TF>
    : TF extends {[index: string]: (s: TS) => TS}
      ? {[k in keyof TF]: ReturnType<TF[k]>}
      : any
export type Filter<TS> =
  ((s: TS) => any)
  | {[index: string]: ((s: TS) => any);}
  | keyof TS
export type SnapshotFor<TF, T> = (
  // TF extends (null | undefined) ? T :
  TF extends ((s: any) => any) ? ReturnType<TF> : TF extends {
    [index: string]: ((s: T) => any);
  } ? {
    [k in keyof TF]: ReturnType<TF[k]>;
  } : TF extends keyof T ? T[TF] : T);
export type Meta = {
  mutation?: string;
  payload?: any[];
};
export type Handler<T> = {next: (s: T, meta?: Meta) => any;} | ((s: T, meta?: Meta) => any);
