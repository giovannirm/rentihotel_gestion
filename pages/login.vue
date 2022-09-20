<template lang="pug">
	.body-login
		div.main-window(class="d-flex justify-content-around align-items-center")
			div.window-img
				nuxt-link(tag="img" :src="logoWindow" to="/login")
				p Renti
				p Plataforma de renta de hoteles
			b-card
				div.container-card(padding="8%")
					div.greeting
						p Bienvenido a Renti Gestión
						p Inicio de sesión
					form.form-log(@keyup.enter="login(infoUser)")
						b-form-group
							label Correo electrónico
							b-form-input.email(v-model="$v.infoUser.email.$model" :state="validate('email')" placeholder="Ingresa tu correo electrónico")
							b-form-invalid-feedback Campo requerido
						b-form-group
							label Contraseña
							b-form-input.password(type="password" v-model="$v.infoUser.password.$model" :state="validate('password')" placeholder="Ingresa tu contraseña")
							b-form-invalid-feedback Campo requerido
						div.forgot-pass.flex
							b-button.button-login(@click="login(infoUser)") Continuar
								i(class="el-icon-right")
							nuxt-link(to="/reset-password" style="width: 100%;")
								label.passForgot ¿Olvidaste tu contraseña?
					div.flex.footer
						div.flex.footer-image
							hr
							p.footer-p 2020 Renti, Inc. All rights reserved.
</template>

<script>
import store from '../store/index.js'
import { email, required } from 'vuelidate/lib/validators'
import logoWindow from '@/assets/logos/img-window.png'
import { validationMixin } from 'vuelidate'

export default {
	name: 'login',
	auth: false,
	layout: 'withoutSide',
	mixins: [validationMixin],
	data() {
		return {
			logoWindow: logoWindow,
			user: '',
			infoUser: {
				email: '',
				password: ''
			},
			submitted: false
		}
	},
	validations: {
		infoUser: {
			email: { required, email },
			password: { required }
		}
	},
	methods: {
		validate(name) {
			const { $dirty, $error } = this.$v.infoUser[name]
			return $dirty ? !$error : null
		},
		login(info) {
			this.$v.infoUser.$touch()
			if (this.$v.infoUser.$invalid) {
				return false
			} else {
				this.$auth
					.loginWith('local', { data: info })
					.then(response => {
						this.$nuxt.$router.replace('/first')
						console.log(this.$nuxt)
						// this.$store.dispatch('SET_USER', info)
					})
					.catch(error => {
						this.infoUser.password = ''
						// console.log(error.response)
						if (error.response.data.message === 'The password is incorrect.') {
							this.$bvToast.toast(
								'La contraseña es incorrecta, vuelve a intentarlo',
								{
									title: `Error`,
									variant: 'danger',
									solid: true
								}
							)
						} else if (
							error.response.data.message ===
							'No user is associated with this email address'
						) {
							this.infoUser.email = ''
							this.$bvToast.toast(
								'Ningún usuario está asociado con el email, vuelve a intentarlo',
								{
									title: `Error`,
									variant: 'danger',
									solid: true
								}
							)
						} else {
							this.infoUser.email = ''
							this.$bvToast.toast(
								'Los datos son incorrectos, vuelve a intentarlo.',
								{
									title: `Error`,
									variant: 'danger',
									solid: true
								}
							)
						}
					})
				return true
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
@import url('https://fonts.googleapis.com/css?family=Be+Vietnam&display=swap');
*
	font-family: 'Be Vietnam', sans-serif
html, body
	height 100vh
	.body-login
		background-color white
		height 100vh
	.main-window
		height 100%
	.window-img
		display none
	.card
		width 100%
		height 100vh
	.card-body
		padding 8% 9% 4% 9%
	.container-card
		height 100%
		display flex
		flex-direction column
		justify-content space-evenly
	.greeting
		p:nth-child(1)
			font-size 15px
			color #7b2bde
			font-weight bold
		p:nth-child(2)
			font-size 23px
	.form-control
		border none
		border-bottom 1px solid grey
		border-radius 0
		font-size 12px
	label
		font-size 13px
	.passForgot
		color #7b2bde
		font-size 12px
	.forgot-pass
		margin 13% 0%
	.button-login
		background-color #7b2bde
		border-color #7b2bde
		border-radius 20px
		margin-right 4%
		font-size 15px
	.footer
		margin 0
		text-align center
		font-size 12px
		&-p
			margin 0

	@media screen and (min-width 764px)
		.body-login
			background url('../assets/fondo/background.png') no-repeat center center fixed
			background-size cover
		.card
			width 28%
			height 72%
		.window-img
			display flex
			flex-direction column
			align-items center
			color white
</style>
