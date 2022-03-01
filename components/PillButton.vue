<template>
	<button
		type="button"
		class="
		    rounded-full
			inline-flex
			items-center
			m-2
			h-12
			px-8
			text-base
			font-bold
			leading-6
			text-white
			transition
			duration-150
			ease-in-out
			bg-indigo-400
			border border-transparent
			hover:bg-indigo-700
			focus:outline-none
			active:bg-indigo-700
		">
		<slot />
	</button>
</template>
<script>
export default{
    name: "PillButton"
}
</script>