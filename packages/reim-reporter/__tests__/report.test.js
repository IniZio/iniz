import reim from '../../reim'
import {reporter} from '../src'

test('can be created', () => {
  const tstore = reim({
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

  tstore.set(addHundred)

  expect(tstore.state.abc).toBe(112)
})

test('should trigger callback on set with correct meta', () => {
  const report = jest.fn(meta => meta)

  const tstore = reim({
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

  tstore.set(addAmount, 6)

  expect(report).toHaveBeenCalledTimes(1)

  expect(report).toHaveNthReturnedWith(1, {
    name: 'addAmount',
    payload: [6],
    snapshot: {abc: 12 + 6}
  })
})
