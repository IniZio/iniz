/* eslint react/prop-types: 0 */
/* eslint-disable-next-line import/no-extraneous-dependencies  */
import * as renderer from 'react-test-renderer'
import * as React from 'react'
import reim, {Actions, Filter} from 'reim'
import {withReim, State} from '../src'

test('Storeless State should reset on initial prop change', () => {
  let changeInitial

  const initial = {level: 10}
  const filter: Filter<typeof initial> = s => s.level
  const actions: Actions<typeof initial> = {increment: (count: number) => state => {state.level+=count}}

  class TestComponent extends React.Component {
    state = initial

    changeInitial = () => this.setState({level: 10000})

    componentDidMount() {
      changeInitial = this.changeInitial
    }

    render() {
      return (
        <State<null, typeof initial, typeof filter, typeof actions> initial={initial} filter={filter} actions={actions}>
          {(level, {increment}) => (
            <h1 onClick={() => increment(10)}>{level}</h1>
          )}
        </State>
      )
    }
  }

  const component = renderer.create(<TestComponent/>)
  expect(component.toJSON()).toMatchSnapshot()

  changeInitial()
  expect(component.toJSON()).toMatchSnapshot()
})

test('Consumer should have change in store state reflected', () => {
  const store = reim({yer: 43}, {actions: {add88: () => state => {state.yer += 88}}})

  const component = renderer.create(
    <State<typeof store> store={store}>
      {
        state => (
          <div>
            <div id="value">{state.yer}</div>
          </div>
        )
      }
    </State>
  )
  store.add88()

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Existing store Consumer should NOT be able to set initial value', () => {
  const store = reim({yer: 9})

  const component = renderer.create(
    <State<typeof store> store={store} initial={{yer: 10}}>
      {
        state => (
          <div>
            <div id="value">{state.yer}</div>
          </div>
        )
      }
    </State>
  )

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Unmount Cunsumer should unsubscribe', () => {
  const store = reim({yer: 43}, {actions: {add88: () => state => {state.yer += 88}}})

  const filter = s => {updated(); return s}
  const updated = jest.fn()

  const component = renderer.create(
    <State store={store} filter={filter}>
      {
        state => (
          <div>
            <div id="value">{state.yer}</div>
          </div>
        )
      }
    </State>
  )
  store.add88()
  expect(updated).toBeCalledTimes(2)
  component.unmount()
  store.add88()
  expect(updated).toBeCalledTimes(2)
})

test('State component should work', () => {
  const component = renderer.create(
    <State initial={{mm: 88}}>
      {
        ({mm}) => (
          <h1>{mm}</h1>
        )
      }
    </State>
  )

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('State onChange should trigger on state change', () => {
  const onChange = jest.fn()
  let increment

  class Container extends React.Component {
    render() {
      return (
        <State initial={{value: 88}} actions={{add: () => state => ({value: state.value + 1})}} onChange={onChange}>
          {
            ({value}, {add}) => {
              increment = add
              return <h1>{value}</h1>
            }
          }
        </State>
      )
    }
  }

  const component = renderer.create(<Container/>)

  expect(onChange).toBeCalledTimes(0)

  increment()

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()

  expect(onChange).toBeCalledTimes(1)
})

test('Properties not included in filter should not trigger update', () => {
  const store = reim({hel: 43, gee: 10}, {actions: {minusHel: () => state => {state.hel -= 22}, addGee: () => state => {state.gee += 22}}})

  const updated = jest.fn()

  class Listen extends React.Component<{hel: any}> {
    componentDidUpdate = updated

    render() {
      return <div>{this.props.hel}</div>
    }
  }

  renderer.create(
    <State store={store} filter={state => ({hel: state.hel})}>
      {
        state => (
          <Listen {...state}/>
        )
      }
    </State>
  )
  store.minusHel()
  expect(updated).toBeCalledTimes(1)
  store.addGee()
  expect(updated).toBeCalledTimes(1)
})

test('use convenience method connect', () => {
  const store = reim({bom: 19}, {actions: {add490: () => state => {
    state.bom += 490
  }}})

  const Container = withReim(store, {filter: state => ({bom: state.bom})})(
    state => <div>{JSON.stringify(state)}</div>
  )

  const component = renderer.create(
    <Container/>
  )
  store.add490()
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('change filter', () => {
  const store = reim({dui: 12, geo: 'tie'})

  class Getter extends React.Component {
    state = {
      filter: state => ({dui: state.dui})
    }

    render() {
      return (
        <State store={store} filter={this.state.filter}>
          {
            state => (
              <div>
                <div id="selected">{JSON.stringify(state)}</div>
              </div>
            )
          }
        </State>
      )
    }
  }

  const component = renderer.create(<Getter/>)
  expect(component.toJSON()).toMatchSnapshot()

  // Change in filter should change passed in state
  const {instance} = component.root
  instance.setState({filter: s => s})
  expect(component.toJSON()).toMatchSnapshot()
})
