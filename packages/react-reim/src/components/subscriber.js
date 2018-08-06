import React, {Component} from 'react'
import PropTypes from 'prop-types'

import RenderPure from './render-pure'

class Subscriber extends Component {
  state = {
    isInitialized: false,
    getterCache: {},
    setterCache: {}
  }

  componentDidMount() {
    this.updateGetterCache()
    this.updateSetterCache()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      (nextProps.getter !== this.props.getter || nextState.getterCache !== this.state.getterCache) ||
      (nextProps.setter !== this.props.setter || nextState.setterCache !== this.state.setterCache)
    )
  }

  updateGetterCache() {
    if (this._handler) {
      this.props.store.unsync(this._handler)
    }
    this._handler = this.props.store.sync(getterCache => {
      this.setState({isInitialized: true, getterCache})
    }, {
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
  }

  componentWillUnmount() {
    this.props.store.unsync(this._handler)
  }

  render() {
    const {children} = this.props
    const {getterCache, setterCache, isInitialized} = this.state

    return isInitialized ? <RenderPure {...setterCache} {...getterCache}>{children}</RenderPure> : null
  }
}

Subscriber.defaultProps = {
  getter(s) {
    return s
  },
  setter() {
    return {}
  }
}

Subscriber.propTypes = {
  children: PropTypes.func.isRequired,
  store: PropTypes.any.isRequired,
  getter: PropTypes.func,
  setter: PropTypes.func
}

export default Subscriber
