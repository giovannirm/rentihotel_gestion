import axios from 'axios'
const state = {
	hotel: {}
}

// getters
const getters = {
	getHotel(state) {
		return state.hotel
	}
}

// actions
const actions = {
	SET_HOTEL({ commit }, newHotel) {
		commit('setHotel', newHotel)
	},
	// fetchHotel({state, commit, rootState}, y) {
	// 	return axios.post(`https://apirenti.com/v1/api/users/${rootState.auth.user.id}/hotels`).then(response => {
	// 		console.log('axios vuex', response)
	// 		// commit('setToken', response.data)
	// 	})
	// }
}

// mutations
const mutations = {
	setHotel(state, newHotel) {
		state.hotel = newHotel
	}
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
