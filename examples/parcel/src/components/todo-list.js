import React, {Component} from 'react'

import TodoStore, {mutations} from '../stores/todo'
import TodoItem from './todo-item'

class TodoList extends Component {
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

export default p =>
  <TodoStore.Consumer selector={state => ({todos: state.todos})}>
    {
      state => <TodoList {...state} {...p}/>
    }
  </TodoStore.Consumer>
