<template>
	<button
		@click="$emit('toggle')"
		:style="backgroundStyles"
		class="text-[9px] font-semibold py-1 px-3 border">
		<slot></slot>
	</button>
</template>

<script>
export default {
	props: {
		value: {
			type: Boolean,
			required: true,
		},
		color: {
			type: String,
			required: true,
		},
	},
	computed: {
		backgroundStyles() {
			return this.value
				? {
						'background-color': this.color,
						'color': '#ffffff',
						'border-color': this.color,
				  }
				: {
						'background-color': 'transparent',
						'color': this.color,
						'border-color': this.color,
				  }
		},
	},
}
</script>
