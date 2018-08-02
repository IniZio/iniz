import React from 'react'
import {render} from 'react-dom'

import App from './components/app'
import TodoStore from './stores/todo'

render(
  <App/>,
  document.getElementById('app')
)
