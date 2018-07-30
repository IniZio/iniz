import React from 'react'

import TodoStore from '../stores/todo'
import TodoWidget from './todo-widget'

const App = () => (
  <TodoStore.Provider>
    <div>
      <h1>App</h1>
      <TodoWidget/>
    </div>
  </TodoStore.Provider>
)

export default App
