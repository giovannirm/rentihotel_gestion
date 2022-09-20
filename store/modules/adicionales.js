const state = {
	adicional: 0,
	products: [],
}

// getters
const getters = {
	getAdicional(state) {
		return state.adicional
	},
	getProducts(state) {
		return state.products
	},
}

// actions
const actions = {
	SET_ADICIONAL({commit}, newAdd) {
		commit('setAdicional', newAdd)
	},
	SET_PRODUCTS({commit}, newAdd) {
		commit('setProducts', newAdd)
	},
}

// mutations
const mutations = {
	setAdicional(state, newAdd) {
		state.adicional = newAdd
	},
	setProducts(state, newAdd) {
		state.products = newAdd
	},

}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
