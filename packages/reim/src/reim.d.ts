export type State = object
export type Mutation = {(state: State): void | any} | object
export type Getter = {(state: State):  any}

interface Subscriber {
  handler(object: any): void
  getter(object: any): any
}

interface SubscribeOption {
  immediate?: boolean
  getter?(state: State): any
}

type PluginFunction = (store: Store, store1: Store) => any
interface PluginObject {
  name?: string
  call: PluginFunction
}

export type Plugin = PluginObject | PluginFunction

interface storeOption {
  name?: string
  plugins?: Plugin[]
}

export class Store {
  constructor(state?: object)

  private _state: State
  private _subscribers: Subscriber[]

  public __isStore: boolean
  public state: State

  private _notify(): void

  public snapshot(getter?: Getter): any
  public getState(getter?: Getter): any

  public commit(mutation?: Mutation, ...args: any[]): State
  public set(mutation?: Mutation, ...args: any[]): State
  public setState(mutation?: Mutation, ...args: any[]): State

  public reset(initial?: object): State

  public subscribe(handler: {(state: State | any): void}, option?: SubscribeOption): {(handler: {(): void}): void}
  public unsubscribe(handler: {(): void}): void

  public plugin(...plugins: Plugin[]): Store
}

export function store(state?: State, option?: storeOption): Store
export default store
export function register(state?: State, option?: storeOption): Store

interface Stream {
  subscribe(observer: {(): void}): {
    unsubscribe(): void
  }
}

export function toStream(store: Store, option: object): Stream
