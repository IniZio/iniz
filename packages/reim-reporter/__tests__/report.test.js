import {store} from '../../reim/src'
import {reporter} from '../src'

test('can be created', () => {
  const tstore = store({
    abc: 12
  }, {
    name: 'xyz',
    plugins: [
      reporter()
    ]
  })

  const addHundred = state => {
    state.abc += 100
  }

  tstore.setState(addHundred)

  expect(tstore.state.abc).toBe(112)
})

test('should trigger callback on setState with correct meta', () => {
  const report = jest.fn(meta => meta)

  const tstore = store({
    abc: 12
  }, {
    name: 'xyz',
    plugins: [
      reporter(report)
    ]
  })

  expect(report).toHaveBeenCalledTimes(0)

  const addAmount = (state, amount) => {
    state.abc += amount
  }

  tstore.setState(addAmount, 6)

  expect(report).toHaveBeenCalledTimes(1)

  expect(report).toHaveNthReturnedWith(1, {
    name: 'addAmount',
    payload: [6],
    snapshot: {abc: 12 + 6}
  })
})
