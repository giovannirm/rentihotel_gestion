const state = {
	custom: {}
}

// getters
const getters = {
	getCustom(state) {
		return state.custom
	},
}

// actions
const actions = {
	SET_CUSTOM({commit}, newCustom) {
		commit('setCustom', newCustom)
	},
}

// mutations
const mutations = {
	setCustom(state, newCustom) {
		state.custom = newCustom
	},

}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
