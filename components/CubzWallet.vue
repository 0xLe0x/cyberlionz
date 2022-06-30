<template>
	<section
		class="
			bg-[url('@/static/hero-bg-baked.jpg')]
			relative
			w-full
			min-h-[53vw]
			pb-[3rem]
			overflow-hidden
			bg-cover
		"
		id="cubzwallet-section">
		<EvolvingHeader />
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
					href="/stake"></a>
				<a
					class="
						bg-[url('@/static/Buttons/btn-evolve.gif')]
						hover:bg-[url('@/static/Buttons/btn-evolve-hover.gif')]
						active:bg-[url('@/static/Buttons/btn-evolve-active.gif')]
						bg-no-repeat bg-contain bg-center
						h-[60%]
						w-[20%]
					"
					href="#"></a>
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
			<div
				class="
					relative
					bg-[url('@/static/Evolving/Lions-UI_Inventory.png')]
					bg-no-repeat
					bg-[length:100%_100%]
					px-[5%]
					py-3
					h-[150px]
					sm:h-[220px]
					mb-3
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
				<div
					class="
						w-full
						top-[40px]
						sm:top-[50px]
						h-[100px]
						sm:h-[150px]
						bg-transparent
						absolute
					"
					@drop="onDrop($event)"
					@dragover.prevent
					@dragenter.prevent></div>
				<div
					class="
						ml-[15%]
						sm:ml-[18%]
						mt-0
						sm:mt-1
						text-gray-300 text-xs
						sm:text-xl
					">
					{{ $wallet.nfts !== undefined ? $wallet.nfts.length : 0 }}
					ITEMS
				</div>
				<div
					v-if="
						$wallet.nfts !== undefined &&
						$wallet.loaded &&
						$wallet.nfts.length == 0 &&
						$wallet.loaded != -1
					"
					class="flex justify-center items-center h-[105px] sm:h-[170px]">
					<p class="text-[#d1d5db] text-center">Inventory is empty</p>
				</div>
				<div
					v-if="$wallet.loaded == -1"
					class="flex justify-center items-center h-[105px] sm:h-[170px]">
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
						v-for="(item, i) in this.$wallet.nfts
							? this.$wallet.nfts.filter(
									(item, index) => item.id != dropId1 && item.id != dropId2
							  )
							: []"
						:key="i"
						class="flex-none pt-3">
						<div class="relative">
							<img
								:src="`${item.image}?${timeStamp}`"
								class="
									w-[90px]
									h-[90px]
									sm:w-[140px] sm:h-[140px]
									hover:cursor-pointer
								"
								data-aos="fade-right"
								@dragstart="startDrag($event, item.id)"
								@click="onTouchItem(item.id)" />
							<div
								class="
									absolute
									bg-[black]
									opacity-80
									left-0
									top-0
									w-[90px]
									h-[90px]
									sm:w-[140px] sm:h-[140px]
									hover:cursor-pointer
								"
								v-if="item.id === itemId"
								@click="onRetouchItem(item.id)" />
						</div>
					</div>
				</div>
			</div>
			<div class="relative">
				<img
					src="/Evolving/Lions-UI_Boxes_New_9x.png"
					class="w-full"
					rel="preload" />
				<breed-slot
					:index="this.dropId1"
					@dropped="onDrop_1"
					@exchange="onExchange"
					@click="onTouchSlot_1"
					ref="slot1"
					class="absolute left-[11%] top-[17.8%] w-[25.6%] h-[36%]"
					:timeStamp="timeStamp"
					:itemid="itemId" />
				<trait-slot
					:index="this.dropId1"
					:toggleState="toggleValue"
					class="absolute left-[13.8%] top-[58.5%] w-[18.5%] h-[38.3%]" />
				<div>
					<div class="absolute left-[43.05%] top-[12.8%] w-[14.3%] h-[20.1%]">
						<loading
							:active="previewImageLoading"
							:width="100"
							:height="100"
							color="#f59e0b"
							background-color="#000000"
							loader="dots"
							:opacity="0.7"
							:is-full-page="false" />
						<img
							:src="`${this.previewImage}?${timeStamp}`"
							data-aos="fade"
							data-aos-offset="0px"
							v-if="this.previewImage != undefined" />
						<img
							:src="`/Evolving/Lions-UI_Opening_Middle_Door-Close.gif?${timeStamp}`"
							class="absolute left-0 top-0"
							:class="doorImage ? { hidden: true } : { hidden: false }" />
						<img
							:src="doorOpen"
							class="absolute left-0 top-0"
							:class="doorImage ? { hidden: false } : { hidden: true }" />
					</div>
					<div
						class="
							absolute
							left-[38.8%]
							top-[35.2%]
							w-[22.8%]
							h-[5.3%]
							flex
							justify-center
						"
						:class="
							curState === 'SELECT_CUBZ' ? { hidden: false } : { hidden: true }
						">
						<img src="/Evolving/Lions-UI_Select_Cubz.gif" />
					</div>
					<button
						class="
							absolute
							left-[38.8%]
							top-[35.2%]
							w-[22.8%]
							h-[5.3%]
							overflow-hidden
						"
						:class="
							curState === 'PREVIEW' ? { hidden: false } : { hidden: true }
						"
						:disabled="dropId1 === undefined || dropId2 === undefined"
						@click="onPreview">
						<img
							class="
								w-[300%]
								max-w-none
								hover:-translate-x-1/3
								active:-translate-x-2/3
							"
							src="/Evolving/Lions-UI_Preview_Button_New_Hover_Active.gif"
							rel="preload" />
					</button>
					<button
						class="
							absolute
							left-[38.6%]
							top-[32.7%]
							w-[23.2%]
							h-[8.1%]
							overflow-hidden
						"
						:class="
							curState === 'EVOLVE' ? { hidden: false } : { hidden: true }
						"
						:disabled="dropId1 === undefined || dropId2 === undefined"
						@click="onEvolve">
						<img
							class="
								w-[300%]
								max-w-none
								hover:-translate-x-1/3
								active:-translate-x-2/3
							"
							src="/Evolving/Lions-UI_Evolve_Button_New_Hover_Active.gif"
							rel="preload" />
					</button>
					<div class="absolute left-[44.4%] top-[59.3%] w-[11.5%] h-[34.9%]">
						<div
							v-for="(val, index) in trait_type"
							:key="`toggle-${val}`"
							class="w-full h-[7.2%] mb-[13.5%]">
							<div class="toggles h-full flex items-center justify-center">
								<trait-toggle
									v-model="toggleValue[val]"
									@input="onTraitToggle"
									:id="`t-${val}`"
									:data-aos="index > 3 ? 'fade-left' : 'fade-right'"
									data-aos-offset="0px"
									:class="isMounted ? { hidden: false } : { hidden: true }" />
							</div>
						</div>
					</div>
				</div>
				<breed-slot
					:index="this.dropId2"
					@dropped="onDrop_2"
					@exchange="onExchange"
					@click="onTouchSlot_2"
					ref="slot2"
					class="absolute left-[63.8%] top-[17.8%] w-[25.6%] h-[36%]"
					:timeStamp="timeStamp"
					:itemid="itemId" />
				<trait-slot
					:index="this.dropId2"
					:toggleState="toggleValueR"
					class="absolute left-[67.6%] top-[58.5%] w-[18.5%] h-[38.3%]" />
			</div>
		</div>
		<loading
			:active="this.$wallet.evolving != ''"
			:width="120"
			:height="120"
			color="#f59e0b"
			background-color="#000000"
			loader="dots"
			:opacity="0.8"
			:is-full-page="true"
			:lock-scroll="true"
			><p class="text-[#d1d5db]">{{ this.$wallet.evolving }}</p></loading
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
import axios from 'axios'
import Vue from 'vue'

