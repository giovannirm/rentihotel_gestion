<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        Renti
      </h1>
      <h2 class="subtitle">
        Proyecto de gestión de hoteles
      </h2>
      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          class="button--green"
        >
          Documentation
        </a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          class="button--grey"
        >
          GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
	// div
	// 	b-card
	// 		b-form()
	// 			div(class="d-flex align-items-end")
	// 				label(class="mr-sm-2") Tipo de habitacion
	// 				b-form-select(class="mb-2 mr-sm-2 mb-sm-0" v-model="selected")
	// 						b-form-select-option(:value="null") Selecciona una opción
	// 						b-form-select-option(:value="1") 401
	// 						b-form-select-option(:value="2") 402
	// 			h3 Informacion del cliente
	// 			hr
	// 			div(class="d-flex")
	// 				div
	// 					label(class="") Fecha de ingreso
	// 					b-form-input(v-model="text" placeholder="Enter your name")
	// 				div
	// 					label(class="") Fecha de salida
	// 					b-form-input(v-model="text" placeholder="Enter your name")
	// 			div(class="d-flex")
	// 				div
	// 					label(class="") Tiempo
	// 					b-form-select(class="mb-2 mr-sm-2 mb-sm-0" v-model="selected")
	// 						b-form-select-option(:value="null") Selecciona una opción
	// 				div
	// 					label(class="") Tarifa
	// 					b-form-input(v-model="text" placeholder="Enter your name")
	// 			div(class="d-flex")
	// 				div
	// 					label(class="") Adultos
	// 					b-form-select(class="mb-2 mr-sm-2 mb-sm-0" v-model="selected")
	// 						b-form-select-option(:value="null") Selecciona una opción
	// 				div
	// 					label(class="") Niños
	// 					b-form-select(class="mb-2 mr-sm-2 mb-sm-0" v-model="selected")
	// 						b-form-select-option(:value="null") Selecciona una opción
	// 			div(class="d-flex")
	// 				div
	// 					label(class="") Tipo de pago
	// 					b-form-select(class="mb-2 mr-sm-2 mb-sm-0" v-model="selected")
	// 						b-form-select-option(:value="null") Selecciona una opción
	// 				div
	// 					label(class="") Adelanto
	// 					b-form-input(v-model="text" placeholder="Enter your name")

export default {
  components: {
    Logo
  },
  created() {
    console.log(this.$store.$auth)
  }
}
</script>

<style scoped>
.container {
  margin: 0 auto;
  min-height: calc(100vh - 8rem);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>