
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
			{ rel: 'stylesheet', href: 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'}
		],
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
		{ src: "@/plugins/form-wizard" },
		{ src: "@/plugins/bootstrap"},
		{ src: "@/plugins/vuelidate"},
		{ src: "@/plugins/axios"},
		{ src: "@/plugins/moment"}
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
		'bootstrap-vue/nuxt',

    // Doc: https://axios.nuxtjs.org/usage
		'@nuxtjs/axios',
		'@nuxtjs/auth',
		'@nuxtjs/pwa',
		[
			"nuxt-fontawesome",
			{
				imports: [
					{
						set: "@fortawesome/free-solid-svg-icons",
						icons: ["fas"]
					},
					{
						set: "@fortawesome/free-brands-svg-icons",
						icons: ["fab"]
					}
				]
			}
		]
	],

	fontawesome: {
		imports: [
			{
				set: "@fortawesome/free-solid-svg-icons",
				icons: [
					"fas",
					"bars",
					"ellipsis-v",
					"gem",
					"tv",
					"coffee",
					"wifi",
					"toilet",
					"times",
					"chevron-down",
					"male",
					"child",
					"check-circle",
					"exclamation-circle",
					"check"
				]
			},
			{
				set: "@fortawesome/free-brands-svg-icons",
				icons: [
					"fab",
					"facebook-messenger",
					"facebook-f",
					"fa-whatsapp",
					"fa-instagram",
					"fa-google"
				]
			}
		]
	},
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
 axios: {
	baseURL: "https://apirenti.com/v1/api/",
},

auth: {
	strategies: {
		local: {
			endpoints: {
				login: {
					url: "https://apirenti.com/v1/api/managment/account/login",
					method: "post",
					propertyName: "token"
				},
				// user:false,
				user: {
					url: "https://apirenti.com/v1/api/user/user",
					method: "get",
					propertyName: false
				},
				logout:{
					url: "https://apirenti.com/v1/api/account/logout",
					method: "post",
					propertyName: false
				},
				// { url: "account/logout", method: "post" },
			},
			tokenRequired: true,
			tokenType: 'bearer'
		}
	},
	// Es para redigir al iniciar y cerrar sesión con el redirect establecido
	watchLoggedIn: true,
	rewriteRedirects: false,

	redirect: {
		login: "/login",
		logout: "/login",
		home: "/",
	},
},

router : {
	middleware: ['auth'],
},
  /*
  ** Build configuration
  */
build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
