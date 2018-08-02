import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-reim'

import TodoStore, {effects, mutations} from '../stores/todo'

class TodoInput extends PureComponent {
  handleTodoChange = e => {
    e.preventDefault()
    TodoStore.commit(mutations.changeCurrTodo)({value: e.target.value})
  }

  handleAddTodo = () => {
    this.props.onAddTodo(this.props.currTodo)
      .then(TodoStore.commit(state => {
        state.currTodo = {value: ''}
      }))
  }

  render() {
    const {currTodo} = this.props

    return (
      <div>
        <input value={currTodo.value} onChange={this.handleTodoChange}/>
        <button onClick={this.handleAddTodo}>Add</button>
      </div>
    )
  }
}

TodoInput.defaultProps = {
  onAddTodo() {},
  currTodo: {value: ''}
}

TodoInput.propTypes = {
  onAddTodo: PropTypes.func,
  currTodo: PropTypes.shape({
    value: PropTypes.string
  })
}

export default connect(TodoStore, state => ({currTodo: state.currTodo, onAddTodo: TodoStore.dispatch(effects.addTodo)}))(TodoInput)
