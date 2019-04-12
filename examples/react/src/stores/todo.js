import reim from 'reim'
import react from 'react-reim'

const store = reim({
  todos: [],
  currTodo: {value: ''}
}, {
  plugins: [react()]
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
