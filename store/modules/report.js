const state = {
}

const getters = {
}

const actions = {
    getTipoUsuario (context, payload) {
        this.$axios({
            method: 'get',
            url: 'https://apirenti.com/v1/api/parameters?group=TIPO_USUARIO',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
    }
}

const mutations = {
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
