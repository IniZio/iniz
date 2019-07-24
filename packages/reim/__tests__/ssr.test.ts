import reim from '../src'

test('snapshotting all stores', () => {
  reim({abc: 12})

  expect(reim.snapshot()).toEqual({"0": {"abc": 12}})
})

test('stringify for render to ssr string', () => {
  reim.preload({})

  reim({xyz: 345})

  expect(reim.stringify()).toBe("{\"0\":{\"xyz\":345}}")
})

test('preload states', () => {
  reim.preload({0: {bbq: 333}})

  const store = reim({bbq: 890})

  expect(store.filter('bbq')).toBe(333)
})
