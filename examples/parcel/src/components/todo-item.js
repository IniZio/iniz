import React from 'react'
import PropTypes from 'prop-types'

const TodoItem = ({todo}) => (
  <li>{todo.value}</li>
)

TodoItem.defaultProps = {
  todo: {value: ''}
}

TodoItem.propTypes = {
  todo: PropTypes.object
}

export default TodoItem
