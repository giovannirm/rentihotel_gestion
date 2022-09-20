<template lang="pug">
	div
		div(v-if="Object.values(detail).length > 0")
			//- p Código de reserva: {{ detail.id }}
			//- p {{detail}}
			div
				b-form-group(size="sm" label="Cliente" label-for="cliente")
					b-form-input(id="cliente" size="sm" :value="`${detail.registro_cliente.nombre} ${detail.registro_cliente.apellido}`" readonly)
				.d-flex
					b-form-group(size="sm" label="Fecha de ingreso" label-for="fecha-ingreso")
						b-form-input(id="fecha-ingreso" size="sm" :value="`${detail.fecha_ingreso.split('T')[0]}`" readonly)
					b-form-group(size="sm" label="Fecha de salida" label-for="fecha-salida")
						b-form-input(id="fecha-salida" size="sm" :value="`${detail.fecha_salida.split('T')[0]}`" readonly)
				.d-flex(v-if="detail.estado_reserva !== 'REGISTRADO'")
					b-form-group(size="sm" label="Precio total" label-for="salida")
						b-form-input(id="salida" v-model="hora_salida" type="time" size="sm")
				.d-flex
					b-form-group(size="sm" label="Precio total" label-for="precio")
						b-form-input(id="precio" size="sm" :value="`S/. ${detail.precio_total}`" readonly)
			//- p Fecha: {{ detail.fecha_registro}}
			//- (v-if="detail.estado_registro !== 'REGISTRADO'")
			div(v-if="detail.estado_reserva !== 'REGISTRADO'")
				b-card(no-body)
					b-tabs(v-model="tabIndex" card)
						//- div(v-for="hab in detail.reserva_detalle" )
						//- 	b-tab(v-for="h in hab.cantidad" :title="`Hab`")
						//- 		p Tipo de habitación
						//- 		p {{ hab }}
						//- 		//- p @change="getNumRooms(hab.tipo_habitacion)"
						//- 		select(size="sm" v-model="hab.tipo_habitacion" @change="getNumRooms(hab.tipo_habitacion)")
						//- 			option(v-for="t in typeRooms" :key="t.id" :value="t.id") {{t.nombre}}
						//- 		p Número de habitación
						//- 		b-form-select(size="sm" v-model="number" @change="getTiempo(hab.tipo_habitacion)")
						//- 			b-form-select-option(v-for="t in numberRoom" :key="t.id" :value="t.numero_habitacion") {{t.numero_habitacion}}
						//- 		p Tiempo
						//- 		p {{hab.tiempo}}
						//- 		b-form-select(size="sm" v-model="hab.tiempo")
						//- 			b-form-select-option(v-for="t in times" :key="t.id" :value="t.id") {{t.codigo}}
						//- 		b-button(size="sm" @click="addHabDetail(hab, type, number, tarifa)") Agregar
						b-tab(v-for="(h, index) in arrayHab" :title="`Hab ${index + 1}`")
							p Tipo de habitación
							b-form-select(size="sm" required v-model="h.habitacion" @change="getNumRooms(h.habitacion)")
								//- b-form-select-option(value="" selected disabled) Tipo de documento
								b-form-select-option(v-for="t in typeRooms" :key="t.id" :value="t.id") {{t.nombre}}
							p Número de habitación
							b-form-select(size="sm" required v-model="h.codigo" @change="getTiempo(h.habitacion)")
								b-form-select-option(v-for="t in h.rooms" :key="t.id" :value="t.numero_habitacion") {{t.numero_habitacion}}
							p Tiempo
							b-form-select(size="sm" required v-model="h.tiempo")
								b-form-select-option(v-for="t in times" :key="t.id" :value="t.id" @change="addPrecio(t.precio)") {{t.codigo}}
							//- p {{h}}
				b-button.buttonSend(size="sm" @click="addHabDetail(arrayHab)") Agregar

			div(v-else)
				b-button
					nuxt-link(to="/first") Ver en Room Booking
		div(v-else)
			div(class="text-center")
				b-spinner(style="width: 3rem; height: 3rem; background-color:#7b2ded;" label="Large Spinner" type="grow")


</template>

