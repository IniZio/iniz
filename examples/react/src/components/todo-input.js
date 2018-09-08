import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-reim'
import skygear from 'skygear'

import TodoStore, {effects, mutations} from '../stores/todo'

class TodoInput extends PureComponent {
  handleTodoChange = e => {
    e.preventDefault()
    TodoStore.setState(mutations.changeCurrTodo({value: e.target.value}))
  }

  handleAddTodo = () => {
    this.props.onAddTodo(this.props.currTodo)

    TodoStore.setState(state => {
      state.currTodo = {value: ''}
    })
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

export default connect(
  TodoStore,
  state => ({currTodo: state.currTodo}),
  ({setState}) => ({
    onAddTodo: todo => {
      setState(({todos}) => {
        todos.push(new (skygear.Record.extend('todo'))(todo))
      })
    }
  })
)(TodoInput)
