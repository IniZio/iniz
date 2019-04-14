import reim, {toStream} from '../src'

test('store a store', () => {
  const tstore = reim({abc: 12})

  expect(tstore.snapshot(s => s.abc)).toBe(12)
})

test('set', () => {
  const store = reim({foo: 17, bb: 2})
    .actions({
      add: () => state => void (state.foo += 11),
      withbb: () => ({bb: 100})
    })

  store.add()

  expect(store.snapshot(s => s.foo)).toBe(28)

  store.withbb()

  expect(store.snapshot(s => s.foo)).toBe(28)
  expect(store.snapshot(s => s.bb)).toBe(100)
})

test('snapshot', () => {
  const store = reim({par: '123', bam: 942})

  expect(store.snapshot('par')).toBe('123')
  expect(store.snapshot(state => state.bam)).toBe(942)
})

describe('subscription', () => {
  test('subscribe to store', () => {
    const store = reim({mag: 75})
      .actions({
        minus: () => state => void (state.mag -= 10)
      })

    const updated = jest.fn()
    // Should be called on subscribe also for initial fetch
    store.subscribe(updated)
    store.minus()
    expect(updated).toBeCalledTimes(1)
  })

  test('unsubscribe from store', () => {
    const store = reim({poi: 500})
      .actions({
        add: () => state => void (state.poi += 30),
        little: () => state => void (state.poi += 10)
      })

    const updated = jest.fn()

    const handler = store.subscribe(updated)

    store.add()
    expect(updated).toBeCalledTimes(1)

    store.unsubscribe(handler)
    store.little()
    expect(updated).toBeCalledTimes(1)
  })
})

test('should be able to reset', () => {
  const store = reim({count: 123})
    .actions({
      hundred: () => ({count: 100})
    })

  store.hundred()

  store.reset()

  store.reset()

  expect(store.snapshot()).toMatchSnapshot()
})

test('should be able to reset to give value', () => {
  const store = reim({count: 123})
    .actions({
      hundred: () => ({count: 100})
    })

  store.reset({count: 999})

  expect(store.snapshot()).toMatchSnapshot()
})

describe('observable', () => {
  test('create a stream from store', () => {
    const store = reim({count: 123})

    const stream = toStream(store)
    expect(stream.subscribe().unsubscribe).toBeInstanceOf(Function)
  })
})
