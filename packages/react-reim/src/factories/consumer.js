/* eslint react/prop-types: 0 */
import React from 'react'

import Subscriber from '../components/subscriber'

function createConsumer(store) {
  return (
    props => <Subscriber store={store} getter={props.getter} setter={props.setter}>{props.children}</Subscriber>
  )
}

export default createConsumer
