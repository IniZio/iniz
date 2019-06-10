# Effect

In **Reim**, an effect does not belong to a store. Instead an effect is simply a store itself that holds success and error states when the effect is executed.

```javascript
import {effect} from 'reim'

import auth$ from '../stores/auth'

const loginWithPassword = effect('login-password', async () => {
  const user = await api.login()
  auth$.init(user)
  return user
})
```

```javascript
loginWithPassword.subscribe(({success, error}) => {
  if (error) {/* blabla */}
  if (success) {/* blabla */}
})
```



