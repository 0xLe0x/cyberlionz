<template>
	<header class="w-full px-[5%] text-gray-700 z-50">
		<div
			class="
				container
				flex flex-col flex-wrap
				items-center
				justify-between
				py-5
				gap-y-3
				lg:flex-row
				max-w-7xl
				text-sm
				sm:text-base
			">
			<div class="flex flex-wrap gap-x-5 justify-center">
				<span class="text-[11px] leading-[14px] sm:text-base"
					>Global Items Staked:
					<span class="text-base sm:text-xl">{{
						this.$wallet.stakeInfo.total
					}}</span></span
				>
				<span
					>$HEAT:
					<span class="text-base sm:text-xl">{{
						parseInt(this.$wallet.heatAmount)
					}}</span></span
				>
				<span
					>Unclaimed $HEAT:
					<span class="text-base sm:text-xl">{{
						parseInt(this.$wallet.claimableReward)
					}}</span></span
				>
			</div>
			<div
				class="
					inline-flex
					items-center
					space-x-6
					justify-center
					lg:justify-end
				">
				<connected-button />
			</div>
		</div>
	</header>
</template>

<script>
export default {}
</script>
