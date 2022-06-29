<template>
	<div>
		<div
			v-for="(trait, i) in traits"
			:key="i"
			class="h-[10.5%] flex justify-center items-center">
			<span
				class="
					flex
					justify-center
					text-center
					items-center
					text-[5px]
					sm:text-[7px]
					md:text-[9px]
					lg:text-xs
					2xl:text-base
				"
				data-aos="fade-right"
				data-aos-offset="0px">
				<p v-if="toggleState[trait.trait_type]" class="text-[#f59e0b]">
					{{ trait.value }}
				</p>
				<p v-else class="text-gray-300">
					{{ trait.value }}
				</p>
			</span>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		index: {
			type: Number,
		},
		toggleState: {
			type: Object,
		},
	},
	computed: {
		traits() {
			if (this.index === undefined || this.$wallet.nfts.length === 0) return ''
			return this.$wallet.nfts[this.index].attributes
		},
	},
}
</script>
