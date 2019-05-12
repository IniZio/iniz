import reim from '../../reim/src'
import {reporter} from '../src'

test('can be created', () => {
  const tstore = reim(
    {
      abc: 12
    },
    {
      name: 'pxyz',
      actions: {
        addHundred: () => state => {
          state.abc += 100
        }
      }
    }
  ).plugin(reporter())

  tstore.addHundred()

  expect(tstore._state.abc).toBe(112)
})

test('should trigger callback on set with correct meta', () => {
  const report = jest.fn(meta => meta)

  const tstore = reim(
    {
      abc: 12
    },
    {
      name: 'wxyz'
    }
  ).plugin(reporter(report))

  expect(report).toHaveBeenCalledTimes(0)

  const addAmount = amount => state => {
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
