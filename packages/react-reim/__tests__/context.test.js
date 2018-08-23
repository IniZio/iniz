/* eslint react/prop-types: 0 */
/* eslint-disable-next-line import/no-extraneous-dependencies  */
import renderer from 'react-test-renderer'
import React, {Component} from 'react'
import reim from '../../reim/src'
import {context, connect, State} from '../src'

test('context returns Consumer', () => {
  const store = reim({yer: 43}).plugin(context())

  expect(store.Consumer).toBeDefined()
})

test('Consumer should have change in store state reflected', () => {
  const store = reim({yer: 43}).plugin(context())

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
  store.setState(state => {
    state.yer += 88
  })

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Consumer should be able to set initial value', () => {
  const store = reim().plugin(context())

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
  const {get, set} = reim({yer: 43}).plugin(context())

  const component = renderer.create(
    get(state => (
        <div>
          <div id="value">{state.yer}</div>
        </div>
    ))
  )
  set(state => {
    state.yer += 88
  })

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Unmount Cunsumer should unsubscribe', () => {
  const store = reim({yer: 43}).plugin(context())

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
  store.setState(state => {
    state.yer += 88
  })
  expect(getter).toBeCalledTimes(2)
  component.unmount()
  store.setState(state => {
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

test('Properties not included in getter should not trigger update', () => {
  const store = reim({hel: 43, gee: 10}).plugin(context())

  const updated = jest.fn()

  class Listen extends Component {
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
  store.setState(state => {
    state.hel -= 22
  })
  expect(updated).toBeCalledTimes(1)
  store.setState(state => {
    state.gee += 88
  })
  expect(updated).toBeCalledTimes(1)
})

test('use convenience method connect', () => {
  const store = reim({bom: 19}).plugin(context())

  const Container = connect(store, state => ({bom: state.bom}))(
    state => <div>{JSON.stringify(state)}</div>
  )

  const component = renderer.create(
    <Container/>
  )
  store.setState(state => {
    state.bom += 490
  })
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('change getter', () => {
  const store = reim({dui: 12, geo: 'tie'}).plugin(context())

  class Getter extends Component {
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
