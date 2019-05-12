/* eslint react/prop-types: 0 */
/* eslint-disable-next-line import/no-extraneous-dependencies  */
import * as renderer from 'react-test-renderer'

import * as React from 'react'
import reim from 'reim'
import {useReim} from '../src'

test('Hook should return store value on component mount', () => {
  const store = reim({level: 10}, {actions: {levelup: () => s => {s.level += 2}}})

  function TestComponent() {
    const [state] = useReim(store)

    return (
      <div>
        <div id="level">{state.level}</div>
      </div>
    )
  }

  const component = renderer.create(<TestComponent/>)
  renderer.act(() => void store.levelup())

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Hook should only cause rerender on getter cache miss', () => {
  const loc = reim({a: 1, b: 2, c: 3}, {actions: {addC: () => state => {state.c++}, addB: () => state => {state.b++}}})

  const didUpdate = jest.fn()

  function TestComponent() {
    const [d] = useReim(loc, {filter: state => state.a + state.b})

    React.useEffect(didUpdate)

    return <div>{d}</div>
  }

  let component;

  renderer.act(() => void (component = renderer.create(<TestComponent/>)))
  expect(didUpdate).toBeCalledTimes(1)
  renderer.act(() => void loc.addC())
  expect(didUpdate).toBeCalledTimes(1)
  expect(component.toJSON()).toMatchSnapshot()
  renderer.act(() => void loc.addB())
  expect(didUpdate).toBeCalledTimes(2)
  expect(component.toJSON()).toMatchSnapshot()
})

test('Hook should refresh according to dependencies', () => {
  const store = reim({count: 40})
  let set
  let finalState1
  let finalState2

  function TestComponent() {
    const [state, setState] = React.useState(5)
    set = setState
    const [reimState1] = useReim(store, {filter: s => ({final: s.count + state})})
    const [reimState2] = useReim(store, {filter: s => ({final: s.count + state})}, [state])
    finalState1 = reimState1
    finalState2 = reimState2

    return (
      <div/>
    )
  }

  const component = renderer.create(<TestComponent/>)
  expect(finalState1.final).toEqual(45)

  renderer.act(() => void set(30))
  component.update(<TestComponent/>)
  expect(finalState1.final).toEqual(45)
  expect(finalState2.final).toEqual(70)
})
