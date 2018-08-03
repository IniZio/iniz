/* eslint react/prop-types: 0 */
import React from 'react'

import Subscriber from '../components/subscriber'

function createConsumer(Consumer) {
  return (
    props => (
      <Consumer>
        {
          store => <Subscriber store={store} selector={props.selector}>{props.children}</Subscriber>
        }
      </Consumer>
    )
  )
}

export default createConsumer
