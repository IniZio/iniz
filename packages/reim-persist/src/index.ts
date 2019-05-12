import {merge} from 'lodash'

function canWriteStorage(storage) {
  try {
    storage.setItem('@@', 1)
    storage.removeItem('@@')
    return true
  } catch (error) {}

  return false
}

function snapshot(key, storage, value?: any) {
  try {
    value = storage.getItem(key)
    return typeof value === 'undefined' ? undefined : JSON.parse(value)
  } catch (error) {}

  return undefined
}

function set(key, state, storage) {
  return storage.setItem(key, JSON.stringify(state))
}

export default function persist(options: any = {}) {
  const storage =
    options.storage ||
    (typeof window === 'undefined' ? null : window && window.localStorage)

  if (!canWriteStorage(storage)) {
    throw new Error('Invalid storage given')
  }

  return (store): void => {
    // console.log('persist store? ', store)

    if (!store.name || store.name.length <= 0) {
      throw new Error(
        'You cannot persist an anonymous store, use `name` option in store'
      )
    }

    const key = `reim/${store.name}`
    const saved = snapshot(key, storage)
    if (typeof saved === 'object' && saved !== null) {
      store.reset(merge({}, store._state, saved))
    }

    store.subscribe(
      state => {
        set(key, state, storage)
      },
      {...options.subscriber, immediate: true}
    )
  }
}
