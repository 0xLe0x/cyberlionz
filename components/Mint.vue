<template>
<div class="mt-12">
	<pill-button @click.native="handleMint()"> Mint </pill-button>
</div>
</template>

<script>

import { ethers } from 'ethers';
import { generateProof } from '@/utils/merkle-proof.js';
import whitelist from '@/assets/json/whitelist.json';

export default {
	props: {
		quantity: Number,
		isPresale: false
	},
	data() {
		return {
			amount: 0.077,
			quantity: 4,
			mintedCount: 0,
			isBusy: false,
		}
	},
	async mounted() {
		try {
			if (!this.$wallet.provider) return

			if (this.$wallet.chainId !== chainId) {
				await this.$wallet.switchNetwork(chainId)
			}

			const nftContract = await  this.$wallet.getContract()
			this.mintedCount = +(await nftContract.totalSupply())
		} catch (err) {
			console.error({ err })
		}
	},
	methods: {
		async handleConnect() {
			try {
				this.isBusy = true
				await this.$wallet.connect()
			} catch (error) {
				this.$toast.error(error?.message || 'Connection failed', {
					title: 'Wallet',
					variant: 'danger',
				})
			} finally {
				this.isBusy = false
			}
		},
		async handleMint() {
			const MINT_PRICE = 0.077;
			const { chainId, address, abi } = this.$siteConfig.smartContract
			this.isBusy = true

			try {

			

				if (!this.$wallet.account) {
					await this.$wallet.connect()
				}

	
				const signedContract = await  this.$wallet.getContract()
				const saleStatus = await signedContract.saleStatus()
				console.log('sale status', saleStatus)
				const SaleStatus = { PAUSED: 0, PRESALE: 1, PUBLIC: 2}
				if(saleStatus == SaleStatus.PAUSED){

					this.$toast.show('Minting is paused or has not started yet.', {
						title: 'Mint',
						variant: 'error',
						// you can pass a single action as below
						action : {
							text : 'Close',
							onClick : (e, toastObject) => {
								toastObject.goAway(0);
							}
						},
					})
					return
				}

				let txResponse 
				if(saleStatus == SaleStatus.PRESALE){
					const value = ethers.utils.parseEther(MINT_PRICE.toString())
			
					const proof = await generateProof(this.$wallet.account, whitelist);

					txResponse = await signedContract.presaleMint(proof, {
						value,
					})
				} else {
					const value = ethers.utils.parseEther((MINT_PRICE * this.quantity).toString())

					txResponse = await signedContract.mint(this.quantity, {
						value,
					})
				}

				this.$toast.show('Minted successfully! Wait for transaction to clear.', {
					title: 'Mint',
					variant: 'success',
					// you can pass a single action as below
					action : {
						text : 'Close',
						onClick : (e, toastObject) => {
							toastObject.goAway(0);
						}
					},

				})

				txResponse.wait().then((res) => {
					console.log({ res })
					this.$toast.show(
						'Mint transaction confirmed. NFT should be in your wallet now!',
						{
							title: 'Mint',
							variant: 'success',
							action : {
								text : 'Close',
								onClick : (e, toastObject) => {
									toastObject.goAway(0);
								}
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
						action : {
							text : 'Close',
							onClick : (e, toastObject) => {
								toastObject.goAway(0);
							}
						},
					}
				)
			} finally {
				this.isBusy = false
			}
		},
	},
}
</script>
