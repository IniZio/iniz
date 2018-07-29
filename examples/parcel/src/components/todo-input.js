import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

import TodoStore, {effects, mutations} from '../stores/todo'

class TodoInput extends PureComponent {
  state = {
    currTodo: {value: ''}
  }

  constructor() {
    super()
    TodoStore.subscribe(state => {
      this.setState({
        currTodo: state.currTodo
      })
    }, {
      selector: state => ({currTodo: state.currTodo})
    })
  }

  handleTodoChange = e => {
    e.preventDefault()
    TodoStore.commit(mutations.changeCurrTodo)({value: e.target.value})
  }

  handleAddTodo = () => {
    this.props.onAddTodo(this.state.currTodo)
      .then(TodoStore.commit(state => {
        state.currTodo = {value: ''}
      }))
  }

  render() {
    const {currTodo} = this.state

    return (
      <div>
        <input value={currTodo.value} onChange={this.handleTodoChange}/>
        <button onClick={this.handleAddTodo}>Add</button>
      </div>
    )
  }
}

TodoInput.defaultProps = {
  onAddTodo() {}
}

TodoInput.propTypes = {
  onAddTodo: PropTypes.func
}

export default p => <TodoInput onAddTodo={TodoStore.dispatch(effects.addTodo)} {...p}/>
