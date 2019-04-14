import {Draft} from 'immer'

export interface ReimOptions {
  name?: string;
}

export type Mutation<TS> = {(state: Draft<TS> | TS): void | TS} | Partial<TS>
export type Action<TS> = (...args: any[]) => Mutation<TS>
export type Actions<TS> = {[index: string]: Action<TS>}

export type Effect<TR> = (...args: any[]) => (store: TR) => any
export type Effects<TR> = {[index: string]: Effect<TR>}
