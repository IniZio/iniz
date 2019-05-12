export function reporter(callback = (...args: any[]) => {}) {
  return store => {
    store.subscribe((snapshot, {action, payload}) => {
      const {name} = action

      const meta = {name, snapshot, payload}

      callback(meta, store)
      return store
    })
  }
}

export default reporter
