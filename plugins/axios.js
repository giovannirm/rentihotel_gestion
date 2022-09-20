export default function({ app, $axios, store }) {

	$axios.setHeader('Content-Type', 'application/json')
	$axios.setHeader('Accept', 'application/json')

	// $axios.interceptors.request.use(
	// 	(config) => {
	// 		let token = localStorage.getItem('auth._token.local');

	// 		if (token) {
	// 			config.headers['Authorization'] = `Bearer ${ token }`;
	// 		}

	// 		return config;
	// 	},

	// 	(error) => {
	// 		return Promise.reject(error);
	// 	}
	// );

	$axios.onError(error => {
		const code = parseInt(error.response && error.response.status)
		if ([401, 403].includes(code)) {
			// app.$auth.logout()
			redirect('/login')
		}
		// return Promise.reject(error)
	})

	// $axios.interceptors.response.use(
	// 	response => {
	// 		store.commit('SET_DATA', { data: false, id: 'loading' })
	// 		return response
	// 	},
	// 	error => {
	// 		return Promise.reject(error)
	// 	}
	// )
}
