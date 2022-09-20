<template lang="pug">
.container
  b-container
    h3.my-4 Reporte de Ventas
    b-card
      b-card-text
        .d-flex.mb-4
          label.mr-4.text-secondary Desde
          b-form-datepicker(
            size='sm',
            local='es',
            :date-format-options='{ year: "numeric", month: "numeric", day: "numeric" }',
            placeholder='Fecha'
          )
        .d-flex
          label.mr-4.text-secondary Hasta
          b-form-datepicker(
            size='sm',
            local='es',
            :date-format-options='{ year: "numeric", month: "numeric", day: "numeric" }',
            placeholder='Fecha'
          )
        p.my-2.text-danger *Solo se visualizarán los últimos 50 movimientos. Si deseas ver todas, descarga el reporte.
        hr.my-2
        b-button(
          :class='visible ? null : "collapsed"',
          :aria-expanded='visible ? "true" : "false"',
          aria-controls='collapse-4',
          @click='visible = !visible'
        ) Búsqueda Avanzada {{visible ? '⇩' : '»'}}
        b-collapse#collapse-4.mt-2(v-model='visible')
          b-card Información
        .d-flex.mt-2
          b-button.mr-4(variant='outline-primary') Buscar
          b-button.mr-4(@click="exportExcel()", variant='success') Descargar excel
          b-button(@click="exportPdf()", variant='danger') Descargar pdf

    div#divToPrint.none
      b-table(:items="reservations_pdf")
        template(#cell(fecha_ingreso)="data") {{ formatDate(data.value)}}
        template(#cell(fecha_salida)="data") {{ formatDate(data.value)}}
    
    b-table(id="my-table", :items="reservations_general", :fields="fields", :per-page="perPage", :current-page="currentPage", small)
      template(#cell(fecha_ingreso)="data") {{ formatDate(data.value)}}
      template(#cell(fecha_salida)="data") {{ formatDate(data.value)}}
    b-pagination(v-model="currentPage", :total-rows="rows", :per-page="perPage", aria-controls="my-table") 
</template>

<script>
import XLSX from 'xlsx'
// import jsPDF from 'jspdf'
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';

export default {
  data() {
    return {
      fields: ['id', 'codigo_reserva', 'fecha_ingreso', 'fecha_salida', 'cantidad_habitacion', 'estado_reserva', 'numero_documento'],
      visible: false,
      perPage: 6,
      currentPage: 1,
      currentHotel: {},
      reservations_general: [],
      reservations_pdf: [],
      reservations_excel: [],
      rows: {}
    }
  },
  // computed: {
  //   rows() {
  //     return this.items.length
  //   }
  // },
  async created() {
    const hotel = await this.getDetailHotel()
		this.currentHotel = hotel.data[0]
    const result_general = await this.getReservations()
    this.reservations_general = result_general.data
    
    const result_pdf = await this.getReservations()
    this.reservations_pdf = result_pdf.data

    const result_excel = await this.getReservations()
    this.reservations_excel = result_excel.data

		this.rows = this.reservations_general.length

    const append_data = {
      cantidad_habitacion: 9999,
      codigo_reserva: "TOTAL",
      estado_reserva: "TOTAL",
      fecha_ingreso: "TOTAL",
      fecha_salida: "TOTAL",
      id: 9999,
      numero_documento: "TOTAL"
    }

    this.reservations_excel.push(append_data)
  },
  methods: {
    formatDate(date) {
      var values = date.split("-")
      return values[2] + "-" + values[1] + "-" + values[0]
    },
    getDetailHotel() {
			return this.$axios({
				method: 'get',
				url: `users/${this.$store.$auth.user.id}/hotels`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
		},
    getReservations() {
			return this.$axios({
				method: 'get',
				url: `hotels/${this.currentHotel.id}/reservations`,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
		},
    exportExcel() {
      // const data = XLSX.utils.json_to_sheet(this.reservations, {origin: "B2"})
            
      const data = XLSX.utils.json_to_sheet(this.reservations_excel)
      const workbook = XLSX.utils.book_new()
      const filename = "reservations"
      XLSX.utils.book_append_sheet(workbook, data, filename)

      var first_sheet_name = workbook.SheetNames[0]
      // var address_of_cell = XLSX.utils.encode_cell({c:1, r:4});
      /* Get worksheet */
      var worksheet = workbook.Sheets[first_sheet_name]

      // worksheet["!cols"]={left:1.0, right:1.0, top:1.0, bottom:1.0, header:0.5,footer:0.5}

      /* Find desired cell */
      // var desired_cell = worksheet[address_of_cell];
      /* Get the value */
      // var desired_value = (desired_cell ? desired_cell.v : undefined);
      // console.log(desired_value);
            
      // var total = 0
      var range = {s: {c:2, r:1}, e: {c:3, r:this.reservations_excel.length-1}}
      for(var R = range.s.r; R <= range.e.r; ++R) {
        for(var C = range.s.c; C <= range.e.c; ++C) {
          var cell_address = {c:C, r:R}
          /* if an A1-style address is needed, encode the address */
          var cell_ref = XLSX.utils.encode_cell(cell_address)
          
          var desired_cell = worksheet[cell_ref]
          var desired_value = (desired_cell ? desired_cell.v : undefined)

          console.log(this.formatDate(desired_value))
          worksheet[cell_ref] = { t:'n', v:this.formatDate(desired_value) }
          
          // total = total + desired_value
          // console.log(this.formatDate((worksheet[cell_ref]).v))
        }
      }

      // worksheet[XLSX.utils.encode_cell({c:0, r:this.reservations_excel.length})] = { t:'n', f:'SUM(A2:A'+this.reservations_excel.length+')' }
      XLSX.writeFile(workbook, `${filename}.xlsx`)
    },
    exportPdf (){
      const pdfTable = document.getElementById('divToPrint');
      var html = htmlToPdfmake(pdfTable.innerHTML);    
      const documentDefinition = { content: html };
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      pdfMake.createPdf(documentDefinition).open();
    }
  }
}
</script>

<style lang="stylus" scoped>
.none
	display none
</style>