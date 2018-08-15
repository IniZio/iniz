import React, {PureComponent} from 'react'

import createConsumer from './factories/consumer'
import createProvider from './factories/provider'

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

export function createContext(store) {
  if (store && store.__isStore) {
    const res = {
      get __isContext() {
        return true
      },
      Consumer: createConsumer(store),
      Provider: createProvider(store)
    }

    Object.assign(store, res)
    return store
  }
  // const options = store

  return {
    name: 'context',
    call(store) {
      const res = {
        get __isContext() {
          return true
        },
        Consumer: createConsumer(store),
        Provider: createProvider(store)
      }

      Object.assign(store, res)
      return store
    }
  }
}

export function context(register) {
  return (...args) => createContext(register(...args))
}

export function connect(store, getter = s => s, setter = () => ({})) {
  const Context = store.__isContext ? store : store.plugin(createContext)
  return Wrapped => p => (
    <Context.Consumer getter={getter} setter={setter}>
      {
        (getter, setter) => <Wrapped {...setter} {...getter} {...p}/>
      }
    </Context.Consumer>
  )
}
