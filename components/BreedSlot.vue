<template>
	<div
		@drop="onDrop($event)"
		@dragover.prevent
		@dragenter.prevent
		@click="onClick">
		<img
			:src="`${image}?${timeStamp}`"
			data-aos="fade"
			data-aos-offset="0px"
			v-if="image != undefined"
			@dragstart="startDrag($event)" />
		<div
			class="
				absolute
				bg-[black]
				opacity-70
				left-0
				top-0
				w-full
				h-full
				hover:cursor-pointer
			"
			v-if="itemid !== undefined" />
	</div>
</template>

<script>
export default {
	props: {
		index: {
			type: Number,
		},
		timeStamp: {
			type: Number,
		},
		itemid: {
			type: Number,
		},
	},
	computed: {
		image() {
			if (this.index === undefined || this.$wallet.nfts.length === 0)
				return undefined
			return this.$wallet.nfts[this.index].image
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
		onClick() {
			this.$emit('click')
		},
	},
}
</script>