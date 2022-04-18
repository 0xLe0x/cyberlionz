<template>
	<div
		@drop="onDrop($event)"
		@dragover.prevent
		@dragenter.prevent>
		<img
			:src="image"
			data-aos="fade"
			v-if="image != undefined"
			@dragstart="startDrag($event)" />
	</div>
</template>

<script>
export default {
	props: {
		index: {
			type: Number,
		},
	},
	computed: {
		image() {
			if (this.index === undefined || this.$wallet.nfts.length === 0) return ''
			return (
				'https://ipfs.io/ipfs' + this.$wallet.nfts[this.index].image.substring(6)
			)
		},
	},
	methods: {
		startDrag(evt) {
			evt.dataTransfer.dropEffect = 'move'
			evt.dataTransfer.effectAllowed = 'move'
			evt.dataTransfer.setData('metadata', this.index)
			evt.dataTransfer.setData('from', 'slot')
		},
		onDrop(evt) {
			const id = evt.dataTransfer.getData('metadata')
			const from = evt.dataTransfer.getData('from')

			if (from === 'list') {
				this.$emit('dropped', parseInt(id))
			} else if (from === 'slot' && id != this.index) {
				this.$emit('exchange')
			}
		},
	},
}
</script>
