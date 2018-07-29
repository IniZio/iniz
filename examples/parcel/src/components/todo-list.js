import React, {Component} from 'react'

import TodoStore, {mutations} from '../stores/todo'
import TodoItem from './todo-item'
import TodoInput from './todo-input'

class TodoList extends Component {
  state = {
    todos: []
  }

  constructor() {
    super()
    TodoStore.subscribe(state => {
      this.setState({
        todos: state.todos
      })
    })
  }

  render() {
    const {todos} = this.state

    return (
      <div>
        <ul>
          {
            todos.map((todo, index) => <TodoItem key={JSON.stringify(todo)} onRemove={() => TodoStore.commit(mutations.removeTodo)(index)} todo={todo}/>)
          }
        </ul>
        <TodoInput/>
      </div>
    )
  }
}

export default TodoList
