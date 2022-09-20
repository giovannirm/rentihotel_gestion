<template lang="pug">
	b-tabs(v-model="tabIndex" v-if="qty>0" card)
		b-tab(v-for="(h, index) in qty" :title="`Hab ${index+1}`")
			b-input-group(class="mb-2")
				b-input-group-prepend(is-text)
					i(class="fa fa-search")
				b-form-input#search(type="search" v-model="query" @keyup="searchAditional" aria-label="Text input with checkbox")

			b-card(v-if="query.length > 0")
				template
					.aditional(class="d-flex justify-content-between" v-for="(ad, index) in aditional" :key="index")
						div(v-if="ad.cantidad >0")
							p {{ ad.nombre }}
							b-button.btnPlus(@click="addProduct(ad)")
								i(class="fa fa-plus")
			hr
			b-table(centered head-variant="dark" :items="tableProp[tabIndex]" :fields="fields")
				template(v-slot:cell(cantidad)="{ item, value }")
					b-form-input(size="sm" type="number" class="mr-2" :value="value" min="0" :max="item.stock" @change="addQty(item, value)")
					//- p {{ item }}
			p(v-if="tableProp.length > 0" class="text-right") Subtotal:
				span.total-style {{ total }}

			div(class="d-flex justify-content-around")
					b-button.btn_modal(class="mt-3" block @click="sendServices") Aceptar
					b-button.btn_cancel(class="mt-3" block @click="exit()") Cancelar
			
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
	//- tableProp -> SI LA CELDA ESTÁ OCUPADO
	// se recibe vacío pero en el mounted se llena si se abre desde una celda ocupada, 
	// tableProp -> SI LA CELDA ESTÁ LIBRE
	// cuando envia servicios guarda un arreglo de servicios por cada registro de habitacion de un solo registro

	//- qty -> envía la cantidad de habitaciones recibida por el first-form del registro
	//- room_id -> recibe un arreglo de id del registro de cada habitación de un registro
	props: ['tableProp', 'qty', 'room_id', 'servicios'],
	data() {
		return {
			// Es para mostrar el orden de las columnas en la tabla
			fields: ['nombre', 'precio_unitario', 'cantidad'],
			// Es la pestaña inicializada de entre todas las habitaciones registradas
			tabIndex: 0,
			hotelId: '',
			// Recoge el resultado que arroja la búsqueda filtrada dinámicamente
			aditional: '',
			table: [],
			// En el created almacenará un arreglo vacío por cada habitación registrada de un solo registro
			tableView: [],
			// Valor inicial de la búsqueda
			query: '',
			resultAdd: '',
			store: [],
			propAditional: {
				adicional: 0,
				cantidad: 0,
				tipo_adicional: 0,
				precio_total: 0
			}
		}
	},
	created() {
		this.tableView = []
		for (var i = 0; i < this.qty; i++) {
			this.tableView.push([])
		}
	},

	async mounted() {
		const route = this.$router.history.current.query
		this.hotelId = route.hotel
		// Se da cuando se abre desde una celda ocupada
		if (route.state === 'OCUPADO') {
			// iteran el array de id's de cada habitación registrada de un solo registro
			for (let i = 0; i < this.room_id.length; i++) {
				// Envía un id de una lista de id's de cada habitación registrada de un solo registro
				const tmpObj = await this.getHostReg(this.room_id[i])
				this.tableProp.push(tmpObj)
			}
		}

		// this.tableView = this.tableProp
	},
	computed: {
		...mapGetters('hotel', ['getHotel']),
		// DEBE SER COMENTADO PORQUE SU FUNCIONALIDAD SERÁ CAMBIADA DE POSICIÓN
		// ...mapGetters('registro', ['getRegister']),
		...mapGetters('adicionales', ['getProducts']),
		// tableView() {
		// 	if(tabl)
		// 	var arr = []

		// 	for (var i = 0; i < this.qty; i++) {
		// 		arr[i] = []
		// 	}

		// 	return arr
		// },
		total() {
			const result = this.tableProp[this.tabIndex].reduce((total, item) => {
				return total + item.precio_unitario * item.cantidad
			}, 0)
			this.SET_ADICIONAL(result)
			return result
		},
		// ESTO NO SE LLEGA A USAR, NO SÉ POR QUÉ ESTÁ AQUÍ
		// hotel() {
		// 	return this.getHotel
		// },
		// register() {
		// 	return this.getRegister
		// },
		// product() {
		// 	return this.getProducts
		// }
	},
	methods: {
		...mapActions('adicionales', ['SET_ADICIONAL', 'SET_PRODUCTS']),
		exit() {
			this.servicios = 'false',
			this.$emit('returnSelectSer', this.servicios)
			this.$bvModal.hide('modal-2')
			console.log('SALIDA')
		},
		// Recibe un id de una habitación registrada de una lista de habitaciones registradas de un registro
		async getHostReg(idReg) {
			const result = await this.$axios({
				method: 'get',
				url: `https://apirenti.com/v1/api/hotels/${this.hotelId}/room-records/${idReg}/additional-records`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				},
				data: JSON.stringify(this.formData)
			})
			console.log("---------------------------")
			console.log(this.formData)
			console.log("---------------------------")
			console.log(result.data)

			return result.data
		},
		async sendServices() {
			// Se almacena los productos por habitación
			const newTab = []
			// Sucede desde una celda libre, el tableview es un arreglo vacío con varias posiciones, toma
			// la posición del tabIndex que viene a ser la pestaña
			this.tableView[this.tabIndex].forEach(el => {
				const a = {
					adicional: el.id,
					cantidad: el.cantidad,
					tipo_adicional: 'PRODUCTO',
					precio_total: el.cantidad * el.precio_unitario
				}
				// console.log(a)
				newTab.push(a)
				// console.log(newTab)
			})

			// this.tableProp = this.tableView

			// console.log(newTab)
			// this.$emit('sendDataServices', newTab)
			// this.saveTable(this.tableView)
			this.saveDataTable(newTab)
			this.servicios = 'servicios',
			this.$emit('modifySelectSer', this.servicios)
			this.$bvModal.hide('modal-2')

			// Recoge del store el getProducts
			// console.log(this.getProducts.length)
			// ---------------------------------------------------------------------
			// if (this.getProducts.length === 0) {
			// 	const result = await this.$axios({
			// 		method: 'post',
			// 		url: `https://apirenti.com/v1/api/hotels/${
			// 			this.hotelId
			// 		}/room-records/${
			// 			this.getRegister.registros_habitacion[this.tabIndex].id
			// 		}/additional-records`,
			// 		headers: {
			// 			accept: 'application/json',
			// 			'Content-Type': 'application/json'
			// 		},
			// 		data: JSON.stringify(newTab)
			// 	})
			// 	this.SET_PRODUCTS(result.data)
			// 	// this.$bvModal.hide('modal-2')
			// } else {
			// 	this.resultAdd = JSON.parse(JSON.stringify(this.getProducts))
			// 	this.resultAdd.forEach(el => {
			// 		newTab.forEach(a => {
			// 			if (el.adicional === a.adicional) {
			// 				el.cantidad = a.cantidad
			// 				el.precio_total = a.precio_total
			// 			} else {
			// 				this.resultAdd.push(a)
			// 			}
			// 		})
			// 	})
			// 	const result = await this.$axios({
			// 		method: 'put',
			// 		url: `https://apirenti.com/v1/api/hotels/${this.hotelId}/room-records/${this.getRegister.registros_habitacion[this.tabIndex].id}/additional-records`,
			// 		headers: {
			// 			accept: 'application/json',
			// 			'Content-Type': 'application/json'
			// 		},
			// 		data: JSON.stringify(this.resultAdd)
			// 	})
			// 	this.SET_PRODUCTS(result.data)
			// 	// this.$bvModal.hide('modal-2')
			// }
			// ---------------------------------------------------------------------
		},
		addQty(item, value) {
			// console.log(item)
			// console.log(value)
			// console.log(event.target.value)
			item.cantidad = event.target.value
		},
		// Es lo que se va a buscar
		async searchAditional() {
			if (this.query !== '') {
				const result = await this.$axios({
					method: 'get',
					url: `https://apirenti.com/v1/api/hotels/${this.hotelId}/additionals?name=${this.query}`,
					headers: {
						accept: 'application/json',
						'Content-Type': 'application/json'
					}
				})
				// console.log(result.data)
				this.aditional = result.data
			}
		},

		// Añade servicios cada vez que presiona sobre el botón +
		addProduct(product) {
			let inCart = false
			// Update quantity if the item is already in the cart
			inCart = this.tableView[this.tabIndex].some(
				// Busca en todo el arreglo si existe tal coincidencia
				el => el.nombre === product.nombre
			)
			console.log(inCart)
			if (inCart === true) {
				// a tendrá el indice de aquel valor que coincida el nombre
				const a = this.tableView[this.tabIndex].findIndex(
					el => el.nombre === product.nombre
				)
				this.tableView[this.tabIndex][a].cantidad++
			}

			// Add item if not already in the cart
			// Es la primera vez cuando no ha sido registrado un artículo, a la segunda pasada entra a true 
			if (inCart === false) {
				this.tableView[this.tabIndex].push({
					id: product.id,
					nombre: product.nombre,
					precio_unitario: product.precio,
					stock: product.cantidad,
					cantidad: 1
				})
			}
			// --------------------------------------
			// tableProp guarda un arreglo de servicios por cada registro de habitacion de un solo registro
			// this.tableProp = this.tableView
			// --------------------------------------

			// const arrLength = this.tableView[this.tabIndex].length
			// let verify = false
			// let arrTmp = this.tableView
			// // if (arrLength > 0) {
			// verify = this.tableView[this.tabIndex].some(
			// 	el => el.descripcion === product.nombre
			// )
			// // }
			// if (verify) {
			// 	const a = this.tableView[this.tabIndex].findIndex(
			// 		el => el.descripcion === product.nombre
			// 	)
			// 	this.tableView[this.tabIndex][a]['cantidad'] =
			// 		parseInt(this.tableView[this.tabIndex][a]['cantidad']) + 1
			// } else {
			// 	const prod = {
			// 		id: product.id,
			// 		descripcion: product.nombre,
			// 		precio: product.precio,
			// 		stock: product.cantidad,
			// 		cantidad: 1
			// 	}
			// 	if (arrLength === 0) {
			// 		this.tableView[this.tabIndex] = [prod]
			// 		// this.tableProp[this.tabIndex] = [prod]
			// 	} else {
			// 		this.tableView[this.tabIndex].push(prod)
			// 		// this.tableProp[this.tabIndex].push(prod)
			// 	}
			// }
			// this.tableProp = this.tableView
			
			// ------------------------------------------------			
			this.saveTable(this.tableView)
			// ------------------------------------------------
		},

		// ------------------------------------------------
		//Envía un evento para actualizar los servicios
		saveTable(tab) {
			this.$emit('save', tab)
			// this.$bvModal.hide('modal-2')
		},
		// ------------------------------------------------
		saveDataTable(service) {
			this.$emit('saveService', service)
		}
	}
}
</script>

<style lang="stylus" scoped>
.form-control:focus
	border-color #7B2DEB
	box-shadow none
.aditional
	font-size 12px
.btnPlus
	background-color #252432
	border-color #252432
	width 20px
	height 20px
	font-size 12px
	padding 0
.table
	font-size 14px
.total-style
	margin-left 5%
	padding 0% 12%
	border-bottom 1px solid #212529
.btn_modal
	width 30%
	background-color #7b2deb
	border-color #7b2deb
.btn_cancel
	width 30%
	background-color #9b9b9b
	border-color #9b9b9b
</style>
