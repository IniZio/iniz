import reim from 'reim'
import skygear from 'skygear'

const store = reim({
  profile: new (skygear.Record.extend('profile'))({
    name: 'John Cena'
  })
})

export default store
