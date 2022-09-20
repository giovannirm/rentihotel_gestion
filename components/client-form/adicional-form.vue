<template lang="pug">
	div
		div.header-mod
			p Adicionales
			//- b-button.btn_aditional(v-if="state === 'OCUPADO'" class="m-1") Ver
			//- b-button.btn_aditional(v-if="state !== 'OCUPADO'" v-b-modal.modal-request class="m-1") Agregar
				b-modal(id="modal-request" title="Warning" header-class="headerModal" header-close-variant="light" hide-footer)
					p ¿Desea guardar cambios?
					b-button(class="mt-3" block @click="saveDataForm") Aceptar
				//- b-collapse(id="collapse-2")
		b-card(v-if="clicked === true || state==='OCUPADO'")
			//- b-form-checkbox-group(v-model="selected" class="d-flex flex-column")
			b-form-radio#chkhos(v-b-modal.modal-1, v-model="selectedHos", value="hospedante") Hospedante
			//- b-form-checkbox(value="servicios" @change="sendTable(tabla)" v-b-modal.modal-2) Servicios
			b-form-radio#chkser(v-b-modal.modal-2, v-model="selectedSer", value="servicios") Servicios
			//- b-modal(id="modal-1" title="Hospedante(s)" header-class="headerModal" header-close-variant="light" hide-footer)
			b-modal(id="modal-1", no-close-on-backdrop, no-close-on-esc, title="Hospedante(s)", header-class="headerModal", hide-footer, hide-header-close)
				//- user -> envía un objeto con datos vacíos, está definido en el data() que es client
				//- id -> envía un valor vacío definido en el data() que es idCliente
				//- registro -> no se tiene información de idReg
				//- qty -> envía la cantidad de habitaciones recibida por el first-form del registro
				//- room_id -> recibe un arreglo de id del registro de cada habitación de un registro
				//- -----------------------------------------------------------------
				//- FirstForm(@saveData="updateHost" @saveId="updateId" :user="client" :id="idCliente" :registro="idReg" :qty="numRooms" :room_id="rooms")

				//- El evento saveData recibe un objeto con todos los campos rellenados en el formulario de hospedante de first-form
				FirstForm(@returnSelectHos="modifySelectHos", @saveData="updateHost", :user="client", :qty="numRooms", :room_id="rooms", :hospedante="selectedHos")
				//- -----------------------------------------------------------------
			b-modal(id="modal-2", no-close-on-backdrop, no-close-on-esc, title="Servicios", header-class="headerModal", okTitle="Guardar", hide-footer, hide-header-close)
				//- tableProp -> envía un arreglo vacío del atributo tabla
				//- qty -> envía la cantidad de habitaciones recibida por el first-form del registro
				//- room_id -> recibe un arreglo de id del registro de cada habitación de un registro
				Servicios(@returnSelectSer="modifySelectSer", @saveService="addService", @save="updateCart", @saveTotal="updateTotal", :tableProp="tabla", :qty="numRooms", :room_id="rooms", :servicios="selectedSer")
				//- Servicios(@saveTotal="updateTotal", :tableProp="tabla", :qty="numRooms", :room_id="rooms")

			//-b-card-group(deck)
			//-b-card(header="Adicional")
			//- template(v-slot:header)
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import FirstForm from './first-form'
import Servicios from './modal-servicio'

