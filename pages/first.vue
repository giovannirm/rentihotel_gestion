<template lang="pug">
	div.app(class="d-flex flex-column align-items-end")
		div.w50(class="d-flex justify-content-between align-items-baseline")
			p {{ getMonth(curr)}} {{getYear(curr)}}
			//- b-button#toggle.btnToggle(@click="toggleBtn") Día
		div.filters(class="d-flex")
			//- b-button.button-filter(v-for="t in type" :key="t.id" @click="filterRoom(currentHotel, t.id)" :id="t.id") {{t.nombre}}
			div.filters_div(class="d-flex flex-row align-items-center")
				label.mr-4 Tipo de habitación
				b-form-select.selectHab(size="sm" v-model="typeSelected" @change="filterFn(typeSelected)")
					b-form-select-option(v-for="t in type" :key="t.id" :value="t.id") {{t.nombre}}
			b-button-group(id="btn-group" size="sm")
				b-button.btnLg(@click="buttonToday") Hoy
				b-button.btnLg(@click="selected='Dia'") Día
				b-button.btnLg.active(@click="selected='Semana'") Semana


		div.width_table(v-if="week.length > 0")
			div.container-table(v-if="selected==='Semana'" class="d-flex align-items-center")
				//- button.btn-prev-next.mrg-ri(@click="previous") <
				button.btn-prev-next(@click="previous") «
					//- i(class="fa fa-angle-left")
				b-table-simple#table(responsive, sticky-header)
					b-thead
						b-tr
							b-th.tab-th
								template
									img(src="../assets/iconos/bed.png" alt="" width="30" height="30")
							b-th.widthCell(v-for="(day, index) in week" :key="index")
								div.headerTable
									span {{ day.dayLabel}}
									span.spanDay {{day.day}}
					b-tbody
						b-tr(v-for="(h, item_index) in hab" :key="item_index")
							b-td.text-center {{ h.numero_habitacion }}
							b-td(v-for="(day, day_index) in week" :id='`${h.id}_${week[day_index].year}-${week[day_index].n_month}-${week[day_index].day}`' :data-date="`${week[day_index].year}-${week[day_index].n_month}-${week[day_index].day}`" :data-type="h.id" @click="goForm")
				//- button.btn-prev-next.mrg-le(@click="next") >
				button.btn-prev-next(@click="next") »
					//- i(class="fa fa-angle-right") >
			div.container-table-day(v-if="selected==='Dia'" class="d-flex align-items-center")
				//- button.btn-prev-next.mrg-ri(@click="preDay") <
				button.btn-prev-next(@click="preDay") «
					//- i(class="fa fa-angle-left")
				b-table-simple#table(striped, responsive, sticky-header)
					b-thead
						b-tr
							b-th.tab-th
								template
									img(src="../assets/iconos/bed.png" alt="" width="30" height="30")
							b-th
								div.headerTable
									span {{ getDay(curr) }}
									span.spanDay {{ getDate(curr) }}
					b-tbody
						b-tr(v-for="(h, item_index) in hab")
							b-td.text-center {{h.numero_habitacion}}
							b-td(:id='`${h.id}_${parseDate(curr)}`' :data-type="h.id" :data-date="parseDate(curr)" @click="goForm")
				//- button.btn-prev-next.mrg-le(@click="nextDay") >
				button.btn-prev-next(@click="nextDay") »
				//- i(class="fa fa-angle-right")
		div(v-else class="align-self-center")
			div(class="text-center")
				b-spinner(style="width: 3rem; height: 3rem; background-color:#7b2ded;" label="Large Spinner" type="grow")
		b-button.btn-circle(@click="goForm") +
			//- i(class="fa fa-plus")
		p.none {{reservas}}
</template>

