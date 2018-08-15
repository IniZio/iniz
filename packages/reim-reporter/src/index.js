export function reporter(callback = () => {}) {
  return {
    name: 'reporter',
    call(store) {
      store.on('setState', (mutation, ...args) => {
        const {name} = mutation
        const snapshot = store.getState()

        const meta = {name, snapshot, payload: args}

        callback(meta, store)
      })
    }
  }
}

export default reporter
