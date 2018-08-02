import React, {PureComponent, Component} from 'react'
import produce from 'immer'
import {register} from 'reim'

class Subscriber extends Component {
  state = {
    isInitialized: false,
    selected: null
  }

  componentDidMount() {
    this.updateSubscription()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.selector !== this.props.selector || nextState.selected !== this.state.selected)
  }

  updateSubscription() {
    if (this._handler) {
      this.props.store.unsubscribe(this._handler)
    }
    this._handler = this.props.store.subscribe(selected => {
      this.setState({isInitialized: true, selected})
    }, {
      selector: this.props.selector
    })
  }

  componentDidUpdate(prevProps, prevState) {
    // User changed selector
    if (prevProps.selector !== this.props.selector && prevState.selected === this.state.selected) {
      this.updateSubscription()
    }
  }

  componentWillUnmount() {
    this.props.store.unsubscribe(this._handler)
  }

  render() {
    const {children, store} = this.props
    const {selected, isInitialized} = this.state

    const fn = ({__obj, ...rest}) => children(__obj ? rest : rest.selected, store)
    const isObject = selected === Object(selected) && !Array.isArray(selected)
    const props = isObject ? selected : { selected }

    return isInitialized ? <RenderPure __obj={isObject} {...props} children={fn} /> : null
  }
}

class RenderPure extends PureComponent {
  render() {
    const { children, ...props } = this.props
    return typeof children === 'function' ? children(props) : children
  }
}

export default function(store) {
  const Context = React.createContext()

  const res = {
    Consumer: ({selector, children}) => (
      <Context.Consumer>
        {
          store => <Subscriber store={store} selector={selector}>{children}</Subscriber>
        }
      </Context.Consumer>
    ),
    Provider({children}) {
      return (
        <Context.Provider value={store}>
          <RenderPure>{children}</RenderPure>
        </Context.Provider>
      )
    }
  }

  Object.assign(store, res)
  return store
}