<script>
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'
const months = [
	'Enero',
	'Febrero',
	'Marzo',
	'Abril',
	'Mayo',
	'Junio',
	'Julio',
	'Agosto',
	'Setiembre',
	'Octubre',
	'Noviembre',
	'Diciembre'
]
const days = [
	'Lunes',
	'Martes',
	'Miércoles',
	'Jueves',
	'Viernes',
	'Sábado',
	'Domingo'
]
export default {
	middleware: 'auth',
	data() {
		return {
			records: {},
			currentHotel: {},
			week: [],
			w: [],
			curr: new Date(),
			currNext: new Date(),
			selected: 'Semana',
			now: new Date(),
			miau: new Date(),
			habitaciones: [],
			hab: [],
			type: [],
			typeSelected: '',
			// reservas: [
			// 	// '101_20200316',
			// 	// '201_20200317',
			// 	// '101_20200318',
			// 	// '201_20200320'
			// ],
			header: {
				label: 'Mes'
			},
			weekday: {
				label: 'semana'
			},
			day: {
				label: 'dia'
			}
		}
	},
	async created() {
		const result = await this.getDetailHotel()
		// console.log(result)
		this.currentHotel = result.data[0]
		const typeRooms = await this.getTypeRooms(this.currentHotel)
		// console.log(typeRooms)
		this.type = typeRooms.data
		this.filterRoom(this.currentHotel)
		this.getWeek()

	},

	// computed: {
	// 	...mapGetters('hotel', ['getHotel']),
	// 	hotel() {
	// 		return this.getHotel.id
	// 	}
	// },
	computed: {
		initial_date() {
			return `${this.week[0].year}-${this.week[0].n_month}-${this.week[0].day}`
		},
		final_date() {
			return `${this.week[6].year}-${this.week[6].n_month}-${this.week[6].day}`
		},
		reservas() {
			const array = Object.values(this.records)
			const newArray = []
			// console.log(array)
			array.forEach(el => {
				el.forEach(a => {
					for (
						var d = new Date(a.fecha_ingreso);
						d <= new Date(a.fecha_salida);
						d.setDate(d.getDate() + 1)
					) {
						newArray.push(
							`${a.habitacion}_${this.parseDate(d)}|${a.registro_id}|${
								a.reg_habitacion_id
							}`
						)
					}
				})
			})
			return newArray
		}
	},
	updated() {
		var header = document.getElementById('btn-group')
		var btns = header.getElementsByClassName('btnLg')
		for (var i = 0; i < btns.length; i++) {
			btns[i].addEventListener('click', function() {
				var current = document.getElementsByClassName('active')
				current[0].className = current[0].className.replace(' active', '')
				this.className += ' active'
			})
		}
		// ***********************
		const tbl = document.getElementById('table')
		// console.log(tbl)
		var numRows = tbl.rows.length
		for (var i = 1; i < numRows; i++) {
			// var ID = tbl.rows[i].id
			var cells = tbl.rows[i].getElementsByTagName('td')
			// console.log(cells)
			for (var ic = 0, it = cells.length; ic < it; ic++) {
				cells[ic].style.backgroundColor = 'white'
				cells[ic].dataset.state = 'LIBRE'
				cells[ic].dataset.reg = null
				cells[ic].dataset.reghab = null
				// console.log(this.reservas.length)
				for (var index = 0; index < this.reservas.length; index++) {
					const splitArray = this.reservas[index].split('|')
					if (cells[ic].id === splitArray[0]) {
						cells[ic].style.backgroundColor = '#7b2ded36'
						cells[ic].dataset.state = 'OCUPADO'
						cells[ic].dataset.reg = splitArray[1]
						cells[ic].dataset.reghab = splitArray[2]
					}
				}
			}
		}
	},
	methods: {
		...mapActions('hotel', ['SET_HOTEL']),
		dates(current) {
			var week = new Array()
			// Starting Monday not Sunday
			current = new Date(current)
			current.setDate(current.getDate() - current.getDay() + 1)
			for (var i = 0; i < 7; i++) {
				week.push(new Date(current))
				current.setDate(current.getDate() + 1)
			}
			return week
		},
		convertId(obj) {
			const array = Object.values(obj)
			array.forEach(el => {
				el.forEach(a => {
					for (
						var d = new Date(a.fecha_ingreso);
						d <= new Date(a.fecha_salida);
						d.setDate(d.getDate() + 1)
					) {
						this.reservas.push(`${a.habitacion}_${this.parseDate(d)}`)
					}
				})
			})
		},
		getDates(hotel, initial, final, hab) {
			if (hab.length > 0) {
				const idsRoom = hab.map(el => el.id)
				// console.log(idsRoom)
				const data = { rooms: idsRoom }
				return this.$axios({
					method: 'get',
					url: `https://apirenti.com/v1/api/hotels/${hotel.id}/room-booking?initial_date=${initial}&final_date=${final}`,
					headers: {
						accept: 'application/json',
						'Content-Type': 'application/json'
					},
					params: {
						rooms: idsRoom // [1]
					}
				}).then(result => {
					this.records = result.data
					// console.log(result)
				})
			}
		},
		buttonToday() {
			this.curr = new Date()
			this.week = []
			//-----------------------------------------
			this.w = []
			this.getWeek()
			this.getDates(
				this.currentHotel,
				this.initial_date,
				this.final_date,
				this.hab
			)
			// alert(new Date())
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
		getTypeRooms(hotel) {
			return this.$axios({
				method: 'get',
				url: `https://apirenti.com/v1/api/hotels/${hotel.id}/room-types`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
		},

		filterRoom(hotel) {
			// console.log(hotel, id)
			this.$axios({
				method: 'get',
				url: `https://apirenti.com/v1/api/hotels/${hotel.id}/rooms`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			}).then(result => {
				// console.log(result.data)
				this.habitaciones = result.data
				// this.typeSelected = this.habitaciones[0].id
				this.typeSelected = this.habitaciones[0].tipo_habitacion

				this.filterFn(this.typeSelected)
				// console.log(this.habitaciones)
			})
		},
		filterFn(type) {
			this.hab = this.habitaciones.filter(el => el.tipo_habitacion === type)
			// console.log('asaasgkasgabgkjsajgjsakgjbakgsagjlaslsglsgklsaglkaglkn')
			// console.log(this.initial_date)
			this.getDates(
				this.currentHotel,
				this.initial_date,
				this.final_date,
				this.hab
			)
			// console.log(this.habitaciones)
		},
		toggleBtn() {
			var x = document.getElementById('toggle')
			if (x.innerHTML === 'Semana') {
				x.innerHTML = 'Dia'
				this.selected = 'Semana'
			} else {
				x.innerHTML = 'Semana'
				this.selected = 'Dia'
			}
		},
		parseDate(date) {
			return new Date(date)
				.toISOString()
				.slice(0, 10)
				.split('-')
				.join('-')
		},
		goForm(event) {
			this.$router.replace(
				`/form?hab=${event.currentTarget.dataset.type}&hotel=${this.currentHotel.id}&date=${event.currentTarget.dataset.date}&state=${event.currentTarget.dataset.state}&reg=${event.currentTarget.dataset.reg}&reghab=${event.currentTarget.dataset.reghab}`
			)
		},
		getYear(date) {
			return new Date(date).getFullYear()
		},
		getDate(date) {
			return new Date(date).getDate()
		},
		getDay(date) {
			const day = new Date(date).getDay()
			const a = day === 0 ? 7 : day
			return days[parseInt(a) - 1]
		},

		getMonth(date) {
			return months[parseInt(new Date(date).getMonth())]
		},
		changeData(day) {
			const dayLabel = new Date(day).getDay()
			const arrayDate = day.split('-')
			const date = {
				year: arrayDate[0],
				n_month: arrayDate[1],
				month: months[parseInt(arrayDate[1]) - 1],
				day: arrayDate[2],
				dayLabel: days[parseInt(dayLabel)]
			}
			return date
		},
		getWeek() {
			let week = []
			for (let i = 1; i <= 7; i++) {
				let first =
					new Date(this.curr).getDate() - new Date(this.curr).getDay() + i
				let day = new Date(new Date(this.curr).setUTCDate(first))
					.toISOString()
					.slice(0, 10)
				this.w.push(day)
				this.week.push(this.changeData(day))
			}
		},
		next() {
			this.week = []
			this.w = []
			this.curr.setDate(this.curr.getDate() + 7)
			this.getWeek()

			// const initialDate = `${this.week[0].year}-${this.week[0].n_month}-${this.week[0].day}`
			// const finalDate = `${this.week[6].year}-${this.week[6].n_month}-${this.week[6].day}`
			// console.log(initialDate, finalDate)
			this.getDates(
				this.currentHotel,
				this.initial_date,
				this.final_date,
				this.hab
			)
		},
		previous() {
			this.week = []
			this.w = []
			this.curr.setDate(this.curr.getDate() - 7)
			this.getWeek()

			// const initialDate = `${this.week[0].year}-${this.week[0].n_month}-${this.week[0].day}`
			// const finalDate = `${this.week[6].year}-${this.week[6].n_month}-${this.week[6].day}`
			// console.log(initialDate, finalDate)
			this.getDates(
				this.currentHotel,
				this.initial_date,
				this.final_date,
				this.hab
			)
		},
		//FALTAN CORREGIR ESTOS 2 MÉTODOS
		nextDay() {
			this.curr = new Date(
				this.curr.getFullYear(),
				this.curr.getMonth(),
				this.curr.getDate() + 1
			)

			// const initialDate = `${this.week[0].year}-${this.week[0].n_month}-${this.week[0].day}`
			// // const finalDate = `${this.week[6].year}-${this.week[6].n_month}-${this.week[6].day}`
			// // console.log(initialDate, finalDate)
			this.getDates(
				this.currentHotel,
				this.initial_date,
				this.final_date,
				this.hab
			)
		},
		preDay() {
			this.curr = new Date(
				this.curr.getFullYear(),
				this.curr.getMonth(),
				this.curr.getDate() - 1
			)

			// const initialDate = `${this.week[0].year}-${this.week[0].n_month}-${this.week[0].day}`
			// const finalDate = `${this.week[6].year}-${this.week[6].n_month}-${this.week[6].day}`
			// console.log(initialDate, finalDate)
			this.getDates(
				this.currentHotel,
				this.initial_date,
				this.final_date,
				this.hab
			)
		}
	}
}
</script>

<style lang="stylus" scoped>
@import url('https://fonts.googleapis.com/css?family=Be+Vietnam&display=swap');
*
	font-family: 'Be Vietnam', sans-serif
	.b-table-sticky-header
		max-height: 500px
	.none
		display none
	.app
		padding 0
		height 100%
		position relative
		width 100%
		display flex
		justify-content start
	.btnLg
		background-color white
		color #7b2ded
		border 1px solid #7b2ded

	.btnLg:focus
		background-color #7b2ded
		color white
		border 1px solid #7b2ded
	.btnLg:hover
		background-color #7b2ded
		color white
		border 1px solid #7b2ded
	.active
		background-color #7b2ded !important
		color white
		border 1px solid #7b2ded
	.filters
		width 100%
		justify-content center
		// border 1px solid #f9f9f9
		// background-color #f9f9f9
		padding 1% 0%
		align-items flex-end
		justify-content space-around
		&_div
			width 50%
			label
				font-size 12px
		.button-filter
			font-size 12px
			background-color #7b2ded9e
			margin 0% 2%
		.button-filter:active
			background-color red
			color white
	.selectHab
		width 40%
	table
		font-family arial, sans-serif
		border-collapse collapse
		width 100%
	td, th
		border 1px solid #dddddd
		text-align left

	.btn-prev-next
		font-size 54px
		background-color white
		border none
		color #70707078
	.headerTable
		display flex
		flex-direction column
		align-items center
	.spanDay
		color white
		background-color #7B2DED
		padding 3px 5px
		border-radius 50%
	.btn-circle
		margin-bottom 2%
		width 70px
		height 70px
		padding 10px 16px
		border-radius 35px
		font-size 24px
		line-height 1.33
		position absolute
		bottom 0
	.w50
		width 50%
		// margin-bottom 4%
		margin-right 8%
	.container-table
		width 100%
		margin-top 4%
	.container-table-day
		width 100%
		margin-top 4%
	.tab-th
		width 20%
		text-align center
	.btnToggle
		border-color #E4E4E4
		background-color #F9F9F9
		color #818181
		width 180px
		font-size 12px
		font-weight bold
	.btnToggle:focus
		background-color #F9F9F9
		color black
		border none
	.btnToggle:hover
		background-color black
		color white
	.widthCell
		width 15%
	.mrg-ri
		margin-right 4%
	.mrg-le
		margin-left 4%
	.width_table
		width 100%
		height 100%
@media screen and (min-width: 764px)
	.app
		padding 0% 8%
		justify-content center
</style>