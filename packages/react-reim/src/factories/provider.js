/* eslint react/prop-types: 0 */
import React from 'react'

function createProvider(Provider, store) {
  return (
    props => (
      <Provider value={store}>
        {props.children}
      </Provider>
    )
  )
}

export default createProvider
