import {register} from 'reim'
import {createContext} from 'react-reim'

const store = createContext(register({
  todos: [],
  currTodo: {value: ''}
}))

export const mutations = {
  changeCurrTodo: todo => state => {
    state.currTodo = todo
  },
  removeTodo: index => state => {
    state.todos.splice(index, 1)
  }
}

export default store
