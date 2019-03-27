import {produce, setAutoFreeze} from 'immer'
import bind from 'auto-bind'
import emitter from 'event-emitter'
import equal from 'fast-deep-equal'
import isFunction from 'lodash/isFunction'
import isPlainObject from 'lodash/isPlainObject'

import {ReimOptions, Mutation, State, Getter, Plugin} from './types'

const withDevTools = (
  // @ts-ignore
  process.env.NODE_ENV === 'development' &&
  // @ts-ignore
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
)

const devInstances = []

type EventListener = (...args: any[]) => void;
type EmitterMethod = (type: string, listener: EventListener) => void

setAutoFreeze(true)

export class Store {
  private _name = ''
  private _initial = {}
  _state = {}
  private _devTools: any
  private _subscribers = []

  emit: (type: string, ...args: any[]) => void
  off: EmitterMethod
  on: EmitterMethod
  once: EmitterMethod


  get __isReim() {
    return true
  }

  get state() {
    return this._state
  }

  get name() {
    return this._name
  }

  constructor(state = {}, {name, plugins = []}: ReimOptions = {plugins: []}) {
    emitter(this)
    this._name = name
    this.plugin(...plugins)

    this.reset(state)
    this.emit('init', this)
    bind(this)

    if (withDevTools && this._name) {
      if (devInstances.includes(this._name)) {
        console.error(`There is already an instance named ${this._name}, please ensure your stores have unique names`)
        return
      }

      // @ts-ignore
      this._devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({instanceId: this._name, shouldStringify: false})

      devInstances.push(this._name)

      this._devTools.subscribe((message: any) => {
        if (message.id !== this._name) {
          return
        }

        if (message.type === 'DISPATCH' && (message.payload.type === 'JUMP_TO_STATE' || message.payload.type === 'JUMP_TO_ACTION')) {
          this.reset(typeof message.state === 'string' ? JSON.parse(message.state) : message.state)
        }
      })
    }

    if (this._devTools) {
      this._devTools.init(this.state)
    }
  }

  snapshot(getter: Getter = s => s) {
    return typeof getter === 'string' ? this.state[getter] : getter(this.state)
  }

  _set = <M extends Mutation>(mutation: M, ...args: M extends (...args: any[]) => (...args: any[]) => any ? Parameters<ReturnType<M>> : M extends (...args: any[]) => any ? Parameters<M> : []) =>  {
    this._state = isPlainObject(this.state) ? (
      produce(
        this._state, (
          isFunction(mutation) ?
            (state => {
              const res = mutation(state, ...args)
              return (isFunction(res) ? res(...args) : res) || undefined
            }) :
            (state => {
              Object.assign(state, mutation)
            })
        )
      )
    ) : mutation

    this._notify()
  }

  // Immutable way to update state
  set = <M extends Mutation>(mutation: M, ...args: M extends (...args: any[]) => (...args: any[]) => any ? Parameters<ReturnType<M>> : M extends (...args: any[]) => any ? Parameters<M> : []) => {
    this._set(mutation, ...args)

    this.emit('set', mutation, ...args)
    if (this._devTools) {
      this._devTools.send(isFunction(mutation) && mutation.name || 'ANONYMOUS', this.state)
    }
    return this.state
  }

  reset(initial = null, ...args) {
    if (initial) {
      this._initial = initial
    }

    this._set(() => this._initial)

    this.emit('reset', initial, ...args)
    return this.state
  }

  subscribe(handler: (s: State) => any, {immediate = false, getter = s => s}: {immediate?: boolean; getter: Getter} = {getter: s => s}) {
    // TODO: check if the getter is not cachable here
    const getterCache = this.snapshot(getter)
    this._subscribers.push({handler, getter, getterCache})
    if (immediate) {
      handler(getterCache)
    }
    return () => this.unsubscribe(handler)
  }

  unsubscribe(handler: (s: State) => any) {
    this._subscribers.splice(this._subscribers.findIndex(sub => sub.handler === handler), 1)
  }

  plugin(...plugins: Plugin[]) {
    plugins.forEach(plugin => (isFunction(plugin) ? plugin(this) : plugin.call(this, this)))
    return this
  }

  private _notify() {
    this._subscribers.forEach(sub => {
      // Notify if getterCache is updated
      const getterCache = this.snapshot(sub.getter)

      if (!equal(getterCache, sub.getterCache)) {
        sub.getterCache = getterCache
        sub.handler(getterCache)
      }
    })
  }
}

function reim<
  X extends {[index: string]: any},
  T extends {[index: string]: (s: State) => (...args: any[]) => void | Partial<State>},
>(state: X = {} as X, {actions, ...options}: ReimOptions & {actions?: T} = {}): Store & {[k in keyof typeof actions]: ReturnType<T[k]>} {
  const store = new Store(state, options)
  return Object.assign(store, Object.keys(actions).reduce((acc, key) => ({...acc, [key]: (...args: any[]) => store.set(actions[key], ...args)}), {})) as Store & {[k in keyof typeof actions]: ReturnType<T[k]>}
}

export default reim

// @ts-ignore
const observableSymbol = () => ((typeof Symbol === 'function' && Symbol.observable) || '@@observable')

// Returns an observable stream
export const toStream = (store: Store, options: any = {}) => {
  return {
    subscribe: (observer: ((s: any) => any) | {next: (s: any) => any} = () => {}) => ({
      unsubscribe: store.subscribe((
        isFunction(observer) ?
          observer.bind(this) :
          observer.next.bind(this)
      ), {...options, immediate: true})
    }),
    [observableSymbol()]() {
      return this
    }
  }
}

export * from './types'
