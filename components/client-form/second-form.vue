<template lang="pug">
	tab-content( title="Registro de habitación" icon="fa fa-bed" :before-change="beforeTabSwitch")
		//- b-alert(:show="dismissCountDown", dismissible, variant="success", @dismissed="dismissCountDown=0", @dismiss-count-down="countDownChanged") Habitación registrada
		b-card
			b-form.secondForm#form-second
				b-modal(id="bv-modal-success" no-close-on-backdrop no-close-on-esc data-keyboard="false" centered hide-footer hide-header)
					div.modal_style
						p Habitación registrada
						b-button.btn_modal(class="mt-3" block @click="entrar()") Aceptar
				b-modal(id="bv-modal-error" centered hide-footer hide-header)
					div.modal_style
						p Ha ocurrido un error, intente más tarde
						b-button.btn_modal(class="mt-3" block @click="$bvModal.hide('bv-modal-error')") Aceptar
				div.width-calendar(class="d-flex mb-3 mr-sm-2")
					label.font-label(class="") Fecha de ingreso:
					div.dateStyle(class="d-flex")
						b-form-datepicker(size="sm", local="es", :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }", v-model="$v.formData1.fecha_ingreso.$model", :state="validate('fecha_ingreso')", placeholder="Fecha de ingreso")
						b-form-input.timePicker(type="time", v-model="$v.formData1.hora_ingreso.$model", :state="validate('hora_ingreso')")
					b-form-invalid-feedback Campo requerido
				div.width-calendar(class="d-flex mb-3 mr-sm-2")
					label.font-label(class="") Fecha de salida:
					div.dateStyle(class="d-flex")
						b-form-datepicker(size="sm", local="es", :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }", v-model="$v.formData1.fecha_salida.$model", :state="validate('fecha_salida')", placeholder="Fecha de salida")
						b-form-input.timePicker(type="time", v-model="$v.formData1.hora_salida.$model", :state="validate('hora_salida')")
					b-form-invalid-feedback Campo requerido

				div.justify-cont(class="d-flex")
					div.width-middle(class="d-flex")
						label.font-label(class="") Tipo de pago:
						div.div-vuelidate
							b-form-select(class="mb-2 mr-sm-2 mb-sm-0" v-model="$v.formData1.tipo_pago.$model" :state="validate('tipo_pago')")
								b-form-select-option(value="" disabled) Tipo de pago
								b-form-select-option(v-for="pay in pago" :key="pay.nombre" :value="pay.nombre") {{ pay.nombre }}
							b-form-invalid-feedback Campo requerido
					div.width-middle(class="d-flex")
						label.font-label(class="") Monto:
						div.div-vuelidate
							b-form-input(v-model="$v.formData1.adelanto.$model", :state="validate('adelanto')", placeholder="Monto")
							b-form-invalid-feedback Campo requerido

				div.justify-cont(class="d-flex")
					label.font-label(class="") Numero de habitaciones:
					b-form-select(class="mb-2 mr-sm-2 mb-sm-0", disabled, v-model="$v.habNum.$model", :state="validateState('habNum')", @change="addRooms(habNum)")
						b-form-select-option(value="" disabled) Elija la cantidad
						b-form-select-option(v-for="a in 10" :value="a" :key="a") {{a}}
							//- b-form-invalid-feedback Campo requerido
				div
					//- p {{habNum}}
					b-tabs(v-model="tabIndex" v-if="habNum>0" card)
						b-tab(v-for="(v, index) in $v.arrayRooms.$each.$iter" :title="`Hab ${index+1}`")
							form#form-room
								div.justify-cont(class="d-flex align-items-end")
									div.width-middle(class="d-flex")
										label.font-label(class="mr-sm-2") Habitación:
										div.div-vuelidate
											b-form-select.select-hab#select-habitacion(class="mb-2 mr-sm-2 mb-sm-0", v-model="v.habitacion.$model", :state="validateHab('habitacion')", @change="obtenerTiempo(v.habitacion)")
												b-form-select-option(value="" disabled) Tipo de habitación
												b-form-select-option(v-for="h in hab" :value="h.id") {{h.numero_habitacion}}
											b-form-invalid-feedback Campo requerido
									div.width-middle(class="d-flex")
										label.font-label(class="mr-sm-2") 
										div.vuelidate
								div.justify-cont(class="d-flex")
									div.width-middle(class="d-flex")
										label.font-label(class="") Tiempo:
										div.div-vuelidate
											b-form-select#select-tiempo(class="mb-2 mr-sm-2 mb-sm-0", v-model="v.tiempo.$model", :state="validateHab('tiempo')", @change="tarifa(tiempo, v, index)")
												b-form-select-option(value="" disabled) Tiempo
												b-form-select-option(v-for="time in tiempo" :value="time.id" :key="time.id") {{ time.codigo }}
											b-form-invalid-feedback Campo requerido
									div.width-middle(class="d-flex")
										label.font-label(class="") Tarifa:
										div.div-vuelidate
											b-form-input#input-precio(v-model="v.precio.$model", :state="validateHab('precio')", placeholder="Tarifa")
											b-form-invalid-feedback Campo requerido
								//- Adicional.margin4(@sendTable="updateAditional" :request="idResult" :dataFin="dataSend" :sendTotalF="totalFinal")
								div.justify-cont(class="d-flex")
									div.width-middle(class="d-flex")
										label.font-label(class="") Adultos:
										div.div-vuelidate
											b-form-select#select-adult(class="mb-2 mr-sm-2 mb-sm-0", v-model="v.cantidad_adulto.$model", :state="validateHab('cantidad_adulto')")
												b-form-select-option(value="" disabled) Adultos
												b-form-select-option(v-for="a in 10" :value="a" :key="a") {{a}}
											b-form-invalid-feedback Campo requerido
									div.width-middle(class="d-flex")
										label.font-label(class="0") Niños:
										div.div-vuelidate
											b-form-select#select-child(class="mb-2 mr-sm-2 mb-sm-0", v-model="v.cantidad_nino.$model", :state="validateHab('cantidad_nino')")
												b-form-select-option(value="" disabled) Niños
												b-form-select-option(v-for="a in 11" :value="a-1" :key="a-1") {{a-1}}
											b-form-invalid-feedback Campo requerido

				p(v-if="dataSend.precio_total>0") SubTotal: S/. {{ dataSend.precio_total }}
				//- p(v-else) SubTotal: S/. 0
				//- El evento sendTable lo emite el adicional-form
				//- updateAditional es un método que recibe un parámetro
				//- idResult es un valor vacío definido en el data()
				//- dataSend es un objeto que guarda toda la información del registro a enviar
				//- totalFinal no está definido en ningún lado, solo como método pero si fuera el caso debería ser llamado como método
				//- habNum guarda el cantidad total de habitaciones en el registro, se usa la función lenght
				//- recordRooms guarda un arreglo de todos los ids de cada habitaciones registrada en un solo registro
				//- Adicional.margin4(@sendTable="updateAditional" :request="idResult" :dataFin="dataSend" :sendTotalF="totalFinal" :numRooms="habNum" :rooms="recordRooms")
				Adicional.margin4(@sendHost="updateHost", @sendTable="updateAditional" :request="idResult" :dataFin="dataSend" :numRooms="habNum" :rooms="recordRooms")
				p(v-if="sumTotal>0") Total S/. {{ sumTotal }}

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Adicional from './adicional-form'
import { validationMixin } from 'vuelidate'
import { required, numeric, helpers, email } from 'vuelidate/lib/validators'

