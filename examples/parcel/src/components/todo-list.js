import React, {PureComponent} from 'react'
import {connect} from 'react-reim'

import TodoStore, {mutations} from '../stores/todo'
import TodoItem from './todo-item'

class TodoList extends PureComponent {
  state = {
    todos: []
  }

  constructor() {
    super()
  }

  render() {
    const {todos} = this.props

    return (
      <ul>
        {
          todos.map((todo, index) => <TodoItem key={JSON.stringify(todo)} onRemove={() => TodoStore.commit(mutations.removeTodo)(index)} todo={todo}/>)
        }
      </ul>
    )
  }
}

export default connect(TodoStore, state => ({todos: state.todos}))(TodoList)
