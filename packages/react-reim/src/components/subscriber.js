import {Component} from 'react'
import PropTypes from 'prop-types'
import isFunction from 'lodash/isFunction'

class Subscriber extends Component {
  state = {
    getterCache: {},
    setterCache: {}
  }

  componentDidMount() {
    if (this.props.initial) {
      this.props.store.reset(this.props.initial)
    }

    this.updateGetterCache()
    this.updateSetterCache()

    if (isFunction(this.props.onChange)) {
      this.props.store.subscribe(this.props.onChange)
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
      this.props.store.unsubscribe(this._handler)
    }
    this._handler = this.props.store.subscribe(getterCache => {
      this.setState({getterCache})
    }, {
      immediate: true,
      getter: this.props.getter
    })
  }

  updateSetterCache() {
    this.setState({
      setterCache: this.props.setter(this.props.store)
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
      this.props.store.unsubscribe(prevProps.onChange)
      if (isFunction(this.props.onChange)) {
        this.props.store.subscribe(this.props.onChange)
      }
    }
  }

  componentWillUnmount() {
    this.props.store.unsubscribe(this._handler)
  }

  render() {
    const {children, store} = this.props
    const {getterCache, setterCache} = this.state

    return (typeof children === 'function' ? children({...setterCache, ...getterCache}, store) : children)
  }
}

Subscriber.defaultProps = {
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
  store: PropTypes.any.isRequired,
  getter: PropTypes.func,
  setter: PropTypes.func,
  initial: PropTypes.object,
  onChange: PropTypes.func
}

export default Subscriber
