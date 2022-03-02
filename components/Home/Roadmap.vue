<template>
	<section class="py-20 bg-orange-400" id="roadmap-section">
		<div
			class="
				flex flex-col
				items-center
				px-8
				mx-auto
				space-y-12
				max-w-7xl
				xl:px-12
			">
			<div class="relative">
				<h2 class="w-full flex justify-center mb-8">
					<img
						data-aos="fade-down"
						class="h-16"
						src="@/assets/images/lions-join-the-pride.png"
						alt="Join the pride" />
				</h2>
			</div>

			<div
				v-for="phase in phases"
				class="flex flex-col mb-8 sm:flex-row"
				data-aos="slide-up">
				<div
					class="flex items-center sm:justify-center mb-8 sm:w-1/2 md:w-5/12">
					<img
						class="rounded-lg shadow-xl h-10 md:h-14"
						:src="phase.imageSource"
						:alt="phase.imageAlt" />
				</div>
				<div
					class="
						flex flex-col
						justify-center
						mt-5
						mb-8
						md:mt-0
						sm:w-1/2
						md:w-7/12
						sm:pl-16
					">
					<h3 class="mt-2 text-2xl sm:text-left md:text-4xl">
						{{ phase.title }}
					</h3>
					<p class="mt-5 text-lg text-gray-700 text md:text-left">
						{{ phase.description }}
					</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import phase0 from '@/assets/images/lions-phase-0.png'
import phase1 from '@/assets/images/lions-phase-1.png'
import phase2 from '@/assets/images/lions-phase-2.png'
import phase3 from '@/assets/images/lions-phase-3.png'
import phase4 from '@/assets/images/lions-phase-4.png'
import phase5 from '@/assets/images/lions-phase-5.png'

export default {
	data() {
		return {
			phases: [
				{
					title: 'Design Made Easy',
					imageSource: phase0,
					imageAlt: 'Phase 0',
					description:
						"Crafting your user experience has never been easier, with our intuitive drag'n drop interface you will be creating beatiful designs in no time.",
				},
				{
					title: 'Optimized For Conversions',
					imageSource: phase1,
					imageAlt: 'Phase 1',
					description:
						'Backed by data, these templates have been crafted for ultimate optimization. Now, converting your visitors into customers is easier than ever before.',
				},
				{
					title: 'Optimized For Conversions',
					imageSource: phase2,
					imageAlt: 'Phase 2',
					description:
						'Backed by data, these templates have been crafted for ultimate optimization. Now, converting your visitors into customers is easier than ever before.',
				},
				{
					title: 'Optimized For Conversions',
					imageSource: phase3,
					imageAlt: 'Phase 3',
					description:
						'Backed by data, these templates have been crafted for ultimate optimization. Now, converting your visitors into customers is easier than ever before.',
				},
				{
					title: 'Optimized For Conversions',
					imageSource: phase4,
					imageAlt: 'Phase 4',
					description:
						'Backed by data, these templates have been crafted for ultimate optimization. Now, converting your visitors into customers is easier than ever before.',
				},
				{
					title: 'Optimized For Conversions',
					imageSource: phase5,
					imageAlt: 'Phase 5',
					description:
						'Backed by data, these templates have been crafted for ultimate optimization. Now, converting your visitors into customers is easier than ever before.',
				},
			],
		}
	},
}
</script>