export default {
	// sendTotalF es un atributo q se envía desde second-form pero al parecer no se recibe
	// request hace referencia a idResult de second-form que dicho sea de paso guarda un valor vacío y no hay variación en second-form
	// idReg no tiene nada que ver con second-form
	// El datafin hace referencia al objeto datasend
	// numRooms hace referencia al número de habitaciones definido en second-form "habNum"
	// rooms guarda un arreglo de todos los ids del registro de cada habitacion registrada en un solo registro
	//- -----------------------------------------------------------------
	// props: ['request', 'idReg', 'dataFin','numRooms', 'rooms'],
	props: ['request', 'dataFin','numRooms', 'rooms'],
	//- -----------------------------------------------------------------
	components: {
		FirstForm,
		Servicios
	},
	data() {
		return {
			// En el created guarda el valor de state de la ruta
			selectedHos: '',
			selectedSer: '',
			state: '',
			total: '',
			// Valor inicializado en true para mostrar los checkbox
			clicked: true,
			// El valor seleccionado de uno de los checkbox por defecto
			selected: '',
			t: '',
			// Se inicializa como arreglo vacío, cuando se envía un servicio se llena este valor
			tabla: [],
			// Envía esta data al hijo first-form
			// idCliente: '',
			// Envía esta data al hijo first-form
			client: {
				tipo_documento: '0',
				numero_documento: '',
				nombre: '',
				apellido: '',
				edad: '',
				genero: '',
				correo: '',
				celular: '',
				residencia: 0,
				motivo_viaje: 0,
				nacionalidad: 0
			}
		}
	},
	computed: {
		...mapGetters('registro', ['getRegister', 'getResponseReg'])
	},
	created(){
		this.hospedante= 'accepted'
		this.state = this.$router.history.current.query.state
	},
	mounted(){
		this.hospedante= 'accepted'
	},
	methods: {
		...mapActions('registro', ['SET_REGISTER']),
		modifySelectHos(e) {
			this.selectedHos = e
		},
		modifySelectSer(e) {
			this.selectedSer = e
		},
		// ---------------------------------------------------
		// async saveDataForm() {
		// 	if (this.getRegister.hasOwnProperty('id')) {
		// 		this.clicked = true
		// 		this.$bvModal.hide('modal-request')
		// 	} else {
		// 		const result = await this.$axios({
		// 			method: 'post',
		// 			url: 'https://apirenti.com/v1/api/hotels/1/records',
		// 			headers: {
		// 				accept: 'application/json',
		// 				'Content-Type': 'application/json'
		// 			},
		// 			data: JSON.stringify(this.dataFin)
		// 		})
		// 		// console.log(result, 'result of aditional')
		// 		this.SET_REGISTER(result.data)
		// 		this.clicked = true
		// 		this.$bvModal.hide('modal-request')
		// 	}
		// 	this.$bvModal.hide('modal-request')
		// 	this.clicked = true

		// },
		// ---------------------------------------------------

		openModal() {
			const modal = document.getElementById('modal-1')
			if (selected === 'hospedante') {
				modal.innerHTML = '<FirstForm />'
			}
		},
		sendIdClient(id) {
			this.$emit('sendIdClient', id)
		},
		sendIdTotal(id) {
			this.$emit('sendTotalF', id)
		},
		// ----------------------------------------------
		// Se ejecuta cada vez que se presiona sobre el checkbox servicios
		// sendTable(tab) {			
			// Esto se recibe cuando se entra por primera vez al modal de servicio, ya que inicialmente el atributo table está vacío
			// if (tab.length === 0) {
			// 	// Envía un arreglo vacío
			// 	this.$emit('sendTable', tab)
			// } else {
			// 	const newTab = []
			// 	tab.forEach(el => {
			// 		const a = {
			// 			adicional: el.id,
			// 			cantidad: el.cantidad,
			// 			tipo_adicional: 'PRODUCTO',
			// 			precio_total: el.cantidad * el.precio_unitario
			// 		}
			// 		newTab.push(a)
			// 	})
			// 	this.$emit('sendTable', newTab)
			// }
		// },
		// ----------------------------------------------			

		updateTotal(e) {
			this.total = e
		},

		// ------------------------------------------------
		//Es un método para añadir un servicio como compra de bebidas, comida o etc
		// Recibe un arreglo de todos los servicios por cada habitación registrada de un registro
		updateCart(e) {
			this.tabla = e			
		},
		addService(e){
			this.$emit('sendTable', e)
		},
		// ------------------------------------------------
		// emptyCart() {
		// 	this.tabla = []
		// 	// this.total = 0
		// },

		//Es un evento de first-form donde se muestra los datos del hospedante, el valor e es el objeto de datos de un hospedante
		updateHost(e) {
			this.client = e
			this.$emit('sendHost', e)
		},

		//Es un evento de first-form donde se muestra los datos del hospedante
		// updateId(e) {
		// 	this.idCliente = e
		// }
	}
}
</script>

<style lang="stylus" scoped>
.card-header
	font-size 12px
	font-weight bold
.card-body
	padding 0.8rem
.custom-control-label
	font-size 12px
.btn-primary
	color white
	background-color #7B2DEB
	border-color #7B2DEB
.btn-secondary
	color white
	background-color #A8A8AB
	border-color #A8A8AB
.btn_modal
	width 30%
	background-color #7b2deb
	border-color #7b2deb
.headerModal
	background-color #7B2DED
	color white !important
	opacity 1
.modal-body
	padding 1.5rem

.header-mod
	display flex
	justify-content space-between
	border 1px solid #dfdfdf
	border-radius 3px
	align-items baseline
	padding 0% 2%
	font-size 14px
	background-color #7b2ded30
.btn_aditional
	font-size 12px
	background-color #313131
	color white
// .close
</style>
