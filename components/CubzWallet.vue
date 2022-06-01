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
					h-[100px]
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
					px-12
					py-3
					h-[220px]
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
					class="w-full h-[190px] bg-transparent absolute"
					@drop="onDrop($event)"
					@dragover.prevent
					@dragenter.prevent></div>
				<div class="ml-[18%] mt-1 text-gray-300">
					<span class="text-xl">{{
						$wallet.nfts !== undefined && $wallet.nfts.length
					}}</span>
					ITEMS
				</div>
				<div
					v-if="
						$wallet.nfts !== undefined &&
						$wallet.loaded &&
						$wallet.nfts.length == 0 &&
						$wallet.loaded != -1
					"
					class="flex justify-center items-center h-[170px]">
					<p class="text-[#d1d5db]">Inventory is empty</p>
				</div>
				<div
					v-if="$wallet.loaded == -1"
					class="flex justify-center items-center h-[170px]">
					<p class="text-[#d1d5db]">Please connect your wallet</p>
				</div>
				<div class="flex gap-6 overflow-x-auto hover:scroll-auto custom-scrollbar">
					<div
						v-for="(item, i) in this.$wallet.nfts
							? this.$wallet.nfts.filter(
									(item, index) => item.id != dropId1 && item.id != dropId2
							  )
							: []"
						:key="i"
						class="flex-none pt-3">
						<img
							:src="`${item.image}?${curTime}`"
							class="w-[140px] h-[140px] hover:cursor-pointer"
							data-aos="fade-right"
							@dragstart="startDrag($event, item.id)" />
					</div>
				</div>
			</div>
			<div class="relative">
				<img src="/Evolving/Lions-UI_Mock-Up_NoToggle.png" class="w-full" />
				<breed-slot
					:index="this.dropId1"
					@dropped="onDrop_1"
					@exchange="onExchange"
					ref="slot1"
					class="absolute left-[11%] top-[17.8%] w-[25.6%] h-[36%]"
					:curTime="curTime" />
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
							:src="`${this.previewImage}?${curTime}`"
							data-aos="fade"
							v-if="this.previewImage != undefined" />
					</div>
					<button
						class="
							absolute
							left-[43.8%]
							top-[34.7%]
							w-[12.8%]
							h-[6.1%]
							bg-transparent
						"
						:disabled="dropId1 === undefined || dropId2 === undefined"
						@click="onPreview"></button>
					<button
						class="
							absolute
							left-[43.8%]
							top-[42%]
							w-[12.8%]
							h-[10%]
							bg-[url('@/static/Evolving/Lions-UI_Evolve_Glowing.gif')]
							hover:bg-[url('@/static/Evolving/Lions-UI_Evolve_Hover_Glowing.gif')]
							active:bg-[url('@/static/Evolving/Lions-UI_Evolve_Active_Glowing.gif')]
							bg-no-repeat bg-contain bg-center
						"
						@click="onEvolve"></button>
					<div class="absolute left-[44.4%] top-[59.3%] w-[11.5%] h-[34.9%]">
						<div
							v-for="(val, index) in trait_type"
							:key="`toggle-${val}`"
							class="w-full h-[7.2%] mb-[13.5%]">
							<div class="toggles h-full flex items-center justify-center">
								<trait-toggle
									v-model="toggleValue[val]"
									:id="`t-${val}`"
									:data-aos="index > 3 ? 'fade-left' : 'fade-right'"
									data-aos-offset="0px" />
							</div>
						</div>
					</div>
				</div>
				<breed-slot
					:index="this.dropId2"
					@dropped="onDrop_2"
					@exchange="onExchange"
					ref="slot2"
					class="absolute left-[63.8%] top-[17.8%] w-[25.6%] h-[36%]"
					:curTime="curTime" />
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
	background-color: rgba(214, 222, 225, 0.5);
}

::-webkit-scrollbar-thumb {
	background-color: #d6dee1;
	border: 4px solid transparent;
	background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
	background-color: #a8bbbf;
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
			filename: '',
			curTime: new Date().getTime(),
			showModal: false,
		}
	},
	components: {
		Loading,
		PerfectScrollbar,
		VueFinalModal,
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
		onDrop(evt) {
			const id = parseInt(evt.dataTransfer.getData('metadata'))
			const from = evt.dataTransfer.getData('from')
			if (from === 'slot') {
				if (this.dropId1 == id) {
					this.dropId1 = undefined
				} else if (this.dropId2 == id) {
					this.dropId2 = undefined
				}
			}
		},
		onDrop_1(index) {
			if (this.$wallet.nfts[index].name.includes('Adultlion'))
				Vue.notify({
					group: 'foo',
					type: 'error',
					title: '',
					text: 'Already evolved.',
				})
			else this.dropId1 = index
		},
		onDrop_2(index) {
			if (this.$wallet.nfts[index].name.includes('Adultlion'))
				Vue.notify({
					group: 'foo',
					type: 'error',
					title: '',
					text: 'Already evolved.',
				})
			else this.dropId2 = index
		},
		onExchange() {
			;[this.dropId1, this.dropId2] = [this.dropId2, this.dropId1]
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
				const response = await fetch(
					`https://${process.env.s3Bucket}.s3.amazonaws.com/gifs_evolve/${this.filename}.gif`
				)
				if (response.status == 200) {
					this.previewImageLoading = false
					this.previewImage = `https://${process.env.s3Bucket}.s3.amazonaws.com/gifs_evolve/${this.filename}.gif`
				} else {
					await axios.get(`/.netlify/functions/preview-background`, {
						params,
					})
					const intervalId = setInterval(async () => {
						const response = await fetch(
							`https://${process.env.s3Bucket}.s3.amazonaws.com/gifs_evolve/${this.filename}.gif`
						)
						if (response.status == 200) {
							clearInterval(intervalId)
							this.previewImageLoading = false
							this.previewImage = `https://${process.env.s3Bucket}.s3.amazonaws.com/gifs_evolve/${this.filename}.gif`
							this.curTime = new Date().getTime()
						}
					}, 5000)
				}
			} catch (err) {
				console.log(err)
			}
		},
		async onEvolve() {
			if (parseInt(this.$wallet.heatAmount) < parseInt(process.env.evolvingHeat)) {
				Vue.notify({
					group: 'foo',
					type: 'error',
					title: '',
					text: 'Not enough $HEAT.',
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

				await this.$wallet.burnHeat()

				this.$wallet.evolving = 'evolving...'

				await axios.get(`/.netlify/functions/evolve`, {
					params: {
						oldName: this.filename,
						newName: this.$wallet.nfts[this.dropId1].name.split('#')[1],
						traits,
					},
				})

				this.$wallet.evolving = 'burning...'

				await this.$wallet.burn(parseInt(old_id))
				;[this.dropId1, this.dropId2, this.previewImage] = [
					undefined,
					undefined,
					undefined,
				]

				this.$wallet.evolving = 'reloading...'
				setTimeout(async () => {
					this.curTime = new Date().getTime()
					this.$wallet.nfts = await this.$wallet.getNfts(this.$wallet.account)
					this.$wallet.evolving = ''
				}, 20000)
			}
		},
	},
}
</script>
