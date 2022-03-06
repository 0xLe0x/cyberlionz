<template>
	<section
		class="relative w-full min-h-[53vw] pt-[6rem] pb-[3rem] overflow-hidden bg-lionz-blue bg-cover"
		style="background-image: url(hero-bg-baked.jpg)">
		<img
			src="@/assets/images/hero-lion.gif"
			class="absolute bottom-0 left-0 hidden md:w-[25vw] max-w-xl mb-0 md:block" />

		<div
			class="
				flex flex-col
				items-center
				justify-center
				px-10
				mx-auto
				max-w-7xl
				lg:absolute
				lg:top-[20vw]
				lg:left-[50%]
				lg:transform
				lg:translate-y-[-50%]
				lg:translate-x-[-50%]
			">
			<div class="relative w-full sm:w-9/12">
				<img src="@/assets/images/lions-logo-transparent.png" alt="Cyber Lionz" />
			</div>

			<div v-if="!soldOut" class="max-w-xl">
				<div v-if="saleStatus == 0" class="relative sm:w-full">
					<img class="w-[350px] md:w-full" src="@/assets/images/lionz-presalemint.gif" alt="Cyber Lionz" />
				</div>

				<!-- /////MINT Sunday, March 6th, 11 AM EST -->
				<div
					v-if="saleStatus == 2"
					class="flex items-center justify-around mb-5 w-full">
					<button
						@click="changeMintQuantity('dec')"
						class="
							flex
							items-center
							justify-center
							text-4xl
							font-medium
							text-center text-white
							rounded-lg
							focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900
						">
						<img src="@/assets/images/minus-normal.png" alt="Decrease" />
					</button>
					<span class="text-4xl text-lionz-accent">{{ mintQuantity }}</span>
					<button
						@click="changeMintQuantity('inc')"
						class="
							flex
							items-center
							justify-center
							text-4xl
							font-medium
							text-center text-white
							rounded-lg
							focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900
						">
						<img src="@/assets/images/plus-normal.png" alt="Increase" />
					</button>
				</div>
				<button
					v-if="saleStatus != 0"
					class="w-1/2 sm:w-full sm:max-w-sm px-2 py-2 mx-auto block"
					@click="handleMint">
					<img src="@/assets/images/lions-mint-now-button.gif" alt="Mint Now" />
				</button>
			</div>
		</div>
		<div v-if="soldOut" class="mx-auto max-w-md text-center">
			Sold out. Buy a cub on
			<a
				class="underline decoration-2"
				href="https://opensea.io/collection/cyberlionz"
				>OpenSea.</a
			>
		</div>
	</section>
</template>

<script>
import { ethers } from 'ethers'
import { generateProof } from '@/utils/merkle-proof.js'
import whitelist from '@/assets/json/whitelist.json'
export default {
	async mounted() {
		const { chainId, address, abi } = this.$siteConfig.smartContract
		this.isBusy = true

		try {
			if (this.$wallet.chainId !== chainId) {
				await this.$wallet.switchNetwork(chainId)
			}

			if (!this.$wallet.account) {
				await this.$wallet.connect()
			}

			const signedContract = new ethers.Contract(
				address,
				abi,
				this.$wallet.provider.getSigner()
			)
			this.saleStatus = await signedContract.saleStatus()
			this.totalSupply = await signedContract.totalSupply()
			this.soldOut = this.totalSupply > 499
		} catch (e) {
			console.log(e)
		}
	},
	data() {
		return {
			mintQuantity: 1,
			saleStatus: 0,
			isBusy: false,
			soldOut: false,
			totalSupply: 0,
		}
	},
	methods: {
		changeMintQuantity(type) {
			type === 'inc' ? (this.mintQuantity += 1) : (this.mintQuantity -= 1)
			this.mintQuantity = Math.max(0, this.mintQuantity)
			this.mintQuantity = Math.min(6, this.mintQuantity)
		},
		async handleMint() {
			const MINT_PRICE = 0.0771
			const { chainId, address, abi } = this.$siteConfig.smartContract
			this.isBusy = true

			try {
				if (this.$wallet.chainId !== chainId) {
					await this.$wallet.switchNetwork(chainId)
				}

				if (!this.$wallet.account) {
					await this.$wallet.connect()
				}

				const signedContract = new ethers.Contract(
					address,
					abi,
					this.$wallet.provider.getSigner()
				)

				this.saleStatus = await signedContract.saleStatus()

				const SaleStatus = { PAUSED: 0, PRESALE: 1, PUBLIC: 2 }

				if (this.saleStatus == SaleStatus.PAUSED) {
					this.$toast.show('Minting is paused or has not started yet.', {
						title: 'Mint',
						variant: 'error',
						// you can pass a single action as below
						action: {
							text: 'Close',
							onClick: (e, toastObject) => {
								toastObject.goAway(0)
							},
						},
					})
					return
				}

				let txResponse
				if (this.saleStatus == SaleStatus.PRESALE) {
					const value = ethers.utils.parseEther(MINT_PRICE.toString())

					const proof = await generateProof(this.$wallet.account, whitelist)

					txResponse = await signedContract.presaleMint(proof, {
						value,
					})
				} else {
					const value = ethers.utils.parseEther(
						(MINT_PRICE * this.mintQuantity).toString()
					)

					txResponse = await signedContract.mint(this.mintQuantity, {
						value,
					})
				}

				this.$toast.show('Minted successfully! Wait for transaction to clear.', {
					title: 'Mint',
					variant: 'success',
					// you can pass a single action as below
					action: {
						text: 'Close',
						onClick: (e, toastObject) => {
							toastObject.goAway(0)
						},
					},
				})

				txResponse.wait().then((res) => {
					console.log({ res })
					this.$toast.show(
						'Mint transaction confirmed. NFT should be in your wallet now!',
						{
							title: 'Mint',
							variant: 'success',
							action: {
								text: 'Close',
								onClick: (e, toastObject) => {
									toastObject.goAway(0)
								},
							},
						}
					)
				})
			} catch (err) {
				console.error({ err })
				const { data, reason, message, code, method, error } = err
				this.$toast.show(
					error?.message || data?.message || reason || message || 'Minting failed',
					{
						title: 'Mint',
						variant: 'danger',
						action: {
							text: 'Close',
							onClick: (e, toastObject) => {
								toastObject.goAway(0)
							},
						},
					}
				)
			} finally {
				this.isBusy = false
			}
		},
		async onWalletConnect() {
			try {
				await this.$wallet.connect()
			} catch (err) {
				console.error({ err })
				this.$toast.error(err.message || 'Wallet connection failed', {
					title: 'Wallet',
					variant: 'danger',
					action: {
						text: 'Close',
						onClick: (e, toastObject) => {
							toastObject.goAway(0)
						},
					},
				})
			}
		},
	},
}
</script>
