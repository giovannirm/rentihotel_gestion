const state = {
	host: {}
}

// getters
const getters = {
	getHost(state) {
		return state.host
	},
}

// actions
const actions = {
	SET_HOST({commit}, newHost) {
		commit('setHost', newHost)
	},
}

// mutations
const mutations = {
	setHost(state, newHost) {
		state.host = newHost
	},

}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
