<template lang="pug">
div
	div(v-if="arrayHosts[0] === undefined") No se ingresaron hospedantes
		b-button.btn_cancel(class="mt-3" block @click="exit()") Salir
	div(v-else)
		b-tabs(v-model="tabIndex" v-if="qty>0" card)
			b-tab(v-for="(v, index) in $v.arrayHosts.$each.$iter" :title="`Hab ${index+1}`")
				b-form#form-host
					b-modal(id="bv-modal-example" centered hide-footer hide-header)
						div.modal_style
							p El usuario no se encuentra registrado.
							p Completa los campos solicitados.
							b-button.btn_modal(class="mt-3" block @click="$bvModal.hide('bv-modal-example')") Aceptar
					div(class="d-flex align-items-end")
						div.margin-r5(class="d-flex flex-column")
							label.font-label(class="mr-sm-2") Tipo de documento
							b-form-select(class="mb-2 mr-sm-2 mb-sm-0", v-model="v.tipo_documento.$model", :state="validateState('tipo_documento')")
								b-form-select-option(value="placeholder" disabled) Tipo de documento
								b-form-select-option(v-for="doc in tipo_doc" :value="doc.nombre") {{ doc.nombre }}
							b-form-invalid-feedback Campo requerido
						div.baseline(class="d-flex")
							b-form-input(class="mr-4", v-model="v.numero_documento.$model", :state="validateState('numero_documento')", placeholder="Número de documento")
							b-form-invalid-feedback Campo requerido
							b-button.button-search(@click="searchHost(v.tipo_documento.$model, v.numero_documento.$model)") Buscar
					div.h3-icon(class="d-flex")
						i(class="fa fa-user")
						h3 Informacion del cliente
					hr
					div.justify-cont(class="d-flex")
						div.width-middle
							label.font-label(class="") Nombre
							b-form-input(v-model="v.nombre.$model", :state="validateState('nombre')", placeholder="Nombres")
							b-form-invalid-feedback Campo requerido
						div.width-middle
							label.font-label(class="") Apellido
							b-form-input(v-model="v.apellido.$model", :state="validateState('apellido')", placeholder="Apellidos")
							b-form-invalid-feedback Campo requerido
					div.justify-cont(class="d-flex align-items-baseline")
						div.divGenre.width-middle(class="d-flex flex-column")
							label.font-label(class="") Género
							//- -----------------------------------------------------------------
							b-form-radio.font-genero(v-for="g in genero", :value="g.id", v-model="v.genero.$model", :state="validateState('genero')", class="mr-4") {{ capitalize(g.nombre) }}
							//- b-form-radio(v-model="v.genero" name="some-radios" value="F") Femenino
							//- b-form-radio(v-model="v.genero" name="some-radios" value="M") Masculino
							//- -----------------------------------------------------------------
						div.width-middle
							label.font-label(class="") Edad
							b-form-input(v-model="v.edad.$model", :state="validateState('edad')", placeholder="Edad")
					div.h3-icon(class="d-flex")
						i(class="fa fa-phone")
						h3 Contacto
					hr
					div.margin6(class="d-flex justify-content-between")
						div.margin-r5.width-middle
							label.font-label(class="") Correo
							b-form-input(v-model="v.correo_electronico.$model", :state="validateState('correo_electronico')", placeholder="Correo electrónico")
						div.width-middle
							label.font-label(class="") Número de celular
							b-form-input(v-model="v.celular.$model", :state="validateState('celular')", placeholder="Número de celular")
					div.h3-icon(class="d-flex")
						i(class="fa fa-plus-circle")
						h3 Información adicional
					hr
					div.width-total.justify-cont(class="d-flex flex-column justify-content-between")
						div(class="d-flex flex-row justify-content-between")
							div.width-middle
								label.font-label(class="mr-sm-2") Residencia
								b-form-select(class="mb-2 mr-sm-2 mb-sm-0", v-model="v.residencia.$model", :state="validateState('residencia')")
									b-form-select-option(value="0" disabled) Residencia
									b-form-select-option(v-for="dep in residencia" :value="dep.id" :key="dep.id") {{dep.nombre}}
							div.width-middle
								label.font-label(class="mr-sm-2") Motivo de viaje
								b-form-select(class="mb-2 mr-sm-2 mb-sm-0", v-model="v.motivo_viaje.$model", :state="validateState('motivo_viaje')")
									b-form-select-option(value="0" disabled) Motivo de viaje
									b-form-select-option(v-for="viaje in motivo" :value="viaje.id" :key="viaje.id") {{viaje.nombre}}
						div.width-middle
							label.font-label(class="mr-sm-2") Nacionalidad
							b-form-select(class="mb-2 mr-sm-2 mb-sm-0", v-model="v.nacionalidad.$model", :state="validateState('nacionalidad')")
								b-form-select-option(value="0" disabled) Nacionalidad
								b-form-select-option(v-for="country in pais" :value="country.id" :key="country.id") {{country.nombre}}

				div(class="d-flex justify-content-around")
					b-button.btn_modal(class="mt-3" block @click="saveData(v.$model)") Aceptar
					b-button.btn_cancel(class="mt-3" block @click="exit()") Cancelar

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { required, numeric, helpers, email } from 'vuelidate/lib/validators'

