import {register} from 'reim'
import createContext from 'react-reim'

const store = createContext(register({
  todos: [],
  currTodo: {value: ''}
}))

export const effects = {
  addTodo: todo => {
    console.log('gonna add todo')
    return ({todos}) => {
      todos.push(todo)
    }
  }
}

export const mutations = {
  changeCurrTodo: (state, todo) => {
    state.currTodo = todo
  },
  removeTodo: (state, index) => {
    state.todos.splice(index, 1)
  }
}

export default store
