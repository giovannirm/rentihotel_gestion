<template lang="pug">
	//- nav
	//- 	ul
	//- 		li
	//- 			div(class="icons")
	//- 				img.icon(src="../../assets/iconos/logo.png")
	//- 			div(class="linktitle") Renti | Panel
	//- 		li
	//- 			div(class="linktitle")
	//- 			div(class="icons")
	//- 				img.icon(src="../../assets/iconos/bell.png")
	div
		b-navbar(variant="faded" type="light")
			div.left
				b-navbar-brand( href="#")
					img.icon(src="../../assets/iconos/logo.png" style="height: 2rem; weight:2rem" class="d-inline-block align-top" alt="Logo")
				b-navbar-brand.title Renti | Panel
			div.right
				b-navbar-brand {{ $auth.$state.user.email }}
				//- p {{ $store.getters.getUser.email }} $store.state.auth.user.email
				b-navbar-brand( href="#")
					i(class="fa fa-bell")
</template>

<script>
export default {}
</script>

<style lang="stylus" scoped>
// nav
// 	ul
// 		display flex
// 		justify-content space-between
// 		// margin 1% 0%
// 		padding 0% 4%
// 		height 100%
// 		align-items center
// 	li
// 		list-style none
// 		display flex
// 		align-items baseline
// 		// width 20%
// 		justify-content space-between
.navbar
	display flex
	justify-content flex-end
.left
	display none
.icon
	height 50px
.navbar-brand
	font-size 0.9rem
	i
		font-size 1.5rem


@media screen and (min-width: 764px)
	.navbar
		display flex
		justify-content space-between
		border-bottom 1px solid #cacaca91
		box-shadow 10px -1px 10px #cacaca
	.left
		display block
		display flex
		align-items center
	.icon
		height 50px
	.navbar-brand
		font-size 0.9rem
		i
			font-size 1.5rem

</style>
