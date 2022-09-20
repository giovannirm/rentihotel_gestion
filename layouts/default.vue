<template>
	<div class="app-container">
		<!-- <Header /> -->
		<SideNav class="side" />
		<div class="column">
			<!-- <Header class="head" /> -->
			<br><br>
			<div class="app-content">
				<nuxt />
			</div>
		</div>
		<!-- <Footer /> -->
	</div>
</template>

<script>
import SideNav from '~/components/layouts/Nav.vue'
import Header from '~/components/layouts/Header.vue'
// import Footer from '~/components/layouts/Footer.vue'

export default {
	components: {
		SideNav,
		Header
		// Footer
	}
}
</script>
<style>
.app-container {
	/* display: grid;
	grid-template-columns: 20% 80%;
	grid-template-rows: 10vh 90vh; */
	display: flex;
}
.column{
	flex-direction: column;
	width: 75%;
}
.side{
	/* grid-column: 1/2;
	grid-row: 1/2; */
	width: 25%;
	height: 12vh;
}
.app-content{
	/* grid-row: 2/3;
	grid-column: 2/3; */
	width: 100%;
	height: 88vh;
}
.head{
	grid-row: 1/2;
	grid-column: 2/3;
}


/* @media screen and (min-width: 764px) {
	.app-container {
		height: 100%;
		position: relative;
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		grid-template-rows: 11% 89%;
	}
	.side {
		grid-column: 1/3;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		grid-row: 1/8;
	}
	.head {
		grid-column: 3/11;
		grid-row: 1/2;
		border-bottom: 1px solid #f1f0f0;
		-webkit-box-shadow: 0 4px 6px -6px #222;
		-moz-box-shadow: 0 4px 6px -6px #222;
		box-shadow: 0 4px 6px -6px #222;
	}
	.app-content {
		display: grid;
		align-items: center;
		justify-items: center;
		grid-column: 3/11;
	}
} */


</style>
