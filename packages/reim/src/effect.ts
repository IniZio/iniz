import {Meta} from './types'
import reim, {Reim} from '.'

type ThenArg<T> = T extends (...args: any[]) => Promise<infer TU> ? TU : T

export default function effect<TC extends((...args: any[]) => any)>(name: string, callback: TC) {
  let used = callback
  const store = reim({success: undefined, error: undefined} as {success: null | undefined | ThenArg<typeof callback>; error: null | undefined | Error})

  const task = (
    async (...args: any[]) => {
      store.set(() => ({success: undefined, error: undefined}))

      try {
        const success = await used(...args)
        store.set(() => ({success, error: undefined}))
      } catch (error) {
        store.set(() => ({success: undefined, error}))
      }
    }
  ) as typeof callback

  return Object.assign(task, store, {
    success(this: typeof store, cb: ((success: ThenArg<typeof callback>, meta: Meta) => any)) {
      return this.subscribe(({success}, meta) => {
        if (success) {
          cb(success, meta)
        }
      })
    },
    error(this: typeof store, cb: ((error: Error, meta: Meta) => any)) {
      return this.subscribe(({error}, meta) => {
        if (error) {
          cb(error, meta)
        }
      })
    },
    use(cb: any) {
      used = cb
    }
  })
}