export default {
	data() {
		return {
			dropId1: undefined,
			dropId2: undefined,
			trait_type: [
				'Background',
				'Body',
				'Clothing',
				'Shoes',
				'Hands',
				'Mouth',
				'Eyewear',
				'Companion',
			],
			toggleValue: {
				Background: true,
				Body: true,
				Clothing: true,
				Shoes: true,
				Hands: true,
				Mouth: true,
				Eyewear: true,
				Headwear: true,
				Companion: true,
			},
			previewImage: undefined,
			previewImageLoading: false,
			doorImage: false,
			doorOpen: undefined,
			filename: '',
			timeStamp: new Date().getTime(),
			showModal: false,
			curState: 'SELECT_CUBZ',
			isMounted: false,
			itemId: undefined,
		}
	},
	components: {
		Loading,
		PerfectScrollbar,
		VueFinalModal,
	},
	mounted() {
		this.isMounted = true
	},
	computed: {
		toggleValueR() {
			let toggleValR = new Object()
			Object.entries(this.toggleValue).forEach(
				([key, value]) => (toggleValR[key] = !value)
			)
			return toggleValR
		},
	},
	methods: {
		startDrag(evt, index) {
			evt.dataTransfer.dropEffect = 'copy'
			evt.dataTransfer.effectAllowed = 'copyMove'
			evt.dataTransfer.setData('metadata', index)
			evt.dataTransfer.setData('from', 'list')
		},
		onTouchItem(index) {
			this.itemId = index
		},
		onRetouchItem(index) {
			this.itemId = undefined
		},
		onDrop(evt) {
			const id = parseInt(evt.dataTransfer.getData('metadata'))
			const from = evt.dataTransfer.getData('from')
			if (from === 'slot') {
				if (this.dropId1 == id) {
					this.dropId1 = undefined
				} else if (this.dropId2 == id) {
					this.dropId2 = undefined
				}
				this.curState = 'SELECT_CUBZ'
				if (this.doorImage) this.doorImage = false
			}
		},
		onDrop_1(index) {
			if (this.$wallet.nfts[index].attributes[0].trait_type == 'Legendary')
				Vue.notify({
					group: 'foo',
					type: 'error',
					title: '',
					text: 'Legendary Cubz cannot be evolved.',
				})
			else if (!this.$wallet.isEvolved[index]) {
				Vue.notify({
					group: 'foo',
					type: 'error',
					title: '',
					text: 'Cub already used.',
				})
			} else {
				this.dropId1 = index
				if (this.dropId2 !== undefined) {
					this.curState = 'PREVIEW'
					this.doorImage = false
					this.isItemTouched = false
				}
			}
		},
		onDrop_2(index) {
			if (this.$wallet.nfts[index].attributes[0].trait_type == 'Legendary')
				Vue.notify({
					group: 'foo',
					type: 'error',
					title: '',
					text: 'Legendary Cubz cannot be evolved.',
				})
			else {
				this.dropId2 = index
				if (this.dropId1 !== undefined) {
					this.curState = 'PREVIEW'
					this.doorImage = false
					this.isItemTouched = false
				}
			}
		},
		onTouchSlot_1() {
			if (this.itemId !== undefined) {
				this.onDrop_1(this.itemId)
				this.itemId = undefined
			}
		},
		onTouchSlot_2() {
			if (this.itemId !== undefined) {
				this.onDrop_2(this.itemId)
				this.itemId = undefined
			}
		},
		onExchange() {
			;[this.dropId1, this.dropId2] = [this.dropId2, this.dropId1]
			if (this.curState == 'EVOLVE') {
				;[this.curState, this.doorImage] = ['PREVIEW', false]
			}
		},
		onTraitToggle() {
			if (this.curState == 'EVOLVE') {
				;[this.curState, this.doorImage] = ['PREVIEW', false]
			}
		},
		async onPreview() {
			let params = {}
			Object.entries(this.toggleValue).forEach(
				([key, value], index) =>
					(params[key] =
						this.$wallet.nfts[value ? this.dropId1 : this.dropId2].attributes[
							index
						].value)
			)
			params.Headwear = 'None'
			let fn = ''
			Object.entries(params).forEach(([key, value]) => (fn += value))
			this.filename = fn
			try {
				this.previewImageLoading = true
				this.previewImage = undefined
				this.doorOpen =
					require('@/static/Evolving/Lions-UI_Opening_Middle_Door-Open.gif') +
					'?' +
					this.timeStamp
				const res = await axios.get(
					`https://${process.env.hackslipsServer}/api/preview`,
					{
						params,
					}
				)
				this.previewImage = res.data.fileUri
				setTimeout(() => {
					this.doorImage = true
					this.curState = 'EVOLVE'
					this.previewImageLoading = false
					this.timeStamp = new Date().getTime()
				}, 5000)
			} catch (err) {
				console.log(err)
			}
		},
		async onEvolve() {
			if (
				parseInt(this.$wallet.heatAmount) < parseInt(process.env.evolvingHeat)
			) {
				Vue.notify({
					group: 'foo',
					type: 'error',
					title: '',
					text: `Not enough $HEAT(${process.env.evolvingHeat}).`,
				})
			} else {
				let traits = {}
				Object.entries(this.toggleValue).forEach(
					([key, value], index) =>
						(traits[key] =
							this.$wallet.nfts[value ? this.dropId1 : this.dropId2].attributes[
								index
							].value)
				)
				traits.Headwear = 'None'
				const new_id = this.$wallet.nfts[this.dropId1].name.split('#')[1]
				const old_id = this.$wallet.nfts[this.dropId2].name.split('#')[1]

				try {
					this.$wallet.evolving = 'Checking if already evolved...'

					const res = await axios.get(
						`https://${process.env.hackslipsServer}/api/is-evolved`,
						{
							params: {
								DNA: this.filename,
							},
						}
					)

					if (res.data.success) {
						this.$toast.show('This Lion is already minted.', {
							title: 'Mint',
							variant: 'error',
							// you can pass a single action as below
							action: {
								text: 'Close',
								onClick: (e, toastObject) => {
									toastObject.goAway(0)
									this.$wallet.evolving = ''
								},
							},
						})
						return
					}

					const success = await this.$wallet.evolve(
						parseInt(new_id),
						parseInt(old_id)
					)
					if (success) {
						await axios.get(
							`https://${process.env.hackslipsServer}/api/evolve`,
							{
								params: {
									DNA: this.filename,
									traits,
								},
							}
						)
					}

					this.doorImage = false
					;[this.dropId1, this.dropId2, this.previewImage] = [
						undefined,
						undefined,
						undefined,
					]
					this.toggleValue = {
						Background: true,
						Body: true,
						Clothing: true,
						Shoes: true,
						Hands: true,
						Mouth: true,
						Eyewear: true,
						Headwear: true,
						Companion: true,
					}
					this.curState = 'SELECT_CUBZ'
					this.$wallet.evolving = ''
				} catch (err) {
					this.$toast.show(err, {
						title: 'Mint',
						variant: 'error',
						// you can pass a single action as below
						action: {
							text: 'Close',
							onClick: (e, toastObject) => {
								toastObject.goAway(0)
								this.$wallet.evolving = ''
							},
						},
					})
				}
			}
		},
	},
}
</script>