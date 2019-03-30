import reim, {toStream} from '../src'

test('store a store', () => {
  const tstore = reim({abc: 12})

  expect(tstore.state.abc).toBe(12)
})

test('set', () => {
  const store = reim({foo: 17})

  store.set(state => {
    state.foo += 11
  })
  expect(store.state.foo).toBe(28)

  store.set({
    bb: 100
  })
  expect(store.state.foo).toBe(28)
  expect(store.state.bb).toBe(100)
})

test('snapshot', () => {
  const store = reim({par: '123', bam: 942})

  expect(store.snapshot('par')).toBe('123')
  expect(store.snapshot(state => state.bam)).toBe(942)
})

describe('subscription', () => {
  test('subscribe to store', () => {
    const store = reim({mag: 75})

    const updated = jest.fn()
    // Should be called on subscribe also for initial fetch
    store.subscribe(updated)
    store.set(state => {
      state.mag -= 10
    })
    expect(updated).toBeCalledTimes(1)
  })

  test('unsubscribe from store', () => {
    const store = reim({poi: 500})

    const updated = jest.fn()

    const handler = store.subscribe(updated)
    store.set(state => {
      state.poi += 30
    })
    expect(updated).toBeCalledTimes(1)

    store.unsubscribe(handler)
    store.set(state => {
      state.poi *= 10
    })
    expect(updated).toBeCalledTimes(1)
  })
})

test('should be able to reset', () => {
  const store = reim({count: 123})

  store.set({abc: 'sdf'})

  store.reset()

  expect(store.state).toMatchSnapshot()
})

test('should be able to reset to give value', () => {
  const store = reim({count: 123})

  store.set({abc: 'sdf'})

  store.reset({magic: 'real'})

  expect(store.state).toMatchSnapshot()
})

describe('observable', () => {
  test('create a stream from store', () => {
    const store = reim({count: 123})

    const stream = toStream(store)
    expect(stream.subscribe().unsubscribe).toBeInstanceOf(Function)
  })
})
