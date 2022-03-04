<template>
	<section class="relative w-full pb-80 overflow-hidden bg-lionz-blue bg-cover" style="background-image: url(hero-bg-baked.jpg);">
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
				py-40
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


			<!-- /////MINT Sunday, March 6th, 11 AM EST
			<div
				class="
					flex
					items-center
					justify-around
					mb-5
					w-1/2
					sm:w-5/12 sm:max-w-sm
				">
				<button
					@click="changeMintQuantity('dec')"
					class="
						flex
						items-center
						justify-center
						px-4
						py-2
						text-4xl
						font-medium
						text-center text-white
						bg-lionz-light-brown
						rounded-lg
						focus:outline-none
						focus:ring-2
						focus:ring-offset-2
						focus:ring-gray-900
					">
					-
				</button>
				<span class="text-4xl">{{ mintQuantity }}</span>
				<button
					@click="changeMintQuantity('inc')"
					class="
						flex
						items-center
						justify-center
						px-4
						py-2
						text-4xl
						font-medium
						text-center text-white
						bg-lionz-light-brown
						rounded-lg
						focus:outline-none
						focus:ring-2
						focus:ring-offset-2
						focus:ring-gray-900
					">
					+
				</button>
			</div>
			<button class="w-1/2 sm:w-5/12 sm:max-w-sm px-2 py-2" @click="mint">
				<img src="@/assets/images/lions-mint-now-button.gif" alt="Mint Now" />
			</button>
		-->

		</div>

		<!--
		<svg
			class="absolute bottom-0 w-full -mt-10 text-white fill-current"
			viewBox="0 0 960 93"
			xmlns="http://www.w3.org/2000/svg">
			<path
				d="m0 0 5.2 11.2C10.3 22.3 20.7 44.7 31 43.5c10.3-1.2 20.7-25.8 31-20.7C72.3 28 82.7 63 93 78.5s20.7 11.5 31 5.3c10.3-6.1 20.7-14.5 31-25.5s20.7-24.6 31-21.3c10.3 3.3 20.7 23.7 31 21.2s20.7-27.9 31-36.2c10.3-8.3 20.7.3 31 15.7C289.3 53 299.7 75 310 75s20.7-22 31-39.2c10.3-17.1 20.7-29.5 31-18.8s20.7 44.3 31 55.5c10.3 11.2 20.7-.2 31-.8 10.3-.7 20.7 9.3 30.8 6 10.2-3.4 20.2-20 30.4-28.7 10.1-8.7 20.5-9.3 30.8-10.8s20.7-3.9 31 .8 20.7 16.3 31 26.3 20.7 18.4 31 7.4c10.3-11 20.7-41.4 31-44 10.3-2.7 20.7 22.3 31 26.5 10.3 4.1 20.7-12.5 31-20.9 10.3-8.3 20.7-8.3 31-1.3 10.3 7 20.7 21 31 31.5S794.7 82 805 72s20.7-37 31-35.3c10.3 1.6 20.7 32 31 35.3 10.3 3.3 20.7-20.3 31-22 10.3-1.7 20.7 18.7 31 14.2s20.7-33.9 25.8-48.5L960 1v92H0V0Z"
				fill="#ffb84a"
				fill-rule="nonzero"></path>
		</svg>
		-->
	</section>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
	components: {
		Header,
	},
	data() {
		return {
			mintQuantity: 0,
		}
	},
	methods: {
		changeMintQuantity(type) {
			type === 'inc' ? (this.mintQuantity += 1) : (this.mintQuantity -= 1)
			this.mintQuantity = Math.max(0, this.mintQuantity)
			this.mintQuantity = Math.min(20, this.mintQuantity)
		},
		mint() {
			alert(`minting ${this.mintQuantity}`)
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
