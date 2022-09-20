const state = {
	register: {},
	responseReg: {},
}

// getters
const getters = {
	getRegister(state) {
		return state.register
	},
	getResponseReg(state) {
		return state.responseReg
	}
}

// actions
const actions = {
	SET_REGISTER({commit}, newRegister) {
		commit('setRegister', newRegister)
	},
	SET_RESPONSE_REG({commit}, newRegister) {
		commit('setResponseReg', newRegister)
	},
}

// mutations
const mutations = {
	setRegister(state, newRegister) {
		state.register = newRegister
	},
	setResponseReg(state, newResponse){
		state.responseReg = newResponse
	}
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
