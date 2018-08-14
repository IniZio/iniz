import Storage from 'dom-storage'
import {store} from '../../reim'
import persist from '../src'

test('can be created', () => {
  const tstore = store({
    abc: 12
  }, {
    name: 'xyz',
    plugins: [
      persist()
    ]
  })

  tstore.setState(state => {
    state.abc += 100
  })

  expect(tstore.state.abc).toBe(112)
})

test('replace store state and should subscribe to change when initialized', () => {
  const storage = new Storage()
  storage.setItem('reim/abc', JSON.stringify({persisted: 'json'}))

  const st = store({
    xx: 234
  }, {
    name: 'abc'
  })

  st.subscribe = jest.fn()

  const plugin = persist({storage})

  plugin.call(st)

  expect(st.state).toEqual({
    xx: 234,
    persisted: 'json'
  })
  expect(st.subscribe).toBeCalled()
})

test('should not replace store state when saved state is invalid', () => {
  const storage = new Storage()
  storage.setItem('reim/abc', 'invalid')

  const st = store({
    xx: 234
  }, {name: 'abc'})

  st.subscribe = jest.fn()
  st.setState = jest.fn()

  const plugin = persist({storage})

  plugin.call(st)

  expect(st.setState).not.toBeCalled()
  expect(st.subscribe).toBeCalled()
})

test('should merge saved and current store recursively and replace values', () => {
  const storage = new Storage()
  storage.setItem('reim/abc', JSON.stringify({xx: [12, 33], zz: {ee: 38}}))

  const st = store({
    xx: [234],
    y: 'as',
    zz: {
      mag: 11
    }
  }, {name: 'abc'})

  st.subscribe = jest.fn()

  const plugin = persist({storage})

  plugin.call(st)

  expect(st.state).toEqual({xx: [12, 33], y: 'as', zz: {mag: 11, ee: 38}})

  expect(st.subscribe).toBeCalled()
})
