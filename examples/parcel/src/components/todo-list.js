import React, {Component} from 'react'
import PropTypes from 'prop-types'

import TodoStore, {effects, mutations} from '../stores/todo'
import TodoItem from './todo-item'

class TodoList extends Component {
  state = {
    currTodo: {value: ''},
    todos: []
  }

  constructor() {
    super()
    TodoStore.subscribe(state => {
      this.setState({
        todos: state.todos,
        currTodo: state.currTodo
      })
    }, {immediate: true})
  }

  handleTodoChange = e => {
    e.preventDefault()
    TodoStore.commit(mutations.changeCurrTodo)({value: e.target.value})
  }

  handleAddTodo = () => {
    TodoStore.dispatch(effects.addTodo)(this.state.currTodo)
      .then(TodoStore.commit(state => {
        state.currTodo = {value: ''}
      }))
  }

  render() {
    const {currTodo, todos} = this.state
    const {onAddTodo} = this.props

    return (
      <div>
        <ul>
          {
            todos.map((todo, index) => <TodoItem key={index} todo={todo}/>)
          }
        </ul>
        <div>
          <input value={currTodo.value} onChange={this.handleTodoChange}/>
          <button onClick={this.handleAddTodo}>Add</button>
        </div>
      </div>
    )
  }
}

TodoList.defaultProps = {
  onAddTodo() {}
}

TodoList.propTypes = {
  onAddTodo: PropTypes.func
}

export default p => <TodoList currTodo={TodoStore.state.currTodo} onAddTodo={TodoStore.dispatch(effects.addTodo)} {...p}/>