export default {
	middleware: 'auth',
	mixins: [validationMixin],
	components: {
		Adicional
	},
	data() {
		return {
			boxTwo: '',
			dismissSecs: 5,
        	dismissCountDown: 1,
			// Solo si la celda está ocupada -> 
			// En el mounted guarda un arreglo de todos los ids del registro de cada habitacion registrada en un solo registro
			recordRooms: [],
			// En el mounted guarda el arreglo de habitaciones registradas con toda su información de un solo registro
			arrayRooms: [
				{
					habitacion: '',
					estado_habitacion: 'OCUPADO',
					fecha_ingreso: null,
					fecha_salida: null,
					codigo: null,
					cantidad_adulto: '',
					cantidad_nino: '',
					tiempo: '',
					precio: '',
					precio_total: 0
				}
			],
			// Es el valor q se añadirá en el arrayRooms por cada habitación por defecto
			propertyRooms: {
				habitacion: 0,
				estado_habitacion: 'OCUPADO',
				fecha_ingreso: null,
				fecha_salida: null,
				codigo: null,
				cantidad_adulto: 1,
				cantidad_nino: 0,
				tiempo: 0,
				precio: 0,
				precio_total: 0
			},
			tabIndex: 0,
			habRoute: '',
			// En el mounted guarda el cantidad total de habitaciones en el registro, se usa la función lenght 
			habNum: 1,
			// En el mounted guarda el precio_total de la primera habitación en registro
			subTotal: '',
			value: '',
			hotelId: '',
			total: '',
			idResult: '',
			// En el created guarda todas las habitaciones del hotel
			hab: '',
			// En el created guarda todas las habitaciones del hotel
			habo: '',
			motivo: [],
			host: [],
			residencia: [],
			pais: [],
			cliente: '',
			// Es un valor que es recibido desde adicional-form
			aditional: [],
			host: [],
			// Si se abre una celda ocupada o libre, en el mounted cargará un arreglo de los tiempos que tiene el tipo de habitación de la habitación seleccionada
			tiempo: [],
			tiempoEscogido: {},
			idRegistro: '',
			// En el created guarda todos los tipos de pago existente(contado, tarjeta)
			pago: [],
			formData1: {
				// Si se abre desde una celda ocupada en el mounted guarda el id de la primera habitación registrada en un registro
				// Si se abre desde el botón de + se guarda 0
				// Si se abre desde una celda ya sea con estado LIBRE u OCUPADO se guarda el valor de hab en la ruta, viene a ser el
				// id de la habitación de la celda seleecionada
				// tipo_hab: '0',
				//Si se abre desde una celda ocupada  En el mounted  Guarda la fecha de ingreso de la primera habitación registrada en un registro, 2021-08-25
				fecha_ingreso: '',
				//Si se abre desde una celda ocupada En el mounted  Guarda la hora de ingreso de la primera habitación registrada en un registro, 07:00:00
				hora_ingreso: '',
				//Si se abre desde una celda ocupada En el mounted  Guarda la fecha de salida de la primera habitación registrada en un registro, 2021-08-27
				fecha_salida: '',
				//Si se abre desde una celda ocupada En el mounted  Guarda la hora de ingreso de la primera habitación registrada en un registro, 15:05:00
				hora_salida: '',
				//Si se abre desde una celda ocupada En el mounted guarda el id del tiempo escogido en la primera habitación del registro
				tiempo: '',
				tarifa: '',
				//Si se abre desde una celda ocupada En el mounted guarda la cantidad de adultos registrados en la primera habitación 
				adultos: '',
				//Si se abre desde una celda ocupada En el mounted guarda la cantidad de niños registrados en la primera habitación 
				child: '',
				//Si se abre desde una celda ocupada En el mounted guarda el tipo de pago establecido por todas las habitaciones de un registro
				tipo_pago: '',
				//Si se abre desde una celda ocupada En el mounted guarda el adelanto fijado por todas las habitaciones de un registro 
				adelanto: ''
			}
		}
	},
	validations: {
		formData1: {
			// tipo_hab: { required },
			fecha_ingreso: { required },
			fecha_salida: { required },
			hora_ingreso: { required },
			hora_salida: { required },
			adelanto: { required },
			// tiempo: { required },
			// tarifa: { required },
			// adultos: { required },
			// child: { required },
			tipo_pago: { required }
		},
		habNum: { required },
		arrayRooms: {
			required,
			$each: {				
				habitacion: { required },
				precio: { required },
				tiempo: { required },
				cantidad_adulto: { required },
				cantidad_nino: { required }
			}
		},
		habRoute: { required }
	},

	computed: {
		...mapGetters('customer', ['getCustom']),
		...mapGetters('adicionales', ['getAdicional']),
		...mapGetters('registro', ['getRegister']),
		
		// Retorna el número de días diferidos entre la fecha de ingreso y de salida
		days() {
			const oneDay = 24 * 60 * 60 * 1000
			const firstDate = new Date(this.formData1.fecha_ingreso)
			// console.log(firstDate)
			
			const secondDate = new Date(this.formData1.fecha_salida)
			// console.log(secondDate)

			// console.log(firstDate - secondDate)
			return Math.round(Math.abs((firstDate - secondDate) / oneDay))
		},
		// subTotal() {
		// 	if (this.subTotal !== '') {
		// 		return this.subTotal
		// 	} else {
		// 		console.log( this.dataSend, 'data send')
		// 		return this.days * this.dataSend.precio_total
		// 	}
		// },
		sumTotal() {
			return this.dataSend.precio_total + this.getAdicional
		},
		dataSend() {
			this.arrayRooms.forEach(el => {
				el.fecha_ingreso = `${this.formData1.fecha_ingreso} ${this.formData1.hora_ingreso}`
				el.fecha_salida = `${this.formData1.fecha_salida} ${this.formData1.hora_salida}`
				el.precio_total = this.days * el.precio

				if (this.$router.history.current.query.state !== 'undefined') {
					el.habitacion = this.habRoute	
					// el.codigo = `${this.formData1.tipo_hab}_${this.formData1.fecha_ingreso}`					
				}
				el.codigo = `${el.habitacion}_${this.formData1.fecha_ingreso}`
			})
		
			const dataFin = {
				reserva: null,
				cliente: this.getCustom.id,
				estado_registro: 'REGISTRADO',
				tipo_pago: this.formData1.tipo_pago,
				adelanto: this.formData1.adelanto,
				precio_total: this.arrayRooms.reduce((total, item) => {
					return total + item.precio_total
				}, 0),
				registros_habitacion: null
			}
			dataFin.registros_habitacion = this.arrayRooms
			// this.SET_CUSTOM(dataFin)
			return dataFin
		}
	},
	async created() {
		const route = this.$router.history.current.query
		this.hotelId = route.hotel
		this.getRooms()
		// this.getTypeRoom()		
		this.pago = await this.getParameters('TIPO_PAGO')
		// this.propertyRooms.habitacion = route.hab
		// this.addRooms(1)
	},
	async mounted() {
		const route = this.$router.history.current.query
		if (route.state === 'OCUPADO') {
			//Envia el id del registro al método getRegisterRoom
			//Guarda toda la información del registro
			const respReg = await this.getRegisterRoom(route.reg)
			this.subTotal = respReg.registros_habitacion[0].precio_total
			this.habNum = respReg.registros_habitacion.length
			this.arrayRooms = respReg.registros_habitacion
			this.recordRooms = respReg.registros_habitacion.map(el => el.id)
			this.habRoute = respReg.registros_habitacion[0].habitacion,

			// console.log(respReg.registros_habitacion.map(el => el.id))
			this.formData1 = {				
				// tipo_hab: respReg.registros_habitacion[0].habitacion,
				fecha_ingreso: this.parseDate(
					respReg.registros_habitacion[0].fecha_ingreso
				)[0],
				hora_ingreso: this.parseDate(
					respReg.registros_habitacion[0].fecha_ingreso
				)[1],
				fecha_salida: this.parseDate(
					respReg.registros_habitacion[0].fecha_salida
				)[0],
				hora_salida: this.parseDate(
					respReg.registros_habitacion[0].fecha_salida
				)[1],
				// tiempo: respReg.registros_habitacion[0].tiempo,
				// adultos: respReg.registros_habitacion[0].cantidad_adulto,
				// child: respReg.registros_habitacion[0].cantidad_nino,
				tipo_pago: respReg.tipo_pago,
				adelanto: respReg.adelanto
			}

			const form = document.getElementById('form-second')
			const input_precio = document.getElementById('input-precio')
			const select_hab = document.getElementById('select-habitacion')
			const select_tiempo = document.getElementById('select-tiempo')
			const select_child = document.getElementById('select-child')
			const select_adult = document.getElementById('select-adult')
			input_precio.setAttribute("disabled", "")
			select_hab.setAttribute("disabled", "")
			select_tiempo.setAttribute("disabled", "")
			select_child.setAttribute("disabled", "")
			select_adult.setAttribute("disabled", "")
			const elements = form.elements
			for (let i = 0, len = elements.length; i < len; ++i) {
				// console.log(elements[i])
				elements[i].disabled = true
			}
		}

		// console.log(route)
		// Esto sucede cuando se va a abrir el formulario desde el botón +
		if (route.hab === 'undefined') {
			// this.formData1.tipo_hab = '0'
		} else {
			// Esto sucede cuando abre desde una celda ya sea q tenga estado LIBRE u OCUPADO
			// this.formData1.tipo_hab = route.hab
			
			// this.getTiempo(route.hab)

			// SOLO FUNCIONA CUANDO LA CELDA ESTÁ OCUPA, NO CUANDO ESTÁ LIBRE
			const type_room_id = await this.getTypeRoom(route.hab)
			this.getTiempo(type_room_id)
			if (route.state === 'LIBRE') {					
				this.habRoute = route.hab
				this.formData1.fecha_ingreso = route.date
				const select_hab = document.getElementById('select-habitacion')	
				select_hab.setAttribute("disabled", "")
			}
		}
		// console.log($v.arrayRooms)
	},
	methods: {
		...mapActions('registro', ['SET_REGISTER']),
		countDownChanged(dismissCountDown) {
			this.dismissCountDown = dismissCountDown
		},
		showAlert() {
			this.dismissCountDown = this.dismissSecs
		},
		showMsgBoxTwo() {
			this.boxTwo = ''
			this.$bvModal.msgBoxOk('Habitación registrada', {
				title: 'Confirmación',
				size: 'sm',
				buttonSize: 'sm',
				okVariant: 'success',
				headerClass: 'p-2 border-bottom-0',
				footerClass: 'p-2 border-top-0',
				centered: true
			}).then(value => {
				this.boxTwo = value
			}).catch(err => {
				// An error occurred
			})
		},
		async obtenerTiempo(idHab){
			this.arrayRooms[0].tiempo = ''
			this.arrayRooms[0].precio = ''
			const type_room_id = await this.getTypeRoom(idHab.$model)
			// console.log(type_room_id)
			this.getTiempo(type_room_id)
		},
		async getTypeRoom(idHab) {
			const result = await this.$axios({
				method: 'get',
				url: `https://apirenti.com/v1/api/hotels/${this.hotelId}/rooms`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})			
			// return result.data
			const dato = result.data.filter(el => el.id === parseInt(idHab))		
			// Devuelve el id del tipo de habitación de la habitación seleccionada
			return dato[0].tipo_habitacion
		},

		addRooms(num) {
			this.arrayRooms = []
			for (let i = 0; i < num; i++) {
				this.arrayRooms.push({ ...this.propertyRooms })
			}
		},

		// retorna un arreglo en la primera parte está 28-12-2021, en la otra está el tiempo 07:00:00
		parseDate(date) {
			const arr = date.split('T')
			arr[1] = arr[1].substring(0, 8)
			return arr
		},
		totalFinal(e) {
			this.total = e
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
		async getRegisterRoom(idRegister) {
			const result = await this.$axios({
				method: 'get',
				url: `https://apirenti.com/v1/api/hotels/${this.hotelId}/records/${idRegister}`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			return result.data
		},
		
		tarifa(tiempo, hab, index) {
			this.tiempoEscogido = tiempo.filter(el => el.id === hab.tiempo.$model)
			
			hab.precio.$model = this.tiempoEscogido[0].precio
			// console.log(hab)
			// console.log(this.tiempoEscogido, 'tiempo escogido')
			// this.$set(this.rooms, index, tmp)
		},
		updateAditional(e) {
			this.aditional = e
		},

		updateHost(e){
			this.host = e
		},

		validateState(name) {
			const { $dirty, $error } = this.$v[name]
			return $dirty ? !$error : null
		},
		validate(name) {
			const { $dirty, $error } = this.$v.formData1[name]
			return $dirty ? !$error : null
		},
		validateHab(name) {
			const { $dirty, $error } = this.$v.arrayRooms.$each.$iter[0][name]
			return $dirty ? !$error : null
		},
		entrar(){
			this.$router.replace('first')
			this.$bvModal.hide('bv-modal-success')
		},
		beforeTabSwitch: async function() {
			if (this.$router.history.current.query.state === 'OCUPADO') {
				this.$router.replace('first')
				return true
			} else {
				this.$v.formData1.$touch()
				this.$v.habNum.$touch()
				this.$v.arrayRooms.$touch()
				if (this.$v.formData1.$invalid || this.$v.arrayRooms.$invalid || this.$v.habNum.$invalid) {
					return false
				}
				const result = await this.sendFinalForm()
				console.log(result.data)
				if(result != false){
					this.SET_REGISTER(result.data)
					this.idRegistro = result.data.id	
					console.log('HABITACIÓN REGISTRADA')
					// Este formato es modificable para cuando haya más de una habitación

					if(this.aditional.length !== 0) {
						console.log('SERVICIOS')
						const exitServices = await this.sendServices(0, result.data, this.aditional)
						console.log(exitServices)
						if (exitServices != false) {
							console.log('SERVICIO REGISTRADO')						
						} else {
							console.log('NO SE PUDO REGISTRAR EL SERVICIO')
						}
					}
					
					if(Object.keys(this.host).length !== 0) {
						console.log('HOSPEDANTES')
						const exitHosts = await this.sendHosts(0, result.data, this.host)
						console.log(exitHosts)
						if (exitHosts != false) {
							console.log('HOSPEDANTE REGISTRADO')
						} else {
							console.log('NO SE PUDO REGISTRAR EL HOSPEDANTE')
						}
					}					

					this.$bvModal.show('bv-modal-success')
				} else {
					console.log('NO SE PUDO REGISTRAR')
					this.$bvModal.show('bv-modal-error')
					return false
				}
			}
		},

		sendFinalForm() {
			return this.$axios({
				method: 'post',
				url: `https://apirenti.com/v1/api/hotels/${this.hotelId}/records`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				},
				data: JSON.stringify(this.dataSend)
			})
		},

		sendServices(index, registro, arrayAdditionalRecords){
			return this.$axios({
				method: 'post',
				url: `https://apirenti.com/v1/api/hotels/${
					this.hotelId
				}/room-records/${
					registro.registros_habitacion[index].id
				}/additional-records`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				},
				data: JSON.stringify(arrayAdditionalRecords)
			})
			// this.SET_PRODUCTS(result.data)
		},

		sendHosts(index, registro, ArrayHosts){
			return this.$axios({
				method: 'post',
				url: `https://apirenti.com/v1/api/hotels/${
					this.hotelId
				}/room-records/${
					registro.registros_habitacion[index].id
				}/hosts`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				},
				data: JSON.stringify(ArrayHosts)
			})
			// this.SET_PRODUCTS(result.data)
		},
		
		// Debe recibir el id del tipos de habitación de la celda seleccionada
		async getTiempo(idHab) {
			const result = await this.$axios({
				method: 'get',
				url: `https://apirenti.com/v1/api/hotels/${this.hotelId}/types-room/${idHab}/times`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			// console.log(result.data)
			this.tiempo = result.data
			// if (this.$router.history.current.query.state === 'OCUPADO') {
			// 	this.tarifa(this.tiempo)
			// }
		},
		async getRooms() {
			const result = await this.$axios({
				method: 'get',
				url: `https://apirenti.com/v1/api/hotels/${this.hotelId}/rooms`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			// console.log(result, 'result select')
			this.hab = result.data
		}
	}
}
</script>

<style lang="stylus">
// .vue-form-wizard .wizard-header
// 	display none !important
// 	padding 0 !important
// .wizard-progress-bar
// 	width 100%
// .vue-form-wizard
// 	padding 0
// .vue-form-wizard .wizard-tab-content
// 	min-height 100px
// 	padding 14px 20px 10px
</style>

<style lang="stylus" scoped>
.app
	margin 0% 7%
.card
	box-shadow 0px 2px 5px #888888
	// width 700px
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
	align-items center
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
</style>