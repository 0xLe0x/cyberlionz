<template>
	<div
		class="
			container
			d-flex
			flex-column
			align-items-center
			justify-content-center
		">
		<div v-if="user">
			<b-form-checkbox
				:value="saleStatus === SALE_STATUS.Paused"
				switch
				size="lg"
				class="mb-2"
				@change="call('setSaleStatus', [SALE_STATUS.Paused])"
				:disabled="isBusy">
				<b>Paused</b> {{ isBusy ? 'loading...' : '' }}
			</b-form-checkbox>
			<b-form-checkbox
				v-if="$siteConfig.smartContract.hasWhitelist"
				:value="saleStatus === SALE_STATUS.Presale"
				switch
				size="lg"
				class="mb-2"
				:disabled="isBusy"
				@change="call('setSaleStatus', [SALE_STATUS.Presale])">
				<b>Whitelist Sale</b> {{ isBusy ? 'loading...' : '' }}
			</b-form-checkbox>
			<b-form-checkbox
				:value="saleStatus === SALE_STATUS.Public"
				switch
				size="lg"
				class="mb-2"
				@change="call('setSaleStatus', [SALE_STATUS.Public])"
				:disabled="isBusy">
				<b>Public Sale</b> {{ isBusy ? 'loading...' : '' }}
			</b-form-checkbox>
			<b-form-checkbox

				v-if="$config.hasDelayedReveal"
				v-model="revealStatus"
				:disabled="revealStatus || isBusy"
				switch
				size="lg"
				class="mb-2"
				@change="call('reveal')">
				<b>Revealed</b> {{ isBusy ? 'loading...' : '' }}
			</b-form-checkbox>
			<p>Balance: {{ balance }} ETH</p>
			<b-button
				@click="call('withdraw')"
				variant="outline-dark"
				:disabled="balance === 0"
				>Withdraw</b-button
			>
		</div>
		<div v-else><h3>Admin only area</h3></div>
	</div>
</template>

<script>
import { ethers } from 'ethers'
import { CHAINID_CONFIG_MAP } from '@/utils/metamask'
import { SALE_STATUS } from '@/utils'

const identity = window.netlifyIdentity

export default {
	layout: 'admin',
	name: 'admin',
	data() {
		return {
			SALE_STATUS,
			user: identity.currentUser(),
			alreadyCalled: false,
			isBusy: false,
			saleStatus,
			balance: 0
		}
	},
	async mounted() {
		identity.on('login', (user) => {
			this.user = user
			if (!this.alreadyCalled) {
				this.alreadyCalled = true
				this.init()
			}
		})
		identity.on('logout', () => {
			this.user = null
		})
		if (this.user) {
			this.init()
		}
	},
	methods: {
		async init() {
			if (!this.$wallet.provider) return
			if (!this.$wallet.account) {
				await this.$wallet.connect()
			}

			await this.loadState()
		},
		async call(name, args) {
			try {
				if (
					!confirm(
						`Are you sure you want to call smart contract's '${name.toUpperCase()}' function ?`
					)
				) {
					return
				}

				this.isBusy = true



				const signedContract = this.$wallet.getContract()

				// const gasPrice = await signer.getGasPrice()
				// console.log('gasPrice', ethers.utils.formatUnits(gasPrice))

				const txResponse = await signedContract[name].apply(null, args)

				console.log({ txResponse })

				txResponse.wait().then(async (res) => {
					console.log({ res })
					await this.loadState()
					this.onSuccess('State reloaded')
				})
			} catch (err) {
				this.onError(err)
			} finally {
				this.isBusy = false
			}
		},
		async loadState() {

			const contract = this.$wallet.getContract()
			this.saleStatus = await contract.saleStatus()
			this.balance = +ethers.utils.formatUnits(
				await this.$wallet.provider.getBalance(contract.address)
			)
		},
		onError(err) {
			console.error({ err })
			this.$toast.error(err?.data?.message || err.message || 'Request failed', {
				title: 'Error',
				variant: 'danger',
			})
		},
		onSuccess(msg) {
			this.$toast.show(msg || 'Request successful', {
				title: 'Success',
				variant: 'success',
			})
		},
	},
}
</script>

<style scoped lang="scss">
.container {
	min-height: calc(100vh - 178px);
}
</style>
