<template lang="pug">
div
	tab-content(title="Cliente"	icon="fa fa-user-plus" :before-change="beforeTabSwitch")
		b-card
			b-form(id="form-one")
				b-modal(id="bv-modal-example" centered hide-footer hide-header)
					div.modal_style
						p El usuario no se encuentra registrado.
						p Completa los campos solicitados.
						b-button.btn_modal(class="mt-3" block @click="$bvModal.hide('bv-modal-example')") Aceptar
				b-modal(id="bv-modal-error" centered hide-footer hide-header)
					div.modal_style
						p Ha ocurrido un error, intente más tarde
						b-button.btn_modal(class="mt-3" block @click="$bvModal.hide('bv-modal-error')") Aceptar				
				div.h3-icon(class="d-flex")
					i(class="fa fa-user")
					h3 Informacion del cliente
				hr
				div.searchDoc
					div.margin-r5(class="d-flex flex-column")
						label.font-label(class="mr-sm-2") Tipo de documento
						b-form-select.selectTipo(class="mb-2 mr-sm-2 mb-sm-0" v-model="$v.formData.tipo_documento.$model" :state="validateState('tipo_documento')")
							b-form-select-option(value="" disabled) Tipo de documento
							b-form-select-option(v-for="doc in tipo_doc" :value="doc.nombre") {{ doc.nombre }}
						b-form-invalid-feedback Campo requerido
					div.baseline(class="d-flex")
						div
							b-form-input.width-input(@keypress.native="checkKey" class="mr-4" v-model="$v.formData.numero_documento.$model" :state="validateState('numero_documento')" placeholder="Número de documento")
							b-form-invalid-feedback
								p(v-if="formData.tipo_documento === 'RUC'") RUC requerido con 11 dígitos.
								p(v-if="formData.tipo_documento === 'DNI'") DNI requerido con 8 dígitos.
								p(v-if="formData.tipo_documento === 'PASAPORTE'") PASAPORTE requerido con 12 dígitos.
						b-button.button-search(@click="searchCustomer(formData.tipo_documento,formData.numero_documento)") Buscar
				div.infoClient.justify-cont(class="d-flex")
					div.w30
						label.font-label(class="") Nombre
						b-form-input(v-model="$v.formData.nombre.$model" :state="validateState('nombre')" placeholder="Nombres")
						b-form-invalid-feedback Campo requerido
					div.w30
						label.font-label(class="") Apellido
						b-form-input(v-model="$v.formData.apellido.$model" :state="validateState('apellido')" placeholder="Apellidos")
						b-form-invalid-feedback Campo requerido
					div
						label.font-label(class="") Edad
						//- :::::::::::::::::::::::::::::::INICIO:::::::::::::::::::::::::::::::
						//- Por que se modifica: Se busca que no sea validado la edad
						//- Nombre: @Giovanni
						//- Fecha: @05-09-21
						b-form-input(type="number", v-model="$v.formData.edad.$model", :state="validateState('edad')", placeholder="Edad")
						//- b-form-invalid-feedback(v-if="!$v.formData.edad.required") Campo requerido
						b-form-invalid-feedback(v-if="!$v.formData.edad.numeric") Solo números
						//- :::::::::::::::::::::::::::::::FIN::::::::::::::::::::::::::::::::::
					//- div.justify-cont(class="d-flex")
					//- div
					//- 	label.font-label(class="mr-4") Género
					//- 	div.divGenre(class="d-flex justify-content-start")
					//- 		b-form-radio.font-genero(v-for="genre in genero", :value="genre.id", v-model="$v.formData.genero.$model", :state="validateState('genero')", class="mr-4") {{ genre.nombre === "MASCULINO" ? "M" : "F"}}
						//- b-form-radio(v-model="$v.formData.genero.$model" :state="validateState('genero')" name="some-radios" value="Mas") Masculino
						//- b-form-invalid-feedback Campo requerido
				//- div.h3-icon(class="d-flex")
				//- 	i(class="fa fa-phone")
				//- 	h3 Contacto
				//- hr
				div.infoClient.margin6(class="d-flex")
					div
						label.font-label(class="mr-4") Género
						div.divGenre(class="d-flex justify-content-start")
							b-form-radio.font-genero(v-for="genre in genero", :value="genre.id", v-model="$v.formData.genero.$model", :state="validateState('genero')", class="mr-4") {{ genre.nombre === "MASCULINO" ? "M" : "F"}}
					div.margin-r5.inputEmail
						label.font-label(class="") Correo
						//- :::::::::::::::::::::::::::::::INICIO:::::::::::::::::::::::::::::::
						//- Por que se modifica: Se busca que no sea validado el correo electrónico
						//- Nombre: @Giovanni
						//- Fecha: @05-09-21
						b-form-input.correo(v-model="$v.formData.correo_electronico.$model", :state="validateState('correo_electronico')", placeholder="Correo electrónico")
						b-form-invalid-feedback Formato de correo
						//- :::::::::::::::::::::::::::::::FIN::::::::::::::::::::::::::::::::::
					div
						label.font-label(class="") Número de celular
						//- :::::::::::::::::::::::::::::::INICIO:::::::::::::::::::::::::::::::
						//- Por que se modifica: Se busca que no sea validado el número de celular
						//- Nombre: @Giovanni
						//- Fecha: @05-09-21
						b-form-input(v-model="$v.formData.celular.$model", :state="validateState('celular')", placeholder="Número de celular")
						//- b-form-invalid-feedback(v-if="!$v.formData.celular.required") Campo requerido
						b-form-invalid-feedback(v-if="!$v.formData.celular.numeric") Solo números
						b-form-invalid-feedback(v-else="!$v.formData.celular.minLength") Debe contener 9 dígitos
						//- :::::::::::::::::::::::::::::::FIN::::::::::::::::::::::::::::::::::						
				div.h3-icon(class="d-flex", style="cursor: pointer", @click="visible = !visible")
					i(:class='visible ? "fa fa-minus-square" : "fa fa-plus-circle"')
					h3 Información adicional
				hr
				b-collapse(v-model="visible")
					div.infoClient.justify-cont(class="d-flex")
						div
							label.font-label(class="mr-sm-2") Residencia
							//- :::::::::::::::::::::::::::::::INICIO:::::::::::::::::::::::::::::::
							//- Por que se modifica: Para que se muestre la validación
							//- Nombre: @Giovanni
							//- Fecha: @05-09-21
							b-form-select.selectTipo(class="mb-2 mr-sm-2 mb-sm-0", v-model="$v.formData.residencia.$model", :state="validateState('residencia')")
								b-form-select-option(value="0" disabled) Residencia
								b-form-select-option(v-for="dep in residencia" :value="dep.id" :key="dep.id") {{dep.nombre}}
							//- :::::::::::::::::::::::::::::::FIN::::::::::::::::::::::::::::::::::	
						div
							label.font-label(class="mr-sm-2") Motivo de viaje
							//- :::::::::::::::::::::::::::::::INICIO:::::::::::::::::::::::::::::::
							//- Por que se modifica: Para que se muestre la validación
							//- Nombre: @Giovanni
							//- Fecha: @05-09-21
							b-form-select.selectTipo(class="mb-2 mr-sm-2 mb-sm-0", v-model="$v.formData.motivo_viaje.$model", :state="validateState('motivo_viaje')")
								b-form-select-option(value="0" disabled) Motivo de viaje
								b-form-select-option(v-for="viaje in motivo" :value="viaje.id" :key="viaje.id") {{viaje.nombre}}
							//- :::::::::::::::::::::::::::::::FIN::::::::::::::::::::::::::::::::::	
						div
							label.font-label(class="mr-sm-2") Nacionalidad
							//- :::::::::::::::::::::::::::::::INICIO:::::::::::::::::::::::::::::::
							//- Por que se modifica: Para que se muestre la validación
							//- Nombre: @Giovanni
							//- Fecha: @05-09-21
							b-form-select.selectTipo(class="mb-2 mr-sm-2 mb-sm-0", v-model="$v.formData.nacionalidad.$model", :state="validateState('nacionalidad')")
								b-form-select-option(value="0" disabled) Nacionalidad
								b-form-select-option(v-for="country in pais" :value="country.id" :key="country.id") {{country.nombre}}
							//- :::::::::::::::::::::::::::::::FIN::::::::::::::::::::::::::::::::::
		
			b-form.secondForm#form-second
				b-modal(id="bv-modal-success" no-close-on-backdrop no-close-on-esc data-keyboard="false" centered hide-footer hide-header)
					div.modal_style
						p Habitación registrada
						b-button.btn_modal(class="mt-3" block @click="entrar()") Aceptar
				b-modal(id="bv-modal-error" centered hide-footer hide-header)
					div.modal_style
						p Ha ocurrido un error, intente más tarde
						b-button.btn_modal(class="mt-3" block @click="$bvModal.hide('bv-modal-error')") Aceptar
				div.h3-icon(class="d-flex")
					i(class="fa fa-hotel")
					h3 Detalle del registro
				hr
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
					b-form-select(class="mb-2 mr-sm-2 mb-sm-0", disabled, v-model="$v.habNum.$model", :state="validateState2('habNum')", @change="addRooms(habNum)")
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
import {
	required,
	numeric,
	email,
	maxLength,
	minLength
} from 'vuelidate/lib/validators'

