import React, {PureComponent} from 'react'

import Subscriber from './components/subscriber'

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
          value: props => <Subscriber store={store} {...props}/>
        },
        get: {
          value: fn => <Subscriber store={store}>{fn}</Subscriber>
        }
      })
    }
  })

export const createContext = context()

// Disposable store component
export const State = p => <Subscriber {...p}/>

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