<script>
export default {
	props: ['reserva'],
	data() {
		return {
			hora_salida: '',
			rooms: '',
			tmp: [],
			tabIndex: 0,
			type: null,
			number: '',
			tarifa: '',
			typeRooms: [],
			numRooms: '',
			hab: '',
			detail: '',
			numberRoom: '',
			times: '',
			registrosHab: ''
		}
	},
	computed: {
		arrayHab() {
			const arrayEmpty = []
			this.detail.reserva_detalle.forEach(el => {
				for (let i = 0; i < el.cantidad; i++) {
					const obj = {
						habitacion: el.tipo_habitacion,
						codigo: '0',
						rooms: this.rooms === '' ? [] : this.rooms.filter(elm => elm.tipo_habitacion === el.tipo_habitacion),
						estado_habitacion: 'RESERVADO',
						fecha_ingreso: `${this.detail.fecha_ingreso} ${this.detail.hora_llegada}`,
						fecha_salida: `${this.detail.fecha_salida} ${this.hora_salida}`,
						cantidad_adulto: 0,
						cantidad_nino: 0,
						tiempo: el.tiempo,
						precio: el.cantidad > 1 ? el.precio_total/el.cantidad : el.precio_total,
						precio_total: el.precio_total
					}
					arrayEmpty.push(obj)
				}
			})
			return arrayEmpty
		}
	},
	async created() {
		this.rooms = await this.getAllRooms()
	},
	async mounted() {
		this.detail = await this.getCliente(this.reserva)

		this.typeRooms = await this.getTypeRoom()
		// this.numRooms = await this.getNumRooms()
		// console.log(this.numRooms, 'numrrom')
	},
	methods: {
		addPrecio(precio) {
			this.type = a
		},
		async addHabDetail(tmp) {
			tmp.forEach(function(v){ delete v.rooms });
			// console.log(hab, type, number, tarifa, 'habitattt')
			// const detailHab = {
			// 	habitacion: hab.tipo_habitacion,
			// 	codigo: number,
			// 	estado_habitacion: 'RESERVADO',
			// 	fecha_ingreso: this.detail.fecha_ingreso,
			// 	fecha_salida: this.detail.fecha_salida,
			// 	cantidad_adulto: 0,
			// 	cantidad_nino: 0,
			// 	tiempo: tarifa,
			// 	precio: '600',
			// 	precio_total: '600'
			// }
			const data = {
				registro_cliente: {
					id: this.detail.registro_cliente.id,
					numero_documento: this.detail.registro_cliente.numero_documento
				},
				registro: {
					reserva: this.detail.id,
					cliente: null,
					estado_registro: 'RESERVADO',
					tipo_pago: this.detail.tipo_pago,
					adelanto: this.detail.adelanto,
					precio_total: this.detail.precio_total,
					registros_habitacion: null
				}
			}
			data.registro.registros_habitacion = tmp
			const result = await this.$axios({
				method: 'post',
				url: `https://apirenti.com/v1/api/hotels/1/reservation-records`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				},
				data: JSON.stringify(data)
			})
		},
		async getCliente(id) {
			const result = await this.$axios({
				method: 'get',
				url: `https://apirenti.com/v1/api/hotels/1/reservations/${id}`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			return result.data
		},
		async getTypeRoom() {
			const result = await this.$axios({
				method: 'get',
				url: `https://apirenti.com/v1/api/hotels/1/room-types`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			// console.log(result.data)
			return result.data
		},
		async getAllRooms() {
			const result = await this.$axios({
				method: 'get',
				url: `https://apirenti.com/v1/api/hotels/1/rooms`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			return result.data
		},
		getNumRooms(id) {
			// const result = await
			this.$axios({
				method: 'get',
				url: `https://apirenti.com/v1/api/hotels/1/rooms?type=${id}`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			.then((result) => {
				this.tmp.push(result.data)
			})
			// console.log(result.data)
			// this.numberRoom = result.data
			// return result.data
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
			this.times = result.data
		}
	}
}
</script>

<style lang="stylus" scoped>
.containerHab
	border 1px solid black
.buttonSend
	background-color #7b2bde
.label
	color red

</style>
