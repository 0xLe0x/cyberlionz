<template>
	<section class="relative bg-lionz-light-brown px-20" id="cubzwallet-section">
		<div class="relative bg-gray-300 px-2 py-3 h-[220px]">
			<loading
				:active="!this.$wallet.loaded"
				:width="120"
				:height="120"
				color="#f59e0b"
				loader="dots"
				:opacity="0.6"
				:is-full-page="false"
			/>
			<div 
				class="w-full h-[190px] bg-transparent absolute"
				@drop="onDrop($event)"
				@dragover.prevent
				@dragenter.prevent
  		></div>
  		<div class="pl-2">
  			INVENTORY : 
  			<span class="text-xl">{{ $wallet.nfts === undefined ? 0 : $wallet.nfts.length }}</span>
  			ITEMS
  		</div>
			<perfect-scrollbar :watch-options="true">
				<div class="flex">
					<p></p>
					<div v-for="(item, i) in this.$wallet.nfts ? this.$wallet.nfts.filter((item, index) => (item.id != dropId1 && item.id != dropId2)) : []" :key="i" class="flex-none p-3">
						<img
							:src="'https://ipfs.io/ipfs' + item.image.substring(6)"
							class="w-[150px] h-[150px] hover:cursor-pointer"
							data-aos="fade-right"
							@dragstart="startDrag($event, item.id)"
						/>	
					</div>
				</div>
			</perfect-scrollbar>
		</div>
		<div
			class="justify-center sm:px-50 md:px-60 py-5 flex flex-wrap md:justify-between gap-y-5">
			<breed-slot :toggleState="toggleValue" @dropped="onDrop_1" @exchange="onExchange" ref="slot1">Keep Slot</breed-slot>
			<div>
				<div class="bg-gray-300 w-[150px] h-[150px] mt-6">
					<loading
						:active="previewImageLoading"
						:width="100"
						:height="100"
						color="#f59e0b"
						loader="dots"
						:opacity="0.6"
						:is-full-page="false"
					/>
					<img
						:src="previewImage"
						data-aos="fade"
						v-if="previewImage != undefined" />
				</div>
	    		<button href="#_" class="flex items-center justify-center px-4 py-2 mt-2 text-blue-500 whitespace-no-wrap border border-blue-300 shadow-sm bg-blue-50 focus:ring-offset-blue-600 hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-100 disabled:opacity-50"
						:disabled="dropId1 === -1 || dropId2 === -1" @click="onPreview">
					<strong>Preview</strong>
				</button>
				<div class="flex flex-col mt-6">
					<div v-for="(val, index) in trait_type" :key="`toggle-${val}`">
						<div class="toggles h-[33px] flex items-center justify-center">
							<trait-toggle v-model="toggleValue[val]" :id="`t-${val}`" :data-aos="index > 4 ? 'fade-left' : 'fade-right'" data-aos-offset="0px" /> 
						</div>
					</div>
				</div>
			</div>
			<breed-slot :toggleState="toggleValueR" @dropped="onDrop_2" @exchange="onExchange" ref="slot2">Burn Slot</breed-slot>
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
			dropId1: -1,
			dropId2: -1,
			trait_type: ['Background', 'Body', 'Clothing', 'Shoes', 'Hands', 'Mouth', 'Eyewear', 'Headwear', 'Companion'],
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
			let toggleValR = new Object
			Object.entries(this.toggleValue).forEach(([key, value]) => toggleValR[key] = !value)
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
			const id = evt.dataTransfer.getData('metadata')
			const from = evt.dataTransfer.getData('from')
			if(from === 'slot') {
				if(this.dropId1 == id) {
					this.dropId1 = -1
					this.$refs.slot1.id = undefined
				} else if(this.dropId2 == id) {
					this.dropId2 = -1
					this.$refs.slot2.id = undefined
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
			let temp = this.$refs.slot1.id
			this.$refs.slot1.id = this.$refs.slot2.id
			this.$refs.slot2.id = temp
			temp = this.dropId1
			this.dropId1 = this.dropId2
			this.dropId2 = temp
		},
		async onPreview() {
			let params = {}
			Object.entries(this.toggleValue).forEach(([key, value], index) => params[key] = this.$wallet.nfts[(value ? this.$refs.slot1.id : this.$refs.slot2.id)].attributes[index].value)
			try {
				this.previewImageLoading = true
				const res = await axios.get(`${process.env.hackslipsBackendServer}/api/evolve`,{ params })
				this.previewImageLoading = false
				this.previewImage = `${process.env.hackslipsBackendServer}/cubz/` + res.data + '.gif'
			} catch (err) {
				console.log(err)
			}
		}
	},
}
</script>
