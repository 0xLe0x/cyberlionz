<template>
	<a href="#_" class="inline-flex items-center justify-center px-6 py-3 text-lg font-medium leading-tight text-blue-500 whitespace-no-wrap border border-blue-300 shadow-sm bg-blue-50 focus:ring-offset-blue-600 hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-100"
	:disabled="!!$wallet.account"
					@click="onWalletConnect">
		<strong>{{ $wallet.accountCompact }}</strong>
	</a>
</template>

<script>
export default {
	methods: {
		async onWalletConnect() {
			try {
				if(this.$wallet.account) return 
				await this.$wallet.connect()
			} catch (err) {
				console.error({err})
				this.$toast.error(err.message || 'Wallet connection failed', {
					title: 'Wallet',
					variant: 'danger',
					action : {
						text : 'Close',
						onClick : (e, toastObject) => {
							toastObject.goAway(0);
						}
					},
				})
			}
		}
	}
}
</script>
