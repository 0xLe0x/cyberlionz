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
			<div>
				<span class="mr-5"
					>Total Items Staked: {{ this.$wallet.stakeInfo.total }}</span
				>
				<span>Heat Amount: {{ this.$wallet.heatAmount }}</span>
			</div>
			<div class="inline-flex items-center ml-5 space-x-6 lg:justify-end">
				<connected-button />
				<!-- <span class="text-xl">
					{{ displayTime }}
				</span> -->
			</div>
		</div>
	</header>
</template>

<script>
export default {}
</script>
