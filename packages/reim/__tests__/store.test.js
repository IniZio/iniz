import {register} from '../src'

test('register a store', () => {
  const store = register({abc: 12})

  expect(store.state.abc).toBe(12)
})

test('setState', () => {
  const store = register({foo: 17})

  store.setState(state => {
    state.foo += 11
  })
  expect(store.state.foo).toBe(28)
})

// test('primitives Map & Set support', async () => {
//   const store = register({
//     deep: {
//       foo: {
//         bar: {
//           baz: true
//         }
//       },
//       set: new Set([{ one: "two" }, { two: "three" }]),
//       map: new Map([["one", { foo: "bar" }]]),
//       array: [{ i: 1 }, { i: 2 }, { i: 3 }, { i: 4 }, { i: 5 }]
//     }
//   })

//   const updated = jest.fn()

//   store.sync(updated)

//   expect(updated).toBeCalledTimes(1)

//   store.setState(draft => {
//     const one = draft.deep.map.get('one');
//     if (one) {
//       one.foo = 1;
//     }
//     draft.deep.set.clear();
//     draft.deep.set.add({ some: "obj" });
//   })()

//   expect(updated).toBeCalledTimes(2)
// })

describe('subscription', () => {
  test('sync to store', () => {
    const store = register({mag: 75})

    const updated = jest.fn()
    // Should be called on sync also for initial fetch
    store.sync(updated)
    store.setState(state => {
      state.mag -= 10
    })
    expect(updated).toBeCalledTimes(2)
  })

  test('unsync from store', () => {
    const store = register({poi: 500})

    const updated = jest.fn()

    const handler = store.sync(updated)
    store.setState(state => {
      state.poi += 30
    })
    expect(updated).toBeCalledTimes(2)

    store.unsync(handler)
    store.setState(state => {
      state.poi *= 10
    })
    expect(updated).toBeCalledTimes(2)
  })
})
