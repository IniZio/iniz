import nanoid from 'nanoid'
import isFunction from 'lodash/isFunction'
import reim from 'reim'

export const task = (func, subscriber) => {
  const id = nanoid()
  const store = reim({status: 'initialized'}, {name: `$task/${id}`})

  if (isFunction(subscriber)) {
    store.subscribe(subscriber)
  }

  const task = async (...args) => {
    let result = null
    try {
      store.set(() => ({status: 'pending'}))
      result = await func(...args)
      store.set(() => ({status: 'resolved', result}))
      return result
    } catch (error) {
      store.set(() => ({status: 'rejected', error}))
      throw error
    }
  }

  store.exec = task

  return store
}

export default task
