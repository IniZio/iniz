import React, {PureComponent} from 'react'

import createConsumer from './factories/consumer'

// Syncs props to store
export function pipeTo(store, mutation = (_, p) => p) {
  class Piper extends PureComponent {
    componentDidUpdate() {
      store.setState(mutation, this.props)
    }

    render() {
      return <div/>
    }
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
          value: createConsumer(store)
        }
      })
    }
  })

export const createContext = context()

export function connect(store, getter = s => s, setter = () => ({})) {
  const Context = store.__isContext ? store : store.plugin(context)
  return Wrapped => p => (
    <Context.Consumer getter={getter} setter={setter}>
      {
        (getter, setter) => <Wrapped {...setter} {...getter} {...p}/>
      }
    </Context.Consumer>
  )
}
