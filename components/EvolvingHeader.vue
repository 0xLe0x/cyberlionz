<template>
	<header class="w-full px-[5%] text-gray-700 z-50">
		<div
			class="
				container
				flex flex-col flex-wrap
				items-center
				justify-between
				py-5
				mx-auto
				gap-y-3
				lg:flex-row
				max-w-7xl
				text-sm
				sm:text-base
			">
			<div class="flex flex-wrap justify-center">
				<span class="mr-5"
					>$HEAT:
					<span class="text-base sm:text-xl">{{ parseInt(this.$wallet.heatAmount) }}</span></span
				>
				<span
					>Unclaimed $HEAT:
					<span class="text-base sm:text-xl">{{
						parseInt(this.$wallet.claimableReward)
					}}</span></span
				>
			</div>
			<div class="inline-flex items-center space-x-6 justify-center lg:justify-end">
				<connected-button />
			</div>
		</div>
	</header>
</template>

<script>
export default {}
</script>
