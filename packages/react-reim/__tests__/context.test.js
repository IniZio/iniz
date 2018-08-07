/* eslint react/prop-types: 0 */
/* eslint-disable-next-line import/no-extraneous-dependencies  */
import renderer from 'react-test-renderer'
import React, {Component} from 'react'
import {register} from '../../reim/src'
import {createContext, connect, context} from '../src'

test('context returns Consumer and Provider', () => {
  const store = context(register)({yer: 43})

  expect(store.Consumer).toBeDefined()
  expect(store.Provider).toBeDefined()
})

test('Consumer should have change in store state reflected', () => {
  const store = createContext(register({yer: 43}))

  const component = renderer.create(
    <store.Provider>
      <store.Consumer>
        {
          state => (
            <div>
              <div id="value">{state.yer}</div>
            </div>
          )
        }
      </store.Consumer>
    </store.Provider>
  )
  store.setState(state => {
    state.yer += 88
  })
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Unmount Cunsumer should unsubscribe', () => {
  const store = createContext(register({yer: 43}))

  const getter = jest.fn()

  const component = renderer.create(
    <store.Provider>
      <store.Consumer getter={getter}>
        {
          state => (
            <div>
              <div id="value">{state.yer}</div>
            </div>
          )
        }
      </store.Consumer>
    </store.Provider>
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

test('Properties not included in getter should not trigger update', () => {
  const store = createContext(register({hel: 43, gee: 10}))

  const updated = jest.fn()

  class Listen extends Component {
    componentDidUpdate = updated

    render() {
      return <div>{this.props.hel}</div>
    }
  }

  renderer.create(
    <store.Provider>
      <store.Consumer getter={state => ({hel: state.hel})}>
        {
          state => (
            <Listen {...state}/>
          )
        }
      </store.Consumer>
    </store.Provider>
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
  const store = createContext(register({bom: 19}))

  const Container = connect(store, state => ({bom: state.bom}))(
    state => <div>{JSON.stringify(state)}</div>
  )

  const component = renderer.create(
    <store.Provider>
      <Container/>
    </store.Provider>
  )
  store.setState(state => {
    state.bom += 490
  })
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('change getter', () => {
  const store = createContext(register({dui: 12, geo: 'tie'}))

  class Getter extends Component {
    state = {
      getter: state => ({dui: state.dui})
    }

    render() {
      return (
        <store.Provider>
          <store.Consumer getter={this.state.getter}>
            {
              state => (
                <div>
                  <div id="selected">{JSON.stringify(state)}</div>
                </div>
              )
            }
          </store.Consumer>
        </store.Provider>
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
