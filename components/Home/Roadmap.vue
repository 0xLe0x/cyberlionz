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
						class="h-10 md:h-14"
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
					<!-- <h3 class="mt-2 text-2xl sm:text-left md:text-4xl">
						{{ phase.title }}
					</h3> -->
					<p class="mt-5 text-lg text-lionz-accent text md:text-left">
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

export default {
	data() {
		return {
			phases: [
				{
					title: 'Establish the Pride!',
					imageSource: phase0,
					imageAlt: 'Phase 0',
					description:
						"Focus on Meaningful Organic Community Growth - Build Whitelist - !ROAR with the pride - Use our game for a series of community events. ",
				},
				{
					title: 'The Awakening',
					imageSource: phase1,
					imageAlt: 'Phase 1',
					description:
						'The Genesis mint where it all begins! You might be early, but there is already much to do in the metajungle! Shortly after, staking cubs to accumulate $HEAT, burning of cubs to evolve, and more gaming experiences come online.',
				},
				{
					title: 'Something\'s Brewing!',
					imageSource: phase2,
					imageAlt: 'Phase 2',
					description:
						'Full game that allows Cyber Lion holders to play as their own NFT. Complete a special mission in game to unlock a mystery potion...',
				},
				{
					title: 'The Next Dimension',
					imageSource: phase3,
					imageAlt: 'Phase 3',
					description:
						'Our lionz will spring to life in full 3d and roar into the metaverse in our own games and on partnered platforms! Note: you will keep your 2d Lionz, and the 2d gaming experiences will continue to grow!',
				},
				{
					title: 'A Bright Horizon',
					imageSource: phase4,
					imageAlt: 'Phase 4',
					description:
						'We grow the metajungle. Together as a pride!',
				},
			],
		}
	},
}
</script>
