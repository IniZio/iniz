/* eslint react/prop-types: 0 */
import React from 'react'

import RenderPure from '../components/render-pure'

function createProvider(Provider, store) {
  return (
    props => (
      <Provider value={store}>
        <RenderPure>{props.children}</RenderPure>
      </Provider>
    )
  )
}

export default createProvider
