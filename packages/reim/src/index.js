import {produce} from 'immer'
import isEqual from 'lodash/isEqual'

export class Store {
  state = null

  _subscribers = []

  constructor(state) {
    this.state = produce(null, () => state)
  }

  /**
   * dispatch - Execute effect
   *
   * @param {Function} effect An effect has side-effect
   *
   * @returns {Function} dispatched effect
   */
  dispatch(effect) {
    return async (...args) => {
      const m = await effect(...args)
      const mutations = [].concat(m)
      mutations.map((...args) => this.commit(...args)())
    }
  }

  /**
   * commit - Execute mutations
   *
   * @param {Function} mutations Mutations only mutate state
   *
   * @returns {any} New state
   */
  commit(mutations) {
    return (...args) => {
      this.state = produce(this.state, draft => ([].concat(mutations)).forEach(mutation => mutation(draft, ...args)))
      this._notify()
      return this.state
    }
  }

  /**
   * subscribe - Add subscriber
   *
   * @param {Function} handler Subscriber callback
   * @param {Object} option Options for subscription
   * @param {boolean} option.immediate Whether to run sub
   * @param {Function} option.selector Selectors for data subscription
   *
   * @returns {Function} Unsubscriber
   */
  subscribe(handler, {immediate = true, selector = state => state} = {}) {
    this._subscribers.push({handler, selector})
    if (immediate) {
      this._notify()
    }
    return () => this.unsubscribe(handler)
  }

  /**
   * unsubscribe - Remove subscriber
   *
   * @param {Function} handler Subscriber to remvoe
   *
   */
  unsubscribe(handler) {
    this._subscribers.splice(this._subscribers.findIndex(sub => sub.handler === handler), 1)
  }

  _notify() {
    this._subscribers.forEach(sub => {
      // Notify if selected is updated
      const selected = produce(this.state, sub.selector)
      if (!isEqual(selected, sub.selected)) {
        sub.selected = selected
        sub.handler(selected)
      }
    })
  }
}

export const register = state => new Store(state)
