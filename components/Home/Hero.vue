<template>
	<section class="relative w-full min-h-[56vw] overflow-hidden bg-lionz-blue bg-cover" style="background-image: url(hero-bg-baked.jpg);">
		<!--
		<img
			src="@/assets/images/lions-tree-glitched.gif"
			class="absolute bottom-0 right-0 hidden w-96 mb-0 lg:block" />
		-->	

		<img
			src="@/assets/images/hero-lion.gif"
			class="absolute bottom-0 left-0 w-96 mb-0 block" />
		
		<div
			class="
				flex flex-col
				items-center
				justify-center
				px-10
				mx-auto
				max-w-7xl
			">
			<h1 class="relative inline-block w-full sm:w-9/12">
				<img
					src="@/assets/images/lions-logo-transparent.png"
					alt="Cyber Lionz" />
			</h1>


			<h1 class="relative inline-block w-full sm:w-9/12">
				<img
					src="@/assets/images/lionz-presalemint.gif"
					alt="Cyber Lionz" />
			</h1>


		</div>

	</section>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
	components: {
		Header,
	}
}
</script>