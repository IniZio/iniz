import {register} from '../src'

test('register a store', () => {
  const store = register({abc: 12})

  expect(store.state.abc).toBe(12)
})

test('commit a mutation', () => {
  const store = register({foo: 17})

  store.commit((state, amount) => {
    state.foo += amount
  })(11)
  expect(store.state.foo).toBe(28)
})

test('dispatch an effect', async () => {
  const store = register({bar: -1})

  let wap = 100
  await store.dispatch(({bar}) => {
    wap += bar
    return [
      state => {
        state.bar = 10000
      }
    ]
  })()

  // Side effect should be run
  expect(wap).toBe(99)

  // Mutation returned by effect should run also
  expect(store.state.bar).toBe(10000)
})

describe('subscription', () => {
  test('subscribe to store', () => {
    const store = register({mag: 75})

    const updated = jest.fn()
    // Should be called on subscribe also for initial fetch
    store.subscribe(updated)
    store.commit(state => {
      state.mag -= 10
    })()
    expect(updated).toBeCalledTimes(2)
  })

  test('unsubscribe from store', () => {
    const store = register({poi: 500})

    const updated = jest.fn()

    const handler = store.subscribe(updated)
    store.commit(state => {
      state.poi += 30
    })()
    expect(updated).toBeCalledTimes(2)

    store.unsubscribe(handler)
    store.commit(state => {
      state.poi *= 10
    })
    expect(updated).toBeCalledTimes(2)
  })
})
