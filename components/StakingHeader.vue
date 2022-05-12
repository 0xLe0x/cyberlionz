<template>
	<header class="w-full px-8 text-gray-700 z-50">
		<div
			class="
				container
				flex flex-col flex-wrap
				items-center
				justify-between
				py-5
				mx-auto
				md:flex-row
				max-w-7xl
			">
			<div class="flex flex-wrap justify-center">
				<span class="mr-5"
					>Global Items Staked:
					<span class="text-xl">{{ this.$wallet.stakeInfo.total }}</span></span
				>
				<span class="mr-5"
					>$HEAT:
					<span class="text-xl">{{ Number(this.$wallet.heatAmount).toFixed(0)}}</span></span
				>

					<span
					>Unclaimed $HEAT:
					<span class="text-xl">{{ Number(this.$wallet.claimableReward).toFixed(0) }}</span></span
				>
			</div>
			<div class="inline-flex items-center ml-5 space-x-6 lg:justify-end">
				<connected-button />
			</div>
		</div>
	</header>
</template>

<script>
export default {}
</script>
