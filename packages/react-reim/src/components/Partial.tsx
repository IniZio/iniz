import * as React from 'react'

import context from '../context'
import State, {StateProps} from './State'

export interface PartialProps extends StateProps {}

export default (p: PartialProps) => <context.Consumer>{ctx => <State store={ctx} {...p}/>}</context.Consumer>
