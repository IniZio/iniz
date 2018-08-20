import reim from 'reim'
import {context} from 'react-reim'

const store = reim({
  todos: [],
  currTodo: {value: ''}
}, {
  plugins: [context()]
})

export const mutations = {
  changeCurrTodo: todo => state => {
    state.currTodo = todo
  },
  removeTodo: index => state => {
    state.todos.splice(index, 1)
  }
}

export default store