export default {
	middleware: 'auth',
	mixins: [validationMixin],
	components: {
		Adicional
	},
	data() {
		return {
			visible: false,
			check: false,
			idpais: '',
			hotelId: '',
			motivo: [],
			residencia: [],
			pais: [],
			genero: [],
			tipo_doc: [],
			cliente: '',
			tiempo: [],
			tiempoEscogido: {},
			idRegistro: '',
			formData: {
				id: null,
				// :::::::::::::::::::::::::::::::INICIO:::::::::::::::::::::::::::::::
				// Por que se modifica: Se requiere que por defecto se encuentre en DNI
				// Nombre: @Giovanni
				// Fecha: @05-09-21
				tipo_documento: 'DNI',
				// :::::::::::::::::::::::::::::::FIN::::::::::::::::::::::::::::::::::				
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
			},
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
	validations() {
		return {
			formData: {
				//- :::::::::::::::::::::::::::::::INICIO:::::::::::::::::::::::::::::::
				//- Por que se modifica: Se busca que no sea validado el número de celular
				//- Nombre: @Giovanni
				//- Fecha: @05-09-21
				celular: { 
					// required,
					numeric,
					max: maxLength(9),
					min: minLength(9)
				},
				//- :::::::::::::::::::::::::::::::FIN::::::::::::::::::::::::::::::::::				
				tipo_documento: { required },
				numero_documento: {
					required,
					numeric,
					max:
						this.formData.tipo_documento === 'RUC'
							? maxLength(11)
							: false || this.formData.tipo_documento === 'DNI'
							? maxLength(8)
							: false || this.formData.tipo_documento === 'PASAPORTE'
							? maxLength(12)
							: false,
					min:
						this.formData.tipo_documento === 'RUC'
							? minLength(11)
							: false || this.formData.tipo_documento === 'DNI'
							? minLength(8)
							: false || this.formData.tipo_documento === 'PASAPORTE'
							? minLength(12)
							: false
				},
				nombre: { required },
				apellido: { required },
				//- :::::::::::::::::::::::::::::::INICIO:::::::::::::::::::::::::::::::
				//- Por que se modifica: Se busca que no sea validado la edad
				//- Nombre: @Giovanni
				//- Fecha: @05-09-21
				edad: { 
					// required,
					numeric
				},
				//- :::::::::::::::::::::::::::::::FIN::::::::::::::::::::::::::::::::::				
				genero: { required },
				residencia: {},
				motivo_viaje: {},
				nacionalidad: {},
				//- :::::::::::::::::::::::::::::::INICIO:::::::::::::::::::::::::::::::
				//- Por que se modifica: Se busca que no sea validado el correo electrónico
				//- Nombre: @Giovanni
				//- Fecha: @05-09-21
				correo_electronico: { email }
				//- :::::::::::::::::::::::::::::::FIN::::::::::::::::::::::::::::::::::				
			},
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
		}
	},
	async created() {
		this.idpais = await this.getIdPeru()
		// Get params of url
		console.log(this.$router)
		const route = this.$router.history.current.query
		this.hotelId = route.hotel

		// Get parameters to select
		this.tipo_doc = await this.getParameters('TIPO_DOCUMENTO')
		this.genero = await this.getParameters('GENERO')
		// console.log(this.capitalize(this.genero[0].nombre))
		this.getResidencia()
		this.motivo = await this.getParameters('MOTIVO_VIAJE')
		this.getPaises()

		this.getRooms()
		this.pago = await this.getParameters('TIPO_PAGO')
	},
	
	async mounted() {
		const route = this.$router.history.current.query
		// this.hotelId = route.hotel

		// Get id of country = Perú
		// this.idpais = await this.getIdPeru()
		// // Get params of url
		// const route = this.$router.history.current.query
		// this.hotelId = route.hotel
		if (route.state === 'OCUPADO') {
			const clienteReg = await this.getRegisterCliente(this.hotelId, route.reg)
			const clienteView = await this.getCliente(clienteReg)
			this.formData = {
				id: clienteView.id,
				tipo_documento: clienteView.tipo_documento,
				numero_documento: clienteView.numero_documento,
				nombre: clienteView.nombre,
				apellido: clienteView.apellido,
				edad: clienteView.edad,
				// cambiar por número
				genero: clienteView.genero === 'M' ? 3 : 2,
				correo_electronico: clienteView.correo_electronico,
				celular: clienteView.celular,
				residencia: clienteView.residencia,
				motivo_viaje: clienteView.motivo_viaje,
				nacionalidad: clienteView.nacionalidad
			}
			const form = document.getElementById('form-one')
			const elements = form.elements			
			for (let i = 0, len = elements.length; i < len; ++i) {
				elements[i].disabled = true
			}
		}
		// // Get parameters to select
		// this.motivo = await this.getParameters('MOTIVO_VIAJE')
		// this.genero = await this.getParameters('GENERO')
		// this.tipo_doc = await this.getParameters('TIPO_DOCUMENTO')
		// this.getPaises()
		// this.getResidencia()
	},
	computed: {
		...mapGetters('hotel', ['getHotel']),
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
	methods: {
		...mapActions('registro', ['SET_REGISTER']),
		// -------------------------------------------------------------------
		...mapActions('customer', ['SET_CUSTOM']),
		checkKey(e) {
			if (/^[A-Za-z]+$/.test(e.key)) {
				e.preventDefault()
				e.stopPropagation()
			}
		},
		capitalize(word) {
			const lower = word.toLowerCase();
			return word.charAt(0).toUpperCase() + lower.slice(1);
		},
		validateState(name) {
			const { $dirty, $error } = this.$v.formData[name]
			return $dirty ? !$error : null
		},
		beforeTabSwitch: async function() {
			const state = this.$router.history.current.query.state
			if (state === 'OCUPADO') {
				return true
			} else {
				this.$v.formData.$touch()
				if (this.$v.formData.$invalid) {
					return false
				}
				// return true

				// const res = await this.saveForm(this.formData)
				// res.then(res => {return true})
				// 	.catch( error => { console.log('ERROR', error) })
				this.formData.celular = this.formData.celular === '' ? '999999999' : this.formData.celular
				this.formData.edad = this.formData.edad === '' ? '99' : this.formData.edad
				const result = await this.saveForm(this.formData)
				console.log(result.data)
				if(result != false){
					this.cliente = result.data
					this.SET_CUSTOM(this.cliente)
					console.log('EXITOSAMENTE CLIENTE CREADO')
					return true
				}else {
					console.log('NO SE PUDO GUARDAR')
					this.$bvModal.show('bv-modal-error')

					return false
				}
				
				// setTimeout(function(){ 
				// 	console.log(this.check)
				// 	if(this.check){
				// 		console.log('EXITOSAMENTE CLIENTE CREADO')
				// 		return true
				// 	}else {
				// 		console.log('HA OCURRIDO UN ERROR')
				// 		return false
				// 	} 
				// }, 10000);
				
				
				// band.then(result => {
				// 	
				// })
				// console.log(band)
				// if(band == true) {
				// 	console.log('EXITOSAMENTE CLIENTE CREADO')
				// 	return true
				// }else {
				// 	console.log('HA OCURRIDO UN ERROR')
				// 	return false
				// }
			}
		},
		async getRegisterCliente(hotel,record) {
			const result = await this.$axios({
				method: 'get',
				url: `https://apirenti.com/v1/api/hotels/${hotel}/records/${record}`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			return result.data.cliente
		},
		async getCliente(idCliente) {
			const result = await this.$axios({
				method: 'get',
				url: `https://apirenti.com/v1/api/hotels/${this.hotelId}/customers/${idCliente}`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			return result.data
		},
		async getIdPeru() {
			const result = await this.$axios({
				method: 'get',
				url: 'https://apirenti.com/v1/api/paises?nombre=perú',
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			return result.data
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
				url: `https://apirenti.com/v1/api/paises/${this.idpais.id}/departmentos`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			this.residencia = result.data
		},
		async searchCustomer(tipo, documento) {
			this.$v.formData.tipo_documento.$touch()
			this.$v.formData.numero_documento.$touch()
			if (
				this.$v.formData.tipo_documento.$invalid ||
				this.$v.formData.numero_documento.$invalid
			) {
				return false
			}
			const data = JSON.stringify({
				tipo_documento: tipo,
				numero_documento: documento
			})
			const result = await this.$axios({
				method: 'post',
				url: `https://apirenti.com/v1/api/hotels/${this.hotelId}/search-customers`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				},
				data: data
			})
			// console.log(result)
			if (result.data.length === 0) {
				this.formData = {
					id: null,
					tipo_documento: this.formData.tipo_documento,
					numero_documento: this.formData.numero_documento,
					nombre: '',
					apellido: '',
					edad: '',
					genero: '',
					correo_electronico: '',
					celular: '',
					residencia: '0',
					motivo_viaje: '0',
					nacionalidad: '0'
				}
				this.SET_CUSTOM('')
				this.cliente = ''
				this.$bvModal.show('bv-modal-example')
			} else {
				this.cliente = result.data[0]
				this.formData = {
					id: result.data[0].id,
					tipo_documento: result.data[0].tipo_documento,
					numero_documento: result.data[0].numero_documento,
					nombre: result.data[0].nombre,
					apellido: result.data[0].apellido,
					edad: result.data[0].edad,
					genero: result.data[0].genero,
					correo_electronico: result.data[0].correo_electronico,
					celular: result.data[0].celular,
					residencia: result.data[0].residencia,
					motivo_viaje: result.data[0].motivo_viaje,
					nacionalidad: result.data[0].nacionalidad
				}
				this.$v.formData.$touch()
			}
		},
		saveForm(form) {
			// console.log(form)
			// if (this.cliente !== '') {
			// 	alert('put')
			// 	const result = await this.$axios({
			// 		method: 'put',
			// 		url: `https://apirenti.com/v1/api/hotels/${this.hotelId}/customers/${this.cliente.id}`,
			// 		headers: {
			// 			accept: 'application/json',
			// 			'Content-Type': 'application/json'
			// 		},
			// 		data: JSON.stringify(form)
			// 	})
			// 	this.SET_CUSTOM(result.data)
			// } else {
			// console.log(form)
			return this.$axios({
				method: 'post',
				url: `https://apirenti.com/v1/api/hotels/${this.hotelId}/customers`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				},
				data: JSON.stringify(form)
			}).catch(error => {
				return false
			})
			// .then(result => {
			// 	console.log(result)
			// 	this.cliente = result.data
			// 	this.check = true
			// 	this.SET_CUSTOM(this.cliente)				
			// }).catch(error => {
			// 	console.log('ERRROR EN SAVE FORM')
			// 	console.log(error)	
			// 	this.check = false			
			// })	
					
			// const result = await this.$axios({
			// 	method: 'post',
			// 	url: `https://apirenti.com/v1/api/hotels/${this.hotelId}/customers`,
			// 	headers: {
			// 		accept: 'application/json',
			// 		'Content-Type': 'application/json'
			// 	},
			// 	data: JSON.stringify(form)
			// }).catch(error => {
			// 	console.log('ERROR EN EL POST', error)				
			// })
			// this.cliente = result.data
			// this.SET_CUSTOM(this.cliente)
			
			// }

			// this.$emit('saveForm', form)
		},
		// ---------------------------------------------------------------------------
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

		validateState2(name) {
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

<style lang="stylus"></style>

<style lang="stylus" scoped>
.app
	margin 0% 7%
.card
	box-shadow 0px 2px 5px #888888
	height 100%
	width 100%
	&__body
		padding 3% 4%
.searchDoc
	display flex
	flex-direction column
.infoClient
	flex-direction column
.font-label
	font-size 12px
	font-weight bold
.font-genero
	font-size 12px
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
	margin-top 2%
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
	width 100%
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

@media screen and (min-width: 764px)
	.searchDoc
		flex-direction row
		align-items flex-end
	.infoClient
		flex-direction row
	.w30
		width 30%
// -------------------------
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
