<template>
	<section class="relative bg-lionz-light-brown" id="about-section">
		<carousel-3d
			:count="images.length"
			class="py-5"
			style="margin: 0 !important; height: 100%">
			<slide v-for="(image, i) in images" :index="i">
				<img :src="image" />
			</slide>
		</carousel-3d>
	</section>
</template>

<script>
import { Carousel3d, Slide } from 'vue-carousel-3d'
export default {
	components: {
		Carousel3d,
		Slide,
	},
	computed: {
		images() {
			const path = require.context('@/assets/images/carousel', false, /\.gif$/)
			return path.keys().map(path)
		},
	},
}
</script>
