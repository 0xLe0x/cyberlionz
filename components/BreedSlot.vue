<template>
	<div>
		<div class="text-center text-slate-300">
			<slot></slot>
		</div>
		<div
			class="bg-gray-300 w-[200px] h-[200px]"
			@drop="onDrop($event)"
			@dragover.prevent
			@dragenter.prevent>
			<img
				:src="image"
				data-aos="fade"
				v-if="image != undefined"
				@dragstart="startDrag($event)" />
		</div>
		<div class="mt-5 bg-gray-300 w-[200px] h-[300px]">
			<div v-for="(trait, i) in traits" :key="i">
				<span class="flex justify-center text-center items-center text-xs h-[33px]" data-aos="fade-right" data-aos-offset="0px">
					<p v-if="toggleState[trait.trait_type]" class="text-[#f59e0b]">
						{{ trait.value }}
					</p>
					<p v-else>
						{{ trait.value }}
					</p>
				</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			id: undefined,
		}
	},
	props: {
		toggleState: {
			type: Object,
		}
	},
	computed: {
		image() {
			if (this.id === undefined || this.$wallet.nfts.length === 0) return ''
			return 'https://ipfs.io/ipfs' + this.$wallet.nfts[this.id].image.substring(6)
		},
		traits() {
			if (this.id === undefined || this.$wallet.nfts.length === 0) return ''
			return this.$wallet.nfts[this.id].attributes
		},
	},
	methods: {
		startDrag(evt, index) {
			evt.dataTransfer.dropEffect = 'move'
			evt.dataTransfer.effectAllowed = 'move'
			evt.dataTransfer.setData('metadata', this.id)
			evt.dataTransfer.setData('from', 'slot')
		},
		onDrop(evt) {
			const id = evt.dataTransfer.getData('metadata')
			const from = evt.dataTransfer.getData('from')

			if (from === 'list') {
				this.id = id
				this.$emit('dropped', this.id)
			} else if (from === 'slot' && id != this.id) {
				this.$emit('exchange')
			}
		},
	},
}
</script>
