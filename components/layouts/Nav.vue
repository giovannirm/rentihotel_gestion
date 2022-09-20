<template lang="pug">
	nav
		div.nav-head

			img.avatar(:src="img")
			p.ft-s14 Bienvenido
			//- div(class="d-flex")
			div.h3-icon(class="d-flex align-items-center")
				i(class="fa fa-bell")
				p.ft-s22(class="mx-4") {{hotel.nombre}}
			p {{ $auth.$state.user.email }}
		ul
			nuxt-link(to="/first")
				li
					div(class="icons")
						img.icon(src="../../assets/iconos/hotel.png")
					div(class="linktitle") Room booking
			nuxt-link(to="/reservation")
				li
					div(class="icons")
						img.icon(src="../../assets/iconos/lista.png")
					div(class="linktitle") Reservas
			//- li
			//- 	div(class="icons")
			//- 		img.icon(src="../../assets/iconos/pago.png")
			//- 	div(class="linktitle") Cierre de caja diario
			//- li
			//- 	div(class="icons")
			//- 		img.icon(src="../../assets/iconos/engranaje.png")
			//- 	div(class="linktitle") Configurar maestros
			nuxt-link(to="/list_reports")
				li
					div(class="icons")
						img.icon(src="../../assets/iconos/reporte.png")
					div(class="linktitle") Reportes
			li(@click="logout()")
				div(class="icons")
					img.icon(src="../../assets/iconos/salir.png")
				div(class="linktitle") Cerrar sesión

		div.footer
			p 2020 Renti, Inc. All Rights reserved.


</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
	data() {
		return {
			hotel: '',
			img: 'https://apirenti.com'
		}
	},
	async created() {
	// created() {
		const result = await this.getHotelOne()
		// this.getHotelOne()
		this.hotel = result.data[0]
		this.img += this.hotel.logo
	},
	mounted() {
		// console.log(this.getHotel, 'navv')
	},
	// computed: {
	// 	...mapGetters('hotel', ['getHotel']),
	// 	hotel() {
	// 		return this.getHotel
	// 	}
	// },
	methods: {
		// ...mapActions('hotel', ['SET_HOTEL']),
		logout() {
			// console.log(this.$store)
			this.$auth.logout().then(() => {
				this.$router.replace('/login')
			})
		},
		getHotelOne() {
			return this.$axios({
				method: 'get',
				url: `https://apirenti.com/v1/api/users/${this.$store.$auth.user.id}/hotels`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			// .then(result => {
				
				// this.hotel = result.data[0]
				// return result.data[0]
				// console.log('put hotel in vuex')
				// this.SET_HOTEL(result.dasta[0])
				// console.log(result)
			// })
		}
	}
}
</script>

<style lang="stylus" scoped>
html
	height 100%

*
	margin 0px
	padding 0px
	outline none
	-webkit-transition 0.5s
	-moz-transition 0.5s
	-ms-transition 0.5s
	-o-transition 0.5s
	transition 0.5s


body
	padding 10px
	font-family 'Source Sans Pro', sans-serif
	color #000
	padding 0px
	margin 0px
	height 100vh


nav
	height 100vh
	// width 160px
	// background #7B2DED
	background url('../../assets/fondo/fondoSide.png') no-repeat
	background-size cover
	position sticky
	top 0
	display flex
	flex-direction column
	justify-content space-around

.nav-head
	display flex
	flex-direction column
	align-items center
	color white
	margin-top 15%

.avatar
	width 40%

a
	text-decoration none !important
ul
	padding 0px
	margin 0px


ul li
	list-style-type none
	color white
	padding 0px 15px
	border none
	overflow auto
	cursor pointer
	display flex
	justify-content flex-start
	align-items center
	font-size 14px

.icon
	width 30px

ul li:hover
	background-color #100D59

ul li:hover .linktitle
	color white


ul li div
	float left

.icons
	padding 10px

.linktitle
	line-height 35px
	padding-left 10px

.footer
	color white
	text-align center
	margin-bottom 3%
	font-size 10px

.ft-s14
	font-size 14px

.ft-s22
	font-size 22px
	text-align center
@media screen and (min-width:1025px)
	nav
		// width 100%
/* Reponsive menu code */
@media screen and (max-width: 600px)
	nav
		// width 100%
		padding 0px 10px

	ul li
		overflow hidden
		padding 0px 10px

	.linktitle
		position absolute
		z-index 10
		left -200px
		padding 29px 15px
		line-height 0px
		background #222527

	ul li:hover .linktitle
		left 80px

	.icons
		padding 20px 10px

	ul li:hover .icons
		-webkit-transform rotate(360deg)
		-moz-transform rotate(360deg)
		-ms-transform rotate(360deg)
		-o-transform rotate(360deg)
		transform rotate(360deg)
</style>
