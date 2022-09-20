<template lang="pug">
	div.container-card(class="d-flex flex-column")
		div.w100.bgFilter(class="d-flex")
			b-form-group.w100(description="Busca por código o número de documento" class="mb-0")
				b-input-group(size="sm")
					b-form-input(v-model="filter" type="search" id="filterInput" placeholder="Buscar por código o documento")
			//- b-form-group(label="Filter On" label-cols-sm="3" label-align-sm="right" label-size="sm" class="mb-0")
			//- 	b-form-checkbox-group(v-model="filterOn" class="mt-1")
			//- 		b-form-checkbox(value="id") Código
			//- 		b-form-checkbox(value="estado_reserva") Estado reserva
		b-table(responsive bordered centered head-variant="light" :items="reservations" :fields="fields" :current-page="currentPage" :per-page="perPage" :filter="filter" :filterIncludedFields="filterOn" @filtered="onFiltered" small hover)
			template(v-slot:cell(estado_reserva)="row")
				div(class="text-center" :class="row.item.estado_reserva === 'REGISTRADO' ? 'text-success' : row.item.estado_reserva === 'RESERVADO' ? 'text-warning' : 'text-danger'") {{row.item.estado_reserva.toUpperCase()}}
			template(v-slot:cell(detalles)="row")
				b-button.btn-view(v-b-modal="'modal-detail'+row.item.id" @click="getCliente(row.item.id)" size="sm") Ver
				b-modal(:id="'modal-detail'+row.item.id" :title="`Reserva: ${row.item.codigo_reserva}`" header-class="headerModal" okTitle="Guardar" hide-footer)
					Cliente(:reserva="row.item.id")
			template(v-slot:cell(cancelar)="row")
				b-button.btn-cancel(class="text-center" @click="cancelReservation(row.item.id)") Cancelar
		//- div#myCard.myCard
		//- 	b-card(v-for="item in reservationsPage" :header="`N° ${item.id}`")
		//- 		b-card-text {{item.estado_reserva}}
		//- 		b-card-text Fecha ingreso: {{item.fecha_ingreso}}
		//- 		b-card-text Fecha salida: {{item.fecha_salida}}
		//- 		b-button(v-b-modal="'modal-detail'+item.id" @click="getCliente(item.id)") Open Modal

		//- b-modal(:id="'modal-detail'+item.id" tabindex="-1" role="dialog")
		//- 	b-nav(tabs role="tablist")
		//- 		b-nav-item(active href="#cliente" data-toggle="tab") Cliente
		//- 		b-nav-item(href="#d2" data-toggle="tab") Habitación 2

		//- 		b-nav-text#cliente
		//- 			Cliente(:cliente="cliente" role="tabpanel")
		//- 		b-nav-text#d2
		//- 			div(role="tabpanel")
		//- 				h1 Hola
		//- p {{ filterOn }}
		b-pagination(v-model="currentPage" pills :per-page="perPage" :total-rows="rows" @change="onPageChanged" aria-controls="myCard")
</template>

<script>
import Cliente from '../components/reserva/Cliente'
export default {
	components: {
		Cliente
	},
	data() {
		return {
			filter: null,
			filterOn: ['codigo_reserva', 'numero_documento'],
			fields: [
				{ key: 'codigo_reserva', label: 'Código' },
				{ key: 'numero_documento', label: 'Cliente' },
				'fecha_ingreso',
				'fecha_salida',
				{ key: 'estado_reserva', label: 'Estado' },
				'detalles' , 'cancelar'
			],
			currentHotel: {},
			// Guarda un arreglo de todas las reservas del id del hotel 1
			reservations: [],
			// Reservas por páginas
			reservationsPage: [],
			currentPage: 1,
			perPage: 8,
			register: {},
			// Guarda la cantidad en números de las reservas total según el id del hotel
			rows: ''
		}
	},
	async created() {
		const result = await this.getDetailHotel()
		this.currentHotel = result.data[0]
		await this.getReservations()
		this.paginate(this.perPage, 0)
		console.log(this.$store)
	},
	// updated(){
	// 	this.getReservations()
	// 	// this.paginate(this.perPage, 0)
	// },
	mounted() {
		// this.totalRows = this.reservations.length
	},
	computed: {
		// rows() {
		// 	return this.reservations.length
		// }
	},
	methods: {
		onFiltered(filteredItems) {
			// Trigger pagination to update the number of buttons/pages due to filtering
			this.rows = filteredItems.length
			this.currentPage = 1
		},
		showModal() {
			this.$refs['my-modal'].show()
		},
		getDetailHotel() {
			return this.$axios({
				method: 'get',
				url: `https://apirenti.com/v1/api/users/${this.$store.$auth.user.id}/hotels`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
		},
		async cancelReservation(id) {
			const result = await this.$axios({
				method: 'put',
				url: `https://apirenti.com/v1/api/hotels/${this.currentHotel.id}/reservations/${id}`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			await this.getReservations()
		},
		async getCliente(id) {
			const result = await this.$axios({
				method: 'get',
				url: `https://apirenti.com/v1/api/hotels/${this.currentHotel.id}/reservations/${id}`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			this.register = result.data
		},
		async getReservations() {
			const result = await this.$axios({
				method: 'get',
				url: `https://apirenti.com/v1/api/hotels/${this.currentHotel.id}/reservations`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			this.reservations = result.data
			this.rows = this.reservations.length
			// this.reservationsPage = result.data
		},
		//8,0
		paginate(page_size, page_number) {
			let itemsToParse = this.reservations
			this.reservationsPage = itemsToParse.slice(
				// 0*8
				page_number * page_size,
				(page_number + 1) * page_size
			)
		},
		onPageChanged(page) {
			this.paginate(this.perPage, page - 1)
		}
	}
}
</script>

<style lang="stylus" scoped>
.container-card
	height 100%
	// justify-content space-between
	margin 0% 10% 0% 10%
	justify-content center
	align-items center
.myCard
	display flex
	flex-wrap wrap
	justify-content space-between
	height 100%
.card
	width 17%
.w100
	width 100%
.bgFilter
	border 1px solid #f2f2f2
	background-color #f2f2f294
	margin 2% 0%
	padding 1%
.headerModal
	background-color #7B2DED
	color white !important
	opacity 1
.btn-view
	border 1px solid #7B2DED
	color #7B2DED
	background-color white
.btn-cancel
	border 1px solid #ff000082
	color #ff000082
	background-color white
</style>
