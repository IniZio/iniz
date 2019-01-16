import {PureComponent} from 'react'
import PropTypes from 'prop-types'
import reim from 'reim'

class State extends PureComponent {
  state = {
    isInitialized: false,
    getterCache: {},
    setterCache: {}
  }

  componentDidMount() {
    this.store = this.props.store || reim(this.props.initial || {})

    this.setGetter()
    this.setSetter()
  }

  componentDidUpdate(prevProps) {
    if (!this.props.store && prevProps.initial !== this.props.initial) {
      this.store.reset(this.props.initial)
    }

    // User changed getter / setter functions
    if (prevProps.getter !== this.props.getter) {
      this.setGetter()
    }
    if (prevProps.setter !== this.props.setter) {
      this.setSetter()
    }
  }

  componentWillUnmount() {
    this.store.unsubscribe(this._handler)
  }

  setGetter() {
    if (this._handler) {
      this.store.unsubscribe(this._handler)
    }
    this._handler = this.store.subscribe(getterCache => {
      this.setState({getterCache})
      if (this.state.isInitialized) {
        this.props.onChange(getterCache)
      }
      this.setState({isInitialized: true})
    }, {
      immediate: true,
      getter: this.props.getter
    })
  }

  setSetter() {
    const setters = [].concat(this.props.setter)
      .reduce((acc, val) => ({
        ...acc,
        ...(typeof val === 'function' ? val(this.store) : val)
      }), {})

    this.setState({
      setterCache: Object.keys(setters)
        .reduce((acc, k) => ({
          ...acc,
          [k]: (...args) => {
            const v = setters[k](...args)
            if (typeof v === 'function') {
              try {
                this.store.set(v)
              } catch (e) {
                return v
              }
            }
            return v
          }
        }), {})
    })
  }

  render() {
    const {children} = this.props
    const {getterCache, setterCache, isInitialized} = this.state

    if (!isInitialized) {
      return null
    }

    return (typeof children === 'function' ? children({...setterCache, ...getterCache}, this.store) : (children || getterCache))
  }
}

State.defaultProps = {
  children: null,
  store: null,
  getter(s) {
    return s
  },
  setter() {
    return {}
  },
  initial: null,
  onChange() {}
}

State.propTypes = {
  children: PropTypes.func,
  store: PropTypes.any,
  getter: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  setter: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  initial: PropTypes.object,
  onChange: PropTypes.func
}

export default State
