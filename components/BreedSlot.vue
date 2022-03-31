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
			<img :src="image" data-aos="fade" v-if="image != undefined" @dragstart="startDrag($event)"/>
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
	computed: {
		image() {
			if(this.id === undefined || this.$wallet.nfts.length === 0)
				return ''
			return 'https://ipfs.io/ipfs' + this.$wallet.nfts[this.id].image.substring(6)
		}
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

			if(from === 'list') {
				this.id = id
				this.$emit('dropped', this.id)
			}
			else if(from === 'slot' && id != this.id) {
				this.$emit('exchange')
			}
		},
	},
}
</script>
