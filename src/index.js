import {produce} from 'immer'

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
   *
   * @returns {Function} Unsubscriber
   */
  subscribe(handler, {immediate = false} = {}) {
    this._subscribers.push(handler)
    if (immediate) {
      this._notify()
    }
    return () => this.unsubscribe(handler)
  }

  /**
   * unsubscribe - Remove subscriber
   *
   * @param {Function} handler Subscriber callback
   *
   */
  unsubscribe(handler) {
    this._subscribers.splice(this._subscribers.indexOf(handler), 1)
  }

  _notify() {
    this._subscribers.forEach(handler => handler(this.state))
  }
}

export const register = state => new Store(state)
