import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
// import modules from './modules';
import customer from './modules/customer';
import registro from './modules/registro';
import host from './modules/host';
import hotel from './modules/hotel';
import report from './modules/report';
import adicionales from './modules/adicionales';

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
const createStore = () =>  new Vuex.Store({
	namespaced: false,
	modules:{
		customer,
		registro,
		host,
		hotel,
		adicionales,
		report
	},
	strict: debug,
	plugins: debug ? [createLogger()] : []
})

export default createStore;
// import Vuex from 'vuex';
// import Vue from 'vue';

// Vue.use(Vuex);

// const store = () => new Vuex.Store({
// 	state() {
// 		return {
// 			token: '',
// 			user: '',
// 		}
// 	},
// 	getters: {
// 		getToken(state) {
// 			return state.token
// 		},
// 		getUser(state) {
// 			return state.user
// 		},
// 		isAuthenticated(state) {
// 			return state.auth.loggedIn
// 		},

// 		loggedInUser(state) {
// 			return state.auth.user
// 		}

// 	},
// 	mutations: {
// 		setToken(state, newToken) {
// 			state.token = newToken
// 		},
// 		setUser(state, newUser) {
// 			state.user = newUser
// 		}
// 	},
// 	actions: {
// 		SET_TOKEN({commit}, newToken) {
// 			commit('setToken', newToken)
// 		},
// 		SET_USER({commit}, newUser) {
// 			commit('setUser', newUser)
// 		},

// 	}

// })

// export default store;
