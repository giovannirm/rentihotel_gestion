<template lang="pug">
	div(class="app")
		form-wizard(
			@onComplete="onComplete"
			color="#7B2DEB"
			error-color="#ff4949"
			stepSize="xs"
			next-button-text="Siguiente"
			finish-button-text="Finalizar"
			back-button-text="Retroceder"
		)
			//- tab-content Primer paso
			//- tab-content Segundo paso			
			//- Second
			First
			//- Formulario
</template>

<script>
import First from '../components/client-form/form-one'
import Second from '../components/client-form/second-form'
// import Formulario from '../components/client-form/formulario'

export default {
	middleware: 'auth',
	components: {
		First,
		Second,
		// Formulario
	},
	data() {
		return {
			hab: '',
			motivo: [],
			residencia: [],
			pais: [],
			cliente: '',
			aditional: [],
			tiempo: [],
			tiempoEscogido: {},
			idRegistro: '',
		}
	},
	mounted() {
	},
	computed: {
	},
	methods: {
		async sendFinalForm() {
			const data = {
				reserva: null,
				cliente: this.cliente.id,
				estado_registro: 'REGISTRADO',
				tipo_pago: 'CONTADO',
				adelanto: this.formData1.adelanto,
				precio_total: this.formData1.tarifa,
				registros_habitacion: [
					{
						habitacion: this.formData1.tipo_hab,
						estado_habitacion: 'REGISTRADO',
						fecha_ingreso: `${this.formData1.fecha_ingreso} ${this.formData1.hora_ingreso}`,
						fecha_salida: `${this.formData1.fecha_salida} ${this.formData1.hora_salida}`,
						codigo: `${this.formData1.tipo_hab}_${this.formData1.fecha_ingreso}`,
						cantidad_adulto: this.formData1.adultos,
						cantidad_nino: this.formData1.child,
						tiempo: this.formData1.tiempo,
						precio: this.formData1.tarifa,
						precio_total: this.formData1.tarifa
					}
				]
			}
			const result = await this.$axios({
				method: 'post',
				url: 'https://apirenti.com/v1/api/hotels/1/records',
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				},
				data: JSON.stringify(data)
			})
			this.idRegistro = result.data.id
		},
		tarifa() {
			this.tiempoEscogido = this.tiempo.filter(
				el => el.id === this.formData1.tiempo
			)
			this.formData1.tarifa = this.tiempoEscogido[0].precio
		},
		updateAditional(e) {
			this.aditional = e
		},
		validateState(name) {
			const { $dirty, $error } = this.$v.formData[name]
			return $dirty ? !$error : null
		},
		validate(name) {
			const { $dirty, $error } = this.$v.formData1[name]
			return $dirty ? !$error : null
		},
		beforeSend: function() {
			// this.$v.formData.$touch()
			// if (this.$v.formData.$invalid) {
			// 	return false
			// }

			this.sendFinalForm()
			return true
		},
		onComplete: function() {
			alert('¡Completado!');
		},

		beforeTabSwitch: function() {
			// this.$v.formData.$touch()
			// if (this.$v.formData.$invalid) {
			// 	return false
			// }

			this.saveForm(this.formData)
			return true
		},
		async getTiempo(idHab) {
			const result = await this.$axios({
				method: 'get',
				url: `https://apirenti.com/v1/api/hotels/1/types-room/${idHab}/times`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			this.tiempo = result.data
		},
		async registerRoom() {
			const result = await this.$axios({
				method: 'get',
				url: 'https://apirenti.com/v1/api/hotels/1/records',
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			this.pais = result.data
		},
		async getPaises() {
			const result = await this.$axios({
				method: 'get',
				url: 'https://apirenti.com/v1/api/paises',
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			this.pais = result.data
		},
		async getResidencia() {
			const result = await this.$axios({
				method: 'get',
				url: 'https://apirenti.com/v1/api/paises/24/departmentos',
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			this.residencia = result.data
		},
		async getMotivoViaje() {
			const result = await this.$axios({
				method: 'get',
				url: 'https://apirenti.com/v1/api/parameters?group=MOTIVO_VIAJE',
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			this.motivo = result.data
		},

		async getRooms() {
			const result = await this.$axios({
				method: 'get',
				url: 'https://apirenti.com/v1/api/hotels/1/types-room',
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			this.hab = result.data
		},
	}
}
</script>

<style lang="stylus">
.vue-form-wizard
	width 100%
.vue-form-wizard .wizard-header
	display none !important
	padding 0 !important
.wizard-progress-bar
	width 100%
.vue-form-wizard
	padding 0
.vue-form-wizard .wizard-tab-content
	// min-height 100px
	// width 70%
	padding 0
.vue-form-wizard xs
	width 65%
.vue-form-wizard .wizard-header
	display none

@media screen and (min-width: 764px)
	.vue-form-wizard
		width 72%
	.vue-form-wizard .wizard-tab-content
		padding 14px 20px 10px
</style>

<style lang="stylus" scoped>
.app
	margin 0
	display flex
	justify-content center
.card
	box-shadow 0px 2px 5px #888888
	width 700px
	&__body
		padding 3% 4%
.font-label
	font-size 12px
	font-weight bold
h3
	font-size 17px
	font-weight bold
	color #7b2bde
hr
	margin-top 0
	margin-bottom 4px
.width-input
	width 90%
.form-control
	border none
	border-bottom 1px solid #919090
	border-radius 0
	font-size 12px
.justify-cont
	justify-content space-between
	align-items baseline
	margin-top 2%
.margin-r5
	margin-right 5%
.h3-icon
	align-items baseline
	margin-top 2%
i
	margin-right 1%
.baseline
	align-items baseline
.button-search
	background-color #7B2DED
	border 1px solid #7B2DED
.custom-select
	background-color #F9F9F9
.margin6
	margin-bottom 3%
.divGenre
	width 100%
	justify-content space-around
.inputEmail
	width 50%
.btn_modal
	width 30%
	background-color #7b2deb
	border-color #7b2deb
.modal_style
	display flex
	flex-direction column
	align-items center
.correo
	width 80%

.selectTipo
	width 100%
select
	font-size 12px
.width-middle
	width 50%
	justify-content space-between
	margin-right 3%
.w30
	width 30%
.secondForm
	.form-control
		border none
		border-bottom 1px solid #919090
		border-radius 0
		font-size 12px
		// width 60%
	.margin4
		margin 2% 0%
	.div-vuelidate
		width 63%
	.width-calendar
		// width 62%
		align-items flex-end
		justify-content space-between
.b-form-datepicker.form-control > label
	font-size 12px
.timePicker
	width 30%
	margin-left 10%
.dateStyle
	width 82%
	.form-control:nth-child(1)
		font-size 12px
		width 57%
	.form-control:nth-child(2)
		font-size 12px
		width 20%

// @media screen and (min-width: 764px)
// 	.app
// 		margin 0% 7%
</style>
