import React, {PureComponent, Component} from 'react'
import produce from 'immer'
import {register} from 'reim'

class RenderPure extends PureComponent {
  render() {
    const { children, ...props } = this.props
    return typeof children === 'function' ? children(props) : children
  }
}

export default function(store) {
  const Context = React.createContext()

  const res = {
    Consumer: ({selector = s => s, children}) => {
      const fn = ({__obj, ...rest}) => children(__obj ? rest : rest.selected, store)
      return (
        <Context.Consumer>
          {
            state => {
              const selected = produce(state, selector)
              const isObject = selected === Object(selected) && !Array.isArray(selected)
              const props = isObject ? selected : { selected }
              return <RenderPure __obj={isObject} {...props} children={fn} />
            }
          }
        </Context.Consumer>
      )
    },
    Provider: class Provider extends Component {
      state = store.state

      constructor() {
        super()
        this._handler = store.subscribe(state => {
          this.setState(state)
        })
      }

      componentWillUnmount() {
        store.unsubscribe(this._handler)
      }

      render() {
        return (
          <Context.Provider value={this.state}>
            <RenderPure>{this.props.children}</RenderPure>
          </Context.Provider>
        )
      }
    }
  }

  Object.assign(store, res)
  return store
}
