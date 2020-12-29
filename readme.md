# Auth0-Vuex

A Vuex module for easily logging in with the Auth0 SPA SDK.

This one-liner:
```js
store.dispatch("auth0/login");
```

* Silently retrieves auth tokens for authenticated users
* Redirects logged-out user to Auth0 Universal Login
* Retrieves Auth0 query params from the URL (if present) to complete Auth0 login flow


Full example:

```js
// Make sure your environment has these vars set:
// process.env.VUE_APP_AUTH0_DOMAIN
// process.env.VUE_APP_AUTH0_CLIENT_ID

import Vuex from 'vuex';
import auth0Vuex from 'auth0-vuex';

Vue.use(Vuex)

const store = {
  modules: {
    auth0: auth0Vuex
  }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

store.dispatch("auth0/login");
```

## API

### Actions

* `auth0/login`: Attempts to silently log the user in; otherwise redirects the user to the Auth0 Universal Login portal
* `auth0/logout`: Logs the user out and redirects them to the Auth0 Universal Login portal

### Getters

* `isLoggedIn` Boolean. `watch` this to detect when auth tokens have been successfully retrieved.
* `currentAuthHeaders` Bearer token for for calling your secured APIs. (From `idToken._raw`)
* `user` Object. Currently logged in user's details
* `client` A reference to the underlying `Auth0Client` instance.

## Tips

This library complements Hasura really nicely.