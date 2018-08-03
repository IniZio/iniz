import {PureComponent} from 'react'
import PropTypes from 'prop-types'

class RenderPure extends PureComponent {
  render() {
    const {children, ...props} = this.props
    return typeof children === 'function' ? children(props) : children
  }
}

RenderPure.propTypes = {
  children: PropTypes.any
}

export default RenderPure
