<template>
	<section
		class="
			bg-[url('@/static/hero-bg-baked.jpg')]
			relative
			w-full
			min-h-[53vw]
			pb-[3rem]
			overflow-hidden
			bg-lionz-blue bg-cover
		"
		id="cubzwallet-section">
		<StakingHeader />
		<div class="px-[5%]">
			<div
				class="
					relative
					bg-[url('@/static/Evolving/Lions-UI_Control_Panel_Underlay.png')]
					bg-no-repeat
					bg-[length:100%_100%]
					h-[40px]
					md:h-[100px]
					flex
					justify-around
					items-center
					mb-3
				">
				<a
					class="
						bg-[url('@/static/Buttons/btn-stake.gif')]
						hover:bg-[url('@/static/Buttons/btn-stake-hover.gif')]
						active:bg-[url('@/static/Buttons/btn-stake-active.gif')]
						bg-no-repeat bg-contain bg-center
						h-[60%]
						w-[20%]
					"
					href="#"></a>
				<a
					class="
						bg-[url('@/static/Buttons/btn-evolve.gif')]
						hover:bg-[url('@/static/Buttons/btn-evolve-hover.gif')]
						active:bg-[url('@/static/Buttons/btn-evolve-active.gif')]
						bg-no-repeat bg-contain bg-center
						h-[60%]
						w-[20%]
					"
					href="/evolve"></a>
				<a
					class="
						bg-[url('@/static/Buttons/btn-market.gif')]
						hover:bg-[url('@/static/Buttons/btn-market-hover.gif')]
						active:bg-[url('@/static/Buttons/btn-market-active.gif')]
						bg-no-repeat bg-contain bg-center
						h-[60%]
						w-[20%]
					"
					href="#"
					@click="showModal = true"></a>
			</div>
			<div class="md:grid md:grid-cols-4 md:gap-4">
				<div
					class="
						relative
						bg-[url('@/static/Evolving/Lions-UI_Inventory.png')]
						bg-no-repeat
						bg-[length:100%_100%]
						px-[5%]
						py-3
						h-[160px]
						sm:h-[220px]
						md:col-span-3
					">
					<loading
						:active="this.$wallet.loaded == false"
						:width="120"
						:height="120"
						color="#f59e0b"
						background-color="#000000"
						loader="dots"
						:opacity="0.5"
						:is-full-page="false" />
					<div class="ml-[15%] sm:ml-[18%] mt-0 sm:mt-1 text-gray-300 text-xs sm:text-xl">
						{{
							$wallet.nfts !== undefined
								? $wallet.nfts.length +
								  ($wallet.nftsLionz !== undefined
										? $wallet.nftsLionz.length
										: 0)
								: $wallet.nftsLionz !== undefined
								? $wallet.nftsLionz.length
								: 0
						}}
						ITEMS
					</div>
					<div
						v-if="
							$wallet.nfts !== undefined &&
							$wallet.loaded &&
							$wallet.nfts.length === 0 &&
							$wallet.nftsLionz !== undefined &&
							$wallet.nftsLionz.length === 0 &&
							$wallet.loaded !== -1
						"
						class="flex justify-center items-center h-[110px] sm:h-[170px]">
						<p class="text-[#d1d5db] text-center">Inventory is empty</p>
					</div>
					<div
						v-if="$wallet.loaded == -1"
						class="flex justify-center items-center h-[110px] sm:h-[170px]">
						<p class="text-[#d1d5db] text-center">Please connect your wallet</p>
					</div>
					<div
						class="
							flex
							gap-3
							sm:gap-6
							overflow-x-auto
							hover:scroll-auto
							custom-scrollbar
						">
						<div
							v-for="(item, i) in this.$wallet.nftsLionz"
							:key="`Lion-${i}`"
							class="flex-none pt-3">
							<div class="flex flex-col justify-center gap-y-1">
								<img
									:src="item.image.substring(6)"
									class="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px]"
									data-aos="fade-right" />
								<CheckButton
									@toggle="onStakeLionzCheck(item.id)"
									:value="stakeItems.lionz.includes(item.id)"
									color="#db2777"
									>Select</CheckButton
								>
							</div>
						</div>
						<div
							v-for="(item, i) in this.$wallet.nfts"
							:key="`Cub-${i}`"
							class="flex-none pt-3">
							<div class="flex flex-col justify-center gap-y-1">
								<img
									:src="item.image.substring(6)"
									class="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px]"
									data-aos="fade-right" />
								<CheckButton
									@toggle="onStakeCubzCheck(item.id)"
									:value="stakeItems.cubz.includes(item.id)"
									color="#db2777"
									>Select</CheckButton
								>
							</div>
						</div>
					</div>
				</div>

				<ul
					class="mt-3 sm:mt-0 bg-opacity-30 border-4 rounded border-[#24142c]">
					<li
						class="
							text-[#3dff6e] text-center
							h-[25px]
							bg-[#24142c]
							overflow-hidden
						">
						STAKED ITEMS({{
							$wallet.stakeInfo.userInfo.lionz.length +
							$wallet.stakeInfo.userInfo.cubz.length
						}})
					</li>
					<div
						v-if="
							this.$wallet.loaded == false &&
							!this.$wallet.stakeInfo.userInfo.lionz.length &&
							!this.$wallet.stakeInfo.userInfo.cubz.length
						"
						class="h-[135px] sm:h-[187px] bg-[#061f5f] relative">
						<loading
							:active="
								this.$wallet.loaded != -1 &&
								!this.$wallet.stakeInfo.userInfo.lionz.length &&
								!this.$wallet.stakeInfo.userInfo.cubz.length
							"
							:width="80"
							:height="80"
							color="#f59e0b"
							background-color="#000000"
							loader="dots"
							:opacity="0.5"
							:is-full-page="false" />
					</div>
					<div
						v-else-if="
							!this.$wallet.stakeInfo.userInfo.lionz.length &&
							!this.$wallet.stakeInfo.userInfo.cubz.length
						"
						class="
							h-[135px]
							sm:h-[187px]
							px-2
							bg-[#061f5f]
							flex
							justify-center
							items-center
						">
						<p class="text-[#9ca3af] text-center">No Staked Items</p>
					</div>
					<div
						v-else
						class="
							h-[135px]
							sm:h-[187px]
							overflow-y-auto overflow-x-hidden
							hover:scroll-auto
							custom-scrollbar
							px-2
							bg-[#061f5f]
						">
						<li
							v-for="item in this.$wallet.stakeInfo.userInfo.lionz"
							:key="`li-lion-${item}`"
							class="
								flex flex-wrap
								p-2
								gap-[15%] gap-y-2
								border-b
								last:border-b-0
								border-[#3dff6e] border-opacity-30
								justify-center
							">
							<img
								:src="`https://${s3Bucket}.s3.amazonaws.com/Lionz/gifs/${item}.gif`"
								class="w-[50px] h-[50px] rounded" />
							<div class="flex items-center">
								<CheckButton
									@toggle="onUnstakeLionzCheck(item)"
									:value="unstakeItems.lionz.includes(item)"
									color="#28c074"
									>Select</CheckButton
								>
							</div>
						</li>
						<li
							v-for="item in this.$wallet.stakeInfo.userInfo.cubz"
							:key="`li-cub-${item}`"
							class="
								flex flex-wrap
								p-2
								gap-[15%] gap-y-2
								border-b
								last:border-b-0
								border-[#3dff6e] border-opacity-30
								justify-center
							">
							<img
								:src="`https://${s3Bucket}.s3.amazonaws.com/Cubz/gifs/${item}.gif`"
								class="w-[50px] h-[50px] rounded" />
							<div class="flex items-center">
								<CheckButton
									@toggle="onUnstakeCubzCheck(item)"
									:value="unstakeItems.cubz.includes(item)"
									color="#28c074"
									>Select</CheckButton
								>
							</div>
						</li>
					</div>
				</ul>
			</div>
		</div>

		<div
			class="
				h-[50px]
				sm:h-[100px]
				flex
				justify-center
				items-center
				gap-4
				sm:gap-10
			">
			<button
				class="
					bg-[url('@/static/Buttons/Lions-Blue_Stake_Button.png')]
					hover:bg-[url('@/static/Buttons/Lions-Blue_Stake_Button_Hover.png')]
					active:bg-[url('@/static/Buttons/Lions-Blue_Stake_Button_Active.png')]
					bg-no-repeat bg-contain bg-center
					h-[60%]
					w-[35%]
					sm:w-[20%]
				"
				@click="onStake"
				data-aos="fade-right"
				data-aos-offset="0px"></button>
			<button
				class="
					bg-[url('@/static/Buttons/Lions-Red_Unstake_Button.png')]
					hover:bg-[url('@/static/Buttons/Lions-Red_Unstake_Button_Hover.png')]
					active:bg-[url('@/static/Buttons/Lions-Red_Unstake_Button_Active.png')]
					bg-no-repeat bg-contain bg-center
					h-[60%]
					w-[35%]
					sm:w-[20%]
				"
				@click="onUnstake"
				data-aos="fade-left"
				data-aos-offset="0px"></button>
		</div>
		<loading
			:active="this.$wallet.staking != ''"
			:width="120"
			:height="120"
			color="#f59e0b"
			background-color="#000000"
			loader="dots"
			:opacity="0.8"
			:is-full-page="true"
			:lock-scroll="true"
			><p class="text-[#d1d5db]">{{ this.$wallet.staking }}</p></loading
		>
		<notifications group="foo" />
		<VueFinalModal
			v-model="showModal"
			classes="modal-container"
			content-class="modal-content">
			<div>
				<p class="text-gray-300">Coming Soon</p>
			</div>
		</VueFinalModal>
	</section>
</template>

<style>
::-webkit-scrollbar {
	width: 15px;
}

::-webkit-scrollbar-track {
	background-color: rgba(214, 222, 225, 0.3);
}

::-webkit-scrollbar-thumb {
	background-color: #3dff6e;
	border: 4px solid transparent;
	background-clip: content-box;
	border-radius: 20px;
}

::-webkit-scrollbar-thumb:hover {
	background-color: #28c074;
}
</style>

<style scoped>
::v-deep .modal-container {
	display: flex;
	justify-content: center;
	align-items: center;
}
::v-deep .modal-content {
	position: relative;
	display: flex;
	flex-direction: column;
	margin: 0 1rem;
	padding: 1rem;
	border-color: #2d3748;
	background-color: #1a202c;
}
</style>

<script>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import { VueFinalModal } from 'vue-final-modal'

export default {
	data() {
		return {
			stakeItems: {
				lionz: [],
				cubz: [],
			},
			unstakeItems: {
				lionz: [],
				cubz: [],
			},
			showModal: false,
			s3Bucket: process.env.s3Bucket,
		}
	},
	components: {
		Loading,
		PerfectScrollbar,
		VueFinalModal,
	},
	methods: {
		onStakeLionzCheck(id) {
			const index = this.stakeItems.lionz.indexOf(id)
			if (index != -1) this.stakeItems.lionz.splice(index, 1)
			else this.stakeItems.lionz.push(id)
		},
		onStakeCubzCheck(id) {
			const index = this.stakeItems.cubz.indexOf(id)
			if (index != -1) this.stakeItems.cubz.splice(index, 1)
			else this.stakeItems.cubz.push(id)
		},
		onUnstakeLionzCheck(id) {
			const index = this.unstakeItems.lionz.indexOf(id)
			if (index != -1) this.unstakeItems.lionz.splice(index, 1)
			else this.unstakeItems.lionz.push(id)
		},
		onUnstakeCubzCheck(id) {
			const index = this.unstakeItems.cubz.indexOf(id)
			if (index != -1) this.unstakeItems.cubz.splice(index, 1)
			else this.unstakeItems.cubz.push(id)
		},
		async onStake() {
			await this.$wallet.stake(this.stakeItems)
			this.stakeItems = {
				lionz: [],
				cubz: [],
			}
		},
		async onUnstake() {
			await this.$wallet.unstake(this.unstakeItems)
			this.unstakeItems = {
				lionz: [],
				cubz: [],
			}
		},
	},
}
</script>