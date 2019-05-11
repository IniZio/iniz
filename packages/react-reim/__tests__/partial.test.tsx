/* eslint react/prop-types: 0 */
/* eslint-disable-next-line import/no-extraneous-dependencies  */
import * as renderer from 'react-test-renderer'
import * as React from 'react'
import reim, {Actions, Filter} from 'reim'
import {State, Partial} from '../src'

test('Partial should update their own cache is invalid', () => {
  const store = reim({hel: 43, gee: 10}, {actions: {minusHel: () => state => {state.hel -= 22}, addGee: () => state => {state.gee += 22}}})

  class TestComponent extends React.Component {
    render() {
      return <State store={store}><Partial filter={s => s.hel}>{s => s}</Partial></State>
    }
  }

  let component: renderer.ReactTestRenderer

  renderer.act(() => {component = renderer.create(<TestComponent/>)})
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
  renderer.act(() => store.minusHel())
  tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
