/* eslint react/prop-types: 0 */
/* eslint-disable-next-line import/no-extraneous-dependencies  */
import * as renderer from 'react-test-renderer'
import * as React from 'react'
import reim from 'reim'
import {react, connect, State} from '../src'

test('react returns Consumer', () => {
  const store = reim({yer: 43}).plugin(react())

  expect(store.Consumer).toBeDefined()
})

test('Storeless State should reset on initial prop change', () => {
  let changeInitial

  function TestComponent() {
    const [initial, setInitial] = React.useState({level: 10})

    changeInitial = () => setInitial({level: 10000})

    return (
      <State initial={initial}>
        {({level}) => (
          <h1>{level}</h1>
        )}
      </State>
    )
  }

  const component = renderer.create(<TestComponent/>)
  expect(component.toJSON()).toMatchSnapshot()

  changeInitial()
  expect(component.toJSON()).toMatchSnapshot()
})

test('Consumer should have change in store state reflected', () => {
  const store = reim({yer: 43}).plugin(react())

  const component = renderer.create(
    <store.Consumer>
      {
        state => (
          <div>
            <div id="value">{state.yer}</div>
          </div>
        )
      }
    </store.Consumer>
  )
  store.set(state => {
    state.yer += 88
  })

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Existing store Consumer should NOT be able to set initial value', () => {
  const store = reim({yer: 9}).plugin(react())

  const component = renderer.create(
    <store.Consumer initial={{yer: 10}}>
      {
        state => (
          <div>
            <div id="value">{state.yer}</div>
          </div>
        )
      }
    </store.Consumer>
  )

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('get should have change in store state reflected', () => {
  const {get, set} = reim({yer: 43}).plugin(react())

  const component = renderer.create(
    get(state => (
      <div>
        <div id="value">{state.yer}</div>
      </div>
    ))
  )

  const component1 = renderer.create(get('yer'))

  set(state => {
    state.yer += 88
  })

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()

  expect(component1.toJSON()).toMatchSnapshot()
})

test('Unmount Cunsumer should unsubscribe', () => {
  const store = reim({yer: 43}).plugin(react())

  const getter = jest.fn()

  const component = renderer.create(
    <store.Consumer getter={getter}>
      {
        state => (
          <div>
            <div id="value">{state.yer}</div>
          </div>
        )
      }
    </store.Consumer>
  )
  store.set(state => {
    state.yer += 88
  })
  expect(getter).toBeCalledTimes(2)
  component.unmount()
  store.set(state => {
    state.yer *= 88
  })
  expect(getter).toBeCalledTimes(2)
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
        <State initial={{value: 88}} onChange={onChange}>
          {
            ({value}, {set}) => {
              increment = () => set({value: value + 1})
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

test('Properties not included in getter should not trigger update', () => {
  const store = reim({hel: 43, gee: 10}).plugin(react())

  const updated = jest.fn()

  class Listen extends React.Component<{hel: any}> {
    componentDidUpdate = updated

    render() {
      return <div>{this.props.hel}</div>
    }
  }

  renderer.create(
    <store.Consumer getter={state => ({hel: state.hel})}>
      {
        state => (
          <Listen {...state}/>
        )
      }
    </store.Consumer>
  )
  store.set(state => {
    state.hel -= 22
  })
  expect(updated).toBeCalledTimes(1)
  store.set(state => {
    state.gee += 88
  })
  expect(updated).toBeCalledTimes(1)
})

test('use convenience method connect', () => {
  const store = reim({bom: 19})

  const Container = connect(store, state => ({bom: state.bom}))(
    state => <div>{JSON.stringify(state)}</div>
  )

  const component = renderer.create(
    <Container/>
  )
  store.set(state => {
    state.bom += 490
  })
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('change getter', () => {
  const store = reim({dui: 12, geo: 'tie'}).plugin(react())

  class Getter extends React.Component {
    state = {
      getter: state => ({dui: state.dui})
    }

    render() {
      return (
        <store.Consumer getter={this.state.getter}>
          {
            state => (
              <div>
                <div id="selected">{JSON.stringify(state)}</div>
              </div>
            )
          }
        </store.Consumer>
      )
    }
  }

  const component = renderer.create(<Getter/>)
  expect(component.toJSON()).toMatchSnapshot()

  // Change in getter should change passed in state
  const {instance} = component.root
  instance.setState({getter: s => s})
  expect(component.toJSON()).toMatchSnapshot()
})
