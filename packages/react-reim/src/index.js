import React, {PureComponent} from 'react'

import State from './components/state'

export {default as State} from './components/state'

// Syncs props to store
export function pipeTo(store, mutation = (_, p) => p) {
  class Piper extends PureComponent {
    componentDidUpdate() {
      store.setState(mutation, this.props)
    }

    render = () => null
  }
  return Piper
}

export const context = () =>
  ({
    name: 'context',
    call(store) {
      Object.defineProperties(store, {
        __isContext: {
          value: true
        },
        Consumer: {
          value: props => <State store={store} {...props}/>
        },
        get: {
          value: fn => <State store={store}>{fn}</State>
        }
      })
    }
  })

export const createContext = context()

export function connect(store, getter = s => s, setter = () => ({})) {
  const Context = store.__isContext ? store : store.plugin(context())
  return Wrapped => p => (
    <Context.Consumer getter={getter} setter={setter}>
      {
        selected => <Wrapped {...selected} {...p}/>
      }
    </Context.Consumer>
  )
}

export function useReim(store, getter = s => s) {
  const {useState, useEffect} = require('react')

  if (!useState) {
    throw new Error('React@16.7+ is required to use Hooks')
  }

  const [state, setState] = useState(store.snapshot(getter))

  useEffect(() => () => store.unsubscribe(setState))

  store.subscribe(setState, {getter})

  return [state, store.set]
}
