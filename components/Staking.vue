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
							? this.$wallet.nfts.filter((item, index) => index != stakeId)
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
		<div class="flex justify-center mt-2">
			<div
				class="w-[140px] h-[140px] bg-gray-300"
				@drop="onDrop($event)"
				@dragover.prevent
				@dragenter.prevent>
				<img :src="stakeImage" data-aos="fade" v-if="stakeImage != undefined" />
			</div>
		</div>
		<div class="h-[100px] flex justify-center items-center">
			<button
				class="
					bg-[url('@/static/Buttons/btn-stake.gif')]
					hover:bg-[url('@/static/Buttons/btn-stake-hover.gif')]
					active:bg-[url('@/static/Buttons/btn-stake-active.gif')]
					bg-no-repeat bg-contain bg-center
					h-[60%]
					w-[20%]
				"
				@click="onStake"></button>
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
			stakeId: undefined,
		}
	},
	components: {
		Loading,
		PerfectScrollbar,
	},
	computed: {
		stakeImage() {
			if (this.stakeId === undefined || this.$wallet.nfts.length === 0)
				return undefined
			return (
				'https://ipfs.io/ipfs' + this.$wallet.nfts[this.stakeId].image.substring(6)
			)
		},
	},
	methods: {
		startDrag(evt, index) {
			evt.dataTransfer.dropEffect = 'copy'
			evt.dataTransfer.effectAllowed = 'copyMove'
			evt.dataTransfer.setData('metadata', index)
		},
		onDrop(evt) {
			const id = parseInt(evt.dataTransfer.getData('metadata'))
			this.stakeId = id
		},
		onStake() {
			this.$wallet.stake(this.stakeId)
		},
	},
}
</script>
