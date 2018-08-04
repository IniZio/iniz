import React, {Component} from 'react'
import PropTypes from 'prop-types'
import isPlainObject from 'lodash/isPlainObject'

import RenderPure from './render-pure'

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
    const isObject = isPlainObject(selected)
    const props = isObject ? selected : {selected}

    return isInitialized ? <RenderPure __obj={isObject} {...props}>{fn}</RenderPure> : null
  }
}

Subscriber.defaultProps = {
  selector(s) {return s}
}

Subscriber.propTypes = {
  children: PropTypes.func.isRequired,
  store: PropTypes.any.isRequired,
  selector: PropTypes.func
}

export default Subscriber
