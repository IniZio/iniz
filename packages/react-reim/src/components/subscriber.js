import {Component} from 'react'
import PropTypes from 'prop-types'
import reim from 'reim'
import {context} from '..'
import isFunction from 'lodash/isFunction'

class Subscriber extends Component {
  state = {
    isInitialized: false,
    getterCache: {},
    setterCache: {}
  }

  componentDidMount() {
    this.store = this.props.store || reim({}).plugin(context())
    if (this.props.initial) {
      this.store.reset(this.props.initial)
    }

    this.updateGetterCache()
    this.updateSetterCache()

    if (isFunction(this.props.onChange)) {
      this.store.subscribe(this.props.onChange)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      (nextProps.getter !== this.props.getter || nextState.getterCache !== this.state.getterCache) ||
      (nextProps.setter !== this.props.setter || nextState.setterCache !== this.state.setterCache) ||
      (nextProps.onChange !== this.props.onChange) ||
      (nextProps.children !== this.props.children)
    )
  }

  updateGetterCache() {
    if (this._handler) {
      this.store.unsubscribe(this._handler)
    }
    this._handler = this.store.subscribe(getterCache => {
      this.setState({isInitialized: true, getterCache})
    }, {
      immediate: true,
      getter: this.props.getter
    })
  }

  updateSetterCache() {
    this.setState({
      setterCache: this.props.setter(this.store)
    })
  }

  componentDidUpdate(prevProps, prevState) {
    // User changed getter
    if (prevProps.getter !== this.props.getter && prevState.getterCache === this.state.getterCache) {
      this.updateGetterCache()
    }
    if (prevProps.setter !== this.props.setter && prevState.setterCache === this.state.setterCache) {
      this.updateSetterCache()
    }
    if (prevProps.onChange !== this.props.onChange) {
      this.store.unsubscribe(prevProps.onChange)
      if (isFunction(this.props.onChange)) {
        this.store.subscribe(this.props.onChange)
      }
    }
  }

  componentWillUnmount() {
    this.store.unsubscribe(this._handler)
  }

  render() {
    const {children} = this.props
    const {getterCache, setterCache, isInitialized} = this.state

    return isInitialized ? (typeof children === 'function' ? children({...setterCache, ...getterCache}, this.store) : children) : null
  }
}

Subscriber.defaultProps = {
  store: null,
  getter(s) {
    return s
  },
  setter() {
    return {}
  },
  initial: null,
  onChange: null
}

Subscriber.propTypes = {
  children: PropTypes.func.isRequired,
  store: PropTypes.any,
  getter: PropTypes.func,
  setter: PropTypes.func,
  initial: PropTypes.object,
  onChange: PropTypes.func
}

export default Subscriber
