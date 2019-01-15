import {produce, setAutoFreeze} from 'immer'
import bind from 'auto-bind'
import emitter from 'event-emitter'
import equal from 'fast-deep-equal'
import isFunction from 'lodash/isFunction'

const withDevTools = (
  process.env.NODE_ENV === 'development' &&
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
)

const devInstances = []

setAutoFreeze(true)
class Store {
  _state = {}

  _subscribers = []

  get __isStore() {
    return true
  }

  get state() {
    return this._state
  }

  constructor(state = {}, {name, plugins = []} = {}) {
    emitter(this)
    this.name = name
    this.plugin(...plugins)

    this.reset(state)
    this.emit('init', this)
    bind(this)

    if (withDevTools && this.name) {
      if (devInstances.includes(this.name)) {
        console.error(`There is already an instance named ${this.name}, please ensure your stores have unique names`)
        return
      }

      this.devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({instanceId: this.name, shouldStringify: false})

      devInstances.push(this.name)

      this.devTools.subscribe(message => {
        if (message.id !== this.name) {
          return
        }

        if (message.type === 'DISPATCH' && (message.payload.type === 'JUMP_TO_STATE' || message.payload.type === 'JUMP_TO_ACTION')) {
          this.reset(typeof message.state === 'string' ? JSON.parse(message.state) : message.state)
        }
      })
    }

    if (this.devTools) {
      this.devTools.init(this.state)
    }
  }

  snapshot(getter = state => state) {
    return typeof getter === 'string' ? this.state[getter] : getter(this.state)
  }

  getState = this.snapshot

  // Mutatable way to update state
  commit(mutation, ...args) {
    const newState = mutation(this._state, ...args)
    Object.assign(this._state, newState)

    this.emit('set', mutation, ...args)
    if (this.devTools) {
      this.devTools.send(mutation.name || 'ANONYMOUS', this.state)
    }
    this._notify()

    return this.state
  }

  _set = (mutation, ...args) => {
    this._state = produce(
      this._state, (
        isFunction(mutation) ?
          (state => (mutation(state, ...args) || undefined)) :
          (state => {
            Object.assign(state, mutation)
          })
      )
    )

    this._notify()
  }

  // Immutable way to update state
  set = (mutation, ...args) => {
    this._set(mutation, ...args)

    this.emit('set', mutation, ...args)
    if (this.devTools) {
      this.devTools.send(mutation.name || 'ANONYMOUS', this.state)
    }
    return this.state
  }

  setState = this.set

  reset(initial = null, ...args) {
    if (initial) {
      this._initial = initial
    }

    this._set(() => this._initial)

    this.emit('reset', initial, ...args)
    return this.state
  }

  /**
   * subscribe - Add subscriber
   *
   * @param {Function} handler subscriber callback
   * @param {Object} option Options for subscription
   * @param {boolean} option.immediate Whether to run sub
   * @param {Function} option.getter getters for data subscription
   *
   * @returns {Function} unsubscriber
   */
  subscribe(handler, {immediate = false, getter = state => state} = {}) {
    // TODO: check if the getter is not cachable here
    const getterCache = this.snapshot(getter)
    this._subscribers.push({handler, getter, getterCache})
    if (immediate) {
      handler(getterCache)
    }
    return () => this.unsubscribe(handler)
  }

  /**
   * unsubscribe - Remove subscriber
   *
   * @param {Function} handler subscriber to remvoe
   *
   */
  unsubscribe(handler) {
    this._subscribers.splice(this._subscribers.findIndex(sub => sub.handler === handler), 1)
  }

  plugin(...plugins) {
    plugins.forEach(
      plugin => {
        plugin.call(this, this)
      }
    )
    return this
  }

  _notify() {
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

export const store = (...args) => new Store(...args)

export const register = store

export default store

const observableSymbol = () => ((typeof Symbol === 'function' && Symbol.observable) || '@@observable')

// Returns an observable stream
export const toStream = (store, options = {}) => {
  return {
    subscribe: (observer = () => {}) => ({
      unsubscribe: store.subscribe((
        typeof observer === 'function' ?
          selected => observer(selected) :
          selected => observer.next(selected)
      ), {...options, immediate: true})
    }),
    [observableSymbol()]() {
      return this
    }
  }
}
