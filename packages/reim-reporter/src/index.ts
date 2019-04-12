export function reporter(callback = (...args: any[]) => {}) {
  return {
    name: 'reporter',
    call(store) {
      store.on('set', (mutation, ...args) => {
        const {name} = mutation
        const snapshot = store.snapshot()

        const meta = {name, snapshot, payload: args}

        callback(meta, store)
      })
    }
  }
}

export default reporter
