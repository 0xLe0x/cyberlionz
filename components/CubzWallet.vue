<template>
	<section class="relative bg-lionz-light-brown px-20" id="cubzwallet-section">
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
			">
			<button
				class="
					bg-[url('@/static/Buttons/btn-stake.gif')]
					hover:bg-[url('@/static/Buttons/btn-stake-hover.gif')]
					active:bg-[url('@/static/Buttons/btn-stake-active.gif')]
					bg-no-repeat bg-contain bg-center
					h-[60%]
					w-[20%]
				"></button>
			<button
				class="
					bg-[url('@/static/Buttons/btn-evolve.gif')]
					hover:bg-[url('@/static/Buttons/btn-evolve-hover.gif')]
					active:bg-[url('@/static/Buttons/btn-evolve-active.gif')]
					bg-no-repeat bg-contain bg-center
					h-[60%]
					w-[20%]
				"></button>
			<button
				class="
					bg-[url('@/static/Buttons/btn-market.gif')]
					hover:bg-[url('@/static/Buttons/btn-market-hover.gif')]
					active:bg-[url('@/static/Buttons/btn-market-active.gif')]
					bg-no-repeat bg-contain bg-center
					h-[60%]
					w-[20%]
				"></button>
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
			">
			<loading
				:active="!this.$wallet.loaded"
				:width="120"
				:height="120"
				color="#f59e0b"
				loader="dots"
				:opacity="0.6"
				:is-full-page="false" />
			<div
				class="w-full h-[190px] bg-transparent absolute"
				@drop="onDrop($event)"
				@dragover.prevent
				@dragenter.prevent></div>
			<div class="ml-[18%] mt-1 text-gray-300">
				<span class="text-xl">{{
					$wallet.nfts === undefined ? 0 : $wallet.nfts.length
				}}</span>
				ITEMS
			</div>
			<perfect-scrollbar :watch-options="true">
				<div class="flex">
					<p></p>
					<div
						v-for="(item, i) in this.$wallet.nfts
							? this.$wallet.nfts.filter(
									(item, index) => item.id != dropId1 && item.id != dropId2
							  )
							: []"
						:key="i"
						class="flex-none p-3">
						<img
							:src="'https://ipfs.io/ipfs' + item.image.substring(6)"
							class="w-[140px] h-[140px] hover:cursor-pointer"
							data-aos="fade-right"
							@dragstart="startDrag($event, item.id)" />
					</div>
				</div>
			</perfect-scrollbar>
		</div>
		<div class="relative">
			<img src="/Evolving/Lions-UI_Mock-Up_NoToggle.png" class="w-full" />
			<breed-slot
				:index="this.dropId1"
				@dropped="onDrop_1"
				@exchange="onExchange"
				ref="slot1"
				class="absolute left-[11%] top-[17.8%] w-[25.6%] h-[36%]" />
			<trait-slot
				:index="this.dropId1"
				:toggleState="toggleValue"
				class="absolute left-[13.8%] top-[58.5%] w-[18.5%] h-[38.3%]" />
			<div>
				<div class="absolute left-[43%] top-[12.8%] w-[14.2%] h-[19.9%]">
					<loading
						:active="previewImageLoading"
						:width="100"
						:height="100"
						color="#f59e0b"
						loader="dots"
						:opacity="0.6"
						:is-full-page="false" />
					<img
						:src="previewImage"
						data-aos="fade"
						v-if="previewImage != undefined" />
				</div>
				<button
					href="#_"
					class="absolute left-[43.8%] top-[34.7%] w-[12.8%] h-[6.1%] bg-transparent"
					:disabled="dropId1 === undefined || dropId2 === undefined"
					@click="onPreview"></button>
				<div class="absolute left-[44.4%] top-[59.3%] w-[11.5%] h-[34.9%]">
					<div
						v-for="(val, index) in trait_type"
						:key="`toggle-${val}`"
						class="w-full h-[7.2%] mb-[9.5%]">
						<div class="toggles h-full flex items-center justify-center">
							<trait-toggle
								v-model="toggleValue[val]"
								:id="`t-${val}`"
								:data-aos="index > 4 ? 'fade-left' : 'fade-right'"
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
				class="absolute left-[63.8%] top-[17.8%] w-[25.6%] h-[36%]" />
			<trait-slot
				:index="this.dropId2"
				:toggleState="toggleValueR"
				class="absolute left-[67.6%] top-[58.5%] w-[18.5%] h-[38.3%]" />
		</div>
	</section>
</template>

<script>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import axios from 'axios'

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
				'Headwear',
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
		}
	},
	components: {
		Loading,
		PerfectScrollbar,
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
			this.dropId1 = index
		},
		onDrop_2(index) {
			this.dropId2 = index
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
			try {
				this.previewImageLoading = true
				const res = await axios.get(`/.netlify/functions/evolve`, {
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Content-Type': 'application/json',
					},
					params,
				})
				this.previewImageLoading = false
				this.previewImage = res.data
			} catch (err) {
				console.log(err)
			}
		},
	},
}
</script>
