<template lang="pug">
.container
  b-row.mt-3.mx-2
    b-col(v-for='report in arrayReports', sm='12', md='6', lg='4') 
      nuxt-link(to='/reports')
        .btn-custom.my-3.d-flex
          img.small.mr-2(
            src='https://image.flaticon.com/icons/png/512/3094/3094836.png'
          )
          p {{ report.name }}
</template>

<script>
export default {
  data() {
    return {
      arrayReports: [
        { id: 1, name: 'Reporte de Ventas' },
        { id: 2, name: 'Reporte de Clientes' },
        { id: 3, name: 'Reporte de Estadísticas' },
        { id: 4, name: 'Reporte de Registros' },
        { id: 5, name: 'Reporte de Usuarios' },
        { id: 6, name: 'Reporte General' },
      ],
    }
  },
  created() {
      
  },
  mounted() {

  },
  methods: {
    
  }
}
</script>

<style scoped>
.btn-custom {
  text-decoration: none;
  padding: 48px;
  border-radius: 24px;
  font-size: 20px;
  border: 1px solid gray;
  cursor: pointer;
}
.btn-custom:hover {
  background: #7b2ded;
  color: white;
}
img.small {
  width: 75px;
  height: 75px;
}
</style>

