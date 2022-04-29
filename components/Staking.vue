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
			<div
				class="
					relative
					bg-[url('@/static/Evolving/Lions-UI_Control_Panel_Underlay.png')]
					bg-no-repeat
					bg-[length:100%_100%]
					h-[50px]
					md:h-[100px]
					flex
					justify-around
					items-center
					mb-3
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
					"
					@click="showModal = true"></button>
				<button
					class="
						bg-[url('@/static/Buttons/btn-market.gif')]
						hover:bg-[url('@/static/Buttons/btn-market-hover.gif')]
						active:bg-[url('@/static/Buttons/btn-market-active.gif')]
						bg-no-repeat bg-contain bg-center
						h-[60%]
						w-[20%]
					"
					@click="showModal = true"></button>
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

export default {
	data() {
		return {
			stakeItems: [],
			unstakeItems: [],
			showModal: false,
		}
	},
	components: {
		Loading,
		PerfectScrollbar,
		VueFinalModal,
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
