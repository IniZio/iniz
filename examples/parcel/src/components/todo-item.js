import React from 'react'
import PropTypes from 'prop-types'

const TodoItem = ({todo, onRemove}) => (
  <li>
    <button onClick={onRemove}>x</button>
    <div>{todo.value}</div>
  </li>
)

TodoItem.defaultProps = {
  todo: {value: ''},
  onRemove() {}
}

TodoItem.propTypes = {
  todo: PropTypes.object,
  onRemove: PropTypes.func
}

export default TodoItem
