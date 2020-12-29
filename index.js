import { Auth0Client}  from '@auth0/auth0-spa-js';

const state = {
  auth0: undefined,
  user: undefined,
  currentAuthHeaders: {},
  isLoggedIn: false,
};

export const getters = {
  isLoggedIn: state => state.isLoggedIn,
  currentAuthHeaders: state => state.currentAuthHeaders,
  user: state => state.user 
};

export const mutations = {
  setAuth0(state, auth0) {
    state.auth0 = auth0;
  },
  setUser(state, user) {
    state.user = user;
  },
  setAuthHeaders(state, payload) {
    state.currentAuthHeaders = payload;
    state.isLoggedIn = true;
  }
};

export const actions = {
  async login({commit, state}) {

    console.log("Creating Auth0 client");
    const auth0 = new Auth0Client({
      domain: process.env.VUE_APP_AUTH0_DOMAIN,
      client_id: process.env.VUE_APP_AUTH0_CLIENT_ID,
      redirect_uri: window.location.origin,
      useRefreshTokens: true
    });
    console.log("Client created");
    commit("setAuth0", auth0);

    console.log("Checking URL for params from successful redirect");
    const hasAuth0RedirectParams = window.location.search.includes("code") && window.location.search.includes("state")
    if(hasAuth0RedirectParams) {
      console.log("✅ Found Auth0 rediret params. Passing to Auth0 SDK");
      try {
        console.log(await auth0.handleRedirectCallback());
      } catch(e) {
        // Something's wrong with redirect
        // Log the error and continue to login
        console.log("handleRedirectCallback failed");
        console.error(e);
      }
    }

    clearQueryString(); // Clear the query string to prevent redirect-callback handling code from accidentally running again on stale params

    console.log('Attempting login...')

    try {
      console.log('Attempting getTokenSilently')
      await auth0.getTokenSilently();
      console.log('getTokenSilently complete');

      const idToken = await auth0.getIdTokenClaims();
      console.log(idToken);
  
      const authHeaders = {"Authorization": "Bearer " + idToken.__raw };
      commit("setAuthHeaders", authHeaders);
  
      const user = await auth0.getUser();
      console.log(user);
  
      commit('setUser', user);
      console.log(`Logged in as ${user.name}`);

      return user;
    } catch(e) {
      console.error("Silent login failed");
      console.error(e);
      if(e.message === 'Login required') {
        console.log('Redirecting to login...')
        auth0.loginWithRedirect();
      } else {
        throw e;
      }
    }
    console.log("Login function exiting");
  },

  async logout({state}) {
    if(state.auth0) await state.auth0.logout({
      returnTo: window.location.origin
    });
  }
};


export function clearQueryString() {
  // get the string following the ?
  var query = window.location.search.substring(1)

  // is there anything there ?
  if(query.length) {
    // are the new history methods available ?
    if(window.history != undefined && window.history.pushState != undefined) {
          window.history.replaceState({}, document.title, window.location.pathname);
    }
  }
}


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}