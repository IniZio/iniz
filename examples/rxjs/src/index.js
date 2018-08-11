import React from 'react'
import {render} from 'react-dom'
import {setObservableConfig} from 'recompose'
import {Observable} from 'rxjs'

import App from './components/app'

setObservableConfig({
  fromESObservable: config => new Observable(config.subscribe),
  toESObservable: stream => stream
})

render(
  <App count={1001}/>,
  document.getElementById('app')
)
