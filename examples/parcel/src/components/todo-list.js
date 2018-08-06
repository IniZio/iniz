import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-reim'

import TodoStore, {mutations} from '../stores/todo'
import TodoItem from './todo-item'

class TodoList extends PureComponent {
  render() {
    const {todos} = this.props

    return (
      <ul>
        {
          todos.map((todo, index) => (
            <TodoItem
              key={JSON.stringify(todo)}
              onRemove={() => this.props.removeTodo(index)}
              todo={todo}
            />
          ))
        }
      </ul>
    )
  }
}

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string
    })
  ).isRequired
}

export default connect(
  TodoStore,
  state => ({todos: state.todos}),
  ({setState}) => ({
    removeTodo: index => {
      setState(mutations.removeTodo(index))
    }
  })
)(TodoList)
