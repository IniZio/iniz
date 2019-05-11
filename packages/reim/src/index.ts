import {isPlainObject, isFunction} from 'lodash'
import produce from 'immer'
const equal = require('fast-deep-equal')
const autoBind = require('auto-bind')

import {Actions, ReimOptions, Action, Handler, Filter, SnapshotFor, Meta} from './types'

const isReimFlag = Symbol('reim')

const instances: {[name: string]: any} = {}

// @ts-ignore
const observableSymbol = () => ((typeof Symbol === 'function' && Symbol.observable) || '@@observable')

const withDevTools = (
  // @ts-ignore
  process.env.NODE_ENV === 'development' &&
  // @ts-ignore
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
)

export function isReim(store: any): store is Reim {
  return store.__isReim === isReimFlag
}

export class Reim<T = any> {
  _name?: string
  _initial: T
  _state: T
  _subscribers: {handler: Handler<T>, filter: Filter<T>, cache: any}[] = []
  _devTools: any

  get __isReim() { return isReimFlag }
  get name() { return this._name }

  constructor(initial?: T, options: ReimOptions<T> = {}) {
    autoBind(this)

    this._name = options.name
    this._state = initial

    if (this.name) {
      if (instances[this.name]) {
        throw new Error(`There is already an instance named ${this._name}, named stores must have unique names`)
      }
      instances[this.name] = {}
    }

    if (withDevTools) {
      // @ts-ignore
      this._devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({instanceId: this.name, shouldStringify: false})
      this._devTools.subscribe((message: any) => {
        if (message.id !== this._name) {
          return
        }

        if (message.type === 'DISPATCH' && (message.payload.type === 'JUMP_TO_STATE' || message.payload.type === 'JUMP_TO_ACTION')) {
          this.reset(typeof message.state === 'string' ? JSON.parse(message.state) : message.state)
        }
      })
      this._devTools.init(this.filter())
    }

    Object.assign(this, this.actions(options.actions))
  }

  filter<
    TF extends Filter<T>
  >(filter?: TF): TF extends (null | undefined) ? T : SnapshotFor<TF, T> {
    if (!filter) {
      return this._state as TF extends (null | undefined) ? T : SnapshotFor<TF, T>
    }

    if (this._state[filter as keyof T]) {
      return this._state[filter as keyof T] as TF extends (null | undefined) ? T : SnapshotFor<TF, T>
    }

    if (typeof filter === 'function') {
      return (filter as (s: T) => any)(this._state)
    }

    if (isPlainObject(filter)) {
      return Object.entries(filter as {[index: string]: ((s: T) => any)})
        .reduce((acc, [key, f]) => ({
          ...acc,
          [key]: (f as (s: T) => any)(this._state)
        }), {} as TF extends (null | undefined) ? T : SnapshotFor<TF, T>)
    }

    return this._state as TF extends (null | undefined) ? T : SnapshotFor<TF, T>
  }

  set<T, TR extends Reim<T>>(this: TR & {_state: T}, action: Action<T>, {mutation, payload}: Meta = {}) {
    const _mutation = action(...payload)

    this._state = isPlainObject(this._state) ? (
      produce(
        this._state, (
          isFunction(_mutation) ?
            state => _mutation(state) :
            state => void Object.assign(state, _mutation)
        )
      )
    ) : (
      isFunction(_mutation) ?
        _mutation(this._state) as T :
        _mutation as T
    )

    this._notify({mutation, payload})
  }

  _notify = (meta: {mutation: string, payload: any[]}) => {
    this._subscribers.forEach(sub => {
      // Notify if cache is updated
      const cache = this.filter(sub.filter)

      if (!equal(cache, sub.cache)) {
        sub.cache = cache;
        (isFunction(sub.handler) ? sub.handler : sub.handler.next)(cache, meta)
      }
    })
  }

  reset<T, TR extends Reim<T>>(this: TR & {_state: T}, initial: T = null) {
    if (initial) {
      this._initial = initial
    }

    this.set(() => this._initial)
    return this.filter()
  }

  actions<
    TR extends Reim<T>,
    T,
    TA extends Actions<T>
  >(this: TR & {_state: T}, actions: TA = {} as TA): {[k in keyof typeof actions]: TA[k]} {
    return Object.keys(actions)
      .reduce((acc, key) => ({
        ...acc,
        [key]: (...args: any[]) => void (
          this.set(actions[key], {mutation: key, payload: args})
        )
      }), {}) as {[k in keyof typeof actions]: TA[k]}
  }

  unsubscribe<TR extends Reim<T>, T>(this: TR & {_state: T}, handler: Handler<T>) {
    this._subscribers.splice(this._subscribers.findIndex(sub => sub.handler === handler), 1)
  }

  subscribe<TR extends Reim<T>, T>(this: TR & {_state: T}, handler: Handler<T>, {immediate = false, filter}: {immediate?: boolean; filter?: Filter<T>} = {}) {
    // TODO: check if the filter is not cachable here
    const cache = this.filter(filter)

    this._subscribers.push({handler, filter, cache})
    if (immediate) {
      (isFunction(handler) ? handler : handler.next)(cache)
    }
    return {unsubscribe: () => this.unsubscribe(handler)}
  }
  [observableSymbol()]() {
    return this
  }
}

const reim = <T, TA>(initial: T, options: ReimOptions<T> & {actions?: TA} = {}): Reim & {[k in keyof TA]: TA[k]} => {
  const instance = new Reim<T | null | undefined>(initial, options)

  return Object.assign(instance, instance.actions(options.actions))
}

export * from './types'

export default reim
