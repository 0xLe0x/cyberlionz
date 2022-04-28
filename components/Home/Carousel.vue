<template>
	<section class="relative bg-lionz-light-brown" id="about-section">
		<carousel-3d
			:count="images.length"
			:width="width"
			:height="height"
			:loop="loop"
			:controlsVisible="controlsVisible"
			:autoplay="autoplay"
			border="0"
			class="py-20 !m-0 !h-full">
			<slide v-for="(image, i) in images" :index="i" :key="`carousel-${i}`">
				<img class="w-full h-auto" :src="image" />
			</slide>
		</carousel-3d>
	</section>
</template>

<script>
import { Carousel3d, Slide } from 'vue-carousel-3d'
export default {
	props: {
		controlsVisible: {
			type: Boolean,
			default: true,
		},
		width: {
			type: Number,
			default: 360,
		},
		height: {
			type: Number,
			default: 360,
		},
		loop: {
			type: Boolean,
			default: true,
		},
		autoplay: {
			type: Boolean,
			default: true,
		},
	},
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
