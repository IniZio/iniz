/* eslint react/prop-types: 0 */
import React, {Fragment} from 'react'

function createProvider() {
  return (
    props => (
      <Fragment>
        {props.children}
      </Fragment>
    )
  )
}

export default createProvider
