import * as Reim from 'reim'

const store = new Reim.Store({
  todos: [],
  currTodo: {value: ''}
})

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
  }
}

export default store