export default {
	//- user -> envía un objeto con datos vacíos, está definido en el data() que es client
	//- id -> envía un valor vacío definido en el data() que es idCliente
	//- registro -> no se tiene información de idReg
	//- qty -> envía la cantidad de habitaciones recibida por el first-form del registro
	//- room_id -> recibe un arreglo de id del registro de cada habitación de un registro
	// props: ['user', 'id', 'registro', 'qty', 'room_id'],
	props: ['user', 'registro', 'qty', 'room_id', 'hospedante'],
	data() {
		return {
			arr: [],
			tabIndex: 0,
			//Si la celda está ocupada se pushea los hospedantes por cada id de registro de habitación de un solo registro
			arrayHosts: [],
			// Guarda el id del hotel que se muestra en la ruta
			hotelId: '',
			// Guarda un arreglo de motivos 
			motivo: [],
			// Guarda un arreglo de los departamentos del id 24 (Perú)
			residencia: [],
			// Guarda un arreglo de paises
			pais: [],
			tipo_doc: [],
			genero: [],
			host: '',
			hostClient: '',
			// formData: {
			// 	tipo_documento: '0',
			// 	numero_documento: '',
			// 	nombre: '',
			// 	apellido: '',
			// 	edad: '',
			// 	genero: '',
			// 	correo_electronico: '',
			// 	celular: '',
			// 	residencia: 0,
			// 	motivo_viaje: 0,
			// 	nacionalidad: 0
			// }
		}
	},

	validations: {
		arrayHosts: {
			required,
			$each: {				
				tipo_documento: { required },
				numero_documento: { required, numeric },
				nombre: { required },
				apellido: { required },
				edad: {},
				genero: {},
				correo_electronico: {},
				celular: {},
				residencia: {},
				motivo_viaje: {},
				nacionalidad: {}
			}
		},
	},

	async created() {
		this.tipo_doc = await this.getParameters('TIPO_DOCUMENTO')
		this.genero = await this.getParameters('GENERO')
		this.motivo = await this.getParameters('MOTIVO_VIAJE')
		// console.log(this.capitalize(this.genero[0].nombre))
		this.getResidencia()
		this.getPaises()
	},
	
	async mounted() {
		const route = this.$router.history.current.query
		this.hotelId = route.hotel
		// this.formData = this.user
		// ----------------------------------
		// this.tipo_doc = await this.getParameters('TIPO_DOCUMENTO')
		// ----------------------------------
		// this.getPaises()
		// this.getResidencia()
		// this.getMotivoViaje()
		// En el caso que se abra desde una celda ocupada
		if (route.state === 'OCUPADO') {
			this.arrayHosts = []
			for (let i = 0; i < this.room_id.length; i++) {
				// console.log(this.room_id[i])
				// en arrayHosts concatena el array de haspedantes de todas las habitaciones seleccionadas
				this.arrayHosts.push((await this.getHosts(this.room_id[i]))[0])
				// this.$axios({
				// 	method: 'get',
				// 	url: `https://apirenti.com/v1/api/hotels/1/room-records/${this.room_id[0]}/hosts`,
				// 	headers: {
				// 		accept: 'application/json',
				// 		'Content-Type': 'application/json'
				// 	}
				// }).then((result) => {
				// 	this.arrayHosts.push(result.data[0])
				// })
			}
		} else { // En caso que se abra desde una celda libre o dede el botón +
			this.arrayHosts = []
			for (let i = 0; i < this.qty; i++) {
				this.arrayHosts[i] = {
					//- -----------------------------------------------------------------
					tipo_documento: 'DNI',
					//- -----------------------------------------------------------------
					numero_documento: '',
					nombre: '',
					apellido: '',
					edad: '',
					genero: '',
					correo_electronico: '',
					celular: '',
					residencia: 0,
					motivo_viaje: 0,
					nacionalidad: 0
				}
			}
		}
	},
	computed: {
		...mapGetters('customer', ['getCustom']),
		...mapGetters('registro', ['getRegister']),
		...mapGetters('host', ['getHost']),
		...mapGetters('hotel', ['getHotel'])
	},
	// async mounted() {
	// 	const route = this.$router.history.current.query
	// 	// this.hotelId = route.hotel
	// 	// this.formData = this.user
	// 	// this.getPaises()
	// 	// this.getResidencia()
	// 	// this.getMotivoViaje()

	// 	// if (route.state === 'OCUPADO') {
	// 	// 	const hostReq = await this.getHosts(route.reg)
	// 	// 	this.formData = {
	// 	// 		tipo_documento: hostReq[0].tipo_documento,
	// 	// 		numero_documento: hostReq[0].numero_documento,
	// 	// 		nombre: hostReq[0].nombre,
	// 	// 		apellido: hostReq[0].apellido,
	// 	// 		edad: hostReq[0].edad,
	// 	// 		genero: hostReq[0].genero,
	// 	// 		correo_electronico: hostReq[0].correo_electronico,
	// 	// 		celular: hostReq[0].celular,
	// 	// 		residencia: hostReq[0].residencia,
	// 	// 		motivo_viaje: hostReq[0].motivo_viaje,
	// 	// 		nacionalidad: hostReq[0].nacionalidad
	// 	// 	}

	// 	// 	const form = document.getElementById('form-host')
	// 	// 	const elements = form.elements
	// 	// 	for (let i = 0, len = elements.length; i < len; ++i) {
	// 	// 		elements[i].disabled = true
	// 	// 	}
	// 	// }
	// },

	methods: {
		...mapActions('host', ['SET_HOST']),
		exit() {
			this.hospedante = 'false',
			this.$emit('returnSelectHos', this.hospedante)
			this.$bvModal.hide('modal-1')
			console.log('SALIDA')
		},
		async getParameters(group) {
			const result = await this.$axios({
				method: 'get',
				url: `https://apirenti.com/v1/api/parameters?group=${group}`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			return result.data
		},
		// Devuelve un array de hospedantes de un registro en específico
		async getHosts(id) {
			const result = await this.$axios({
				method: 'get',
				url: `https://apirenti.com/v1/api/hotels/1/room-records/${id}/hosts`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			// console.log(result.data)
			return result.data
		},
		async searchHost(tipo, documento) {
			this.$v.arrayHosts.$each.$iter[0].tipo_documento.$touch()
			this.$v.arrayHosts.$each.$iter[0].numero_documento.$touch()
			// this.$v.arrayHosts.numero_documento.$touch()
			if (this.$v.arrayHosts.$each.$iter[0].tipo_documento.$invalid || this.$v.arrayHosts.$each.$iter[0].numero_documento.$invalid) 
			{
			 	return false
			}

			const data = JSON.stringify({
				tipo_documento: tipo,
				numero_documento: documento
			})
			// Busca hospedantes con la data relacionada
			const result = await this.$axios({
				method: 'post',
				url: `https://apirenti.com/v1/api/hotels/${this.hotelId}/search-hosts`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				},
				data: data
			})
			if (result.data.length === 0) {
				this.$bvModal.show('bv-modal-example')
			} else {
				this.SET_HOST(result.data[0])
				// days.splice(index, 1, newItem)
				this.arrayHosts.splice(this.tabIndex, 1, {
					tipo_documento: result.data[0].tipo_documento,
					numero_documento: result.data[0].numero_documento,
					nombre: result.data[0].nombre,
					apellido: result.data[0].apellido,
					edad: result.data[0].edad,
					genero: result.data[0].genero === "M" ? 2 : 3,
					correo_electronico: result.data[0].correo_electronico,
					celular: result.data[0].celular,
					residencia: result.data[0].residencia,
					motivo_viaje: result.data[0].motivo_viaje,
					nacionalidad: result.data[0].nacionalidad
				})
				this.$v.arrayHosts.$touch()
			}
		},
		// --------------------------------------------
		// saveId(tab) {
		// 	this.$emit('saveId', tab)
		// },
		// --------------------------------------------

		async saveData(tab) {
			this.$v.arrayHosts.$touch()
			
			if (this.$v.arrayHosts.$invalid) 
			{
			 	return false
			}
			// this.arrayHosts[tabIndex] = tab
			if (this.$router.history.current.query.state !== 'OCUPADO') {

				// console.log(this.getRegister.id)
				tab.edad = tab.edad === '' ? '99' : tab.edad
				tab.celular = tab.celular === '' ? '999999999' : tab.celular
				this.$emit('saveData', tab)
				// if (this.getHost.hasOwnProperty("id")) {
				// 	alert('Deberia hacer put')
				// 	const result = await this.$axios({
				// 		method: 'put',
				// 		url: `https://apirenti.com/v1/api/hotels/${this.getHotel.id}/room-records${this.getRegister.id}/hosts/${this.getHost.id}`,
				// 		headers: {
				// 			accept: 'application/json',
				// 			'Content-Type': 'application/json'
				// 		},
				// 		data: JSON.stringify(this.formData)
				// 	})
				// 	console.log(result)
				// 	console.log('put por fin?')
				// } else {

				// ---------------------------------------
				// const result = await this.$axios({
				// 	method: 'post',
				// 	url: `https://apirenti.com/v1/api/hotels/${this.hotelId}/room-records/${
				// 		this.getRegister.registros_habitacion[this.tabIndex].id
				// 	}/hosts`,
				// 	headers: {
				// 		accept: 'application/json',
				// 		'Content-Type': 'application/json'
				// 	},
				// 	data: JSON.stringify(tab)
				// })
				// this.host = result.data.id
				// this.SET_HOST(result.data)
				// this.saveId(this.host)
				// ---------------------------------------				
			}
			this.hospedante = 'hospedante',
			this.$emit('returnSelectHos', this.hospedante)
			this.$bvModal.hide('modal-1')
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
		// async getMotivoViaje() {
		// 	const result = await this.$axios({
		// 		method: 'get',
		// 		url: 'https://apirenti.com/v1/api/parameters?group=MOTIVO_VIAJE',
		// 		headers: {
		// 			accept: 'application/json',
		// 			'Content-Type': 'application/json'
		// 		}
		// 	})
		// 	this.motivo = result.data
		// },

		async getParameters(group) {
			const result = await this.$axios({
				method: 'get',
				url: `https://apirenti.com/v1/api/parameters?group=${group}`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			return result.data
		},
		
		validateState(name) {
			const { $dirty, $error } = this.$v.arrayHosts.$each.$iter[0][name]
			return $dirty ? !$error : null
		},

		capitalize(word) {
			const lower = word.toLowerCase();
			return word.charAt(0).toUpperCase() + lower.slice(1);
		},
	}
}
</script>

<style lang="stylus" scoped>
.card
	box-shadow 0px 2px 5px #888888
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
select
	font-size 12px
.form-control
	border none
	border-bottom 1px solid #919090
	border-radius 0
	font-size 12px
.justify-cont
	justify-content space-between
	align-items baseline
	margin-top 1%
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
.btn_modal
	width 30%
	background-color #7b2deb
	border-color #7b2deb
.btn_cancel
	width 30%
	background-color #9b9b9b
	border-color #9b9b9b
.modal_style
	display flex
	flex-direction column
	align-items center
.width-middle
	width 45%
.width-total
	width 100%
</style>

<style lang="stylus">
.vue-form-wizard .wizard-nav-pills
	display none
.vue-form-wizard .wizard-progress-bar
	display none
</style>
