<template>
	<section
		class="py-12 bg-lionz-light-brown sm:py-16 md:py-20 lg:py-24"
		id="faq-section">
		<div class="max-w-6xl px-8 mx-auto lg:px-16">
			<h2 class="mb-2 flex justify-center">
				<!-- TODO: change this to the right title when available -->
				<img
					data-aos="fade-down"
					class="h-16"
					src="@/assets/images/lions-faq.png"
					alt="FAQ" />
			</h2>

			<div class="relative mt-2">
				<div
					v-for="(faq, index) in faqs"
					data-aos="slide-up"
					class="
						relative
						overflow-hidden
						border-b-2 border-orange-400
						select-none
					">
					
					<h4
						@click="showAnswer(index)"
						class="
							flex
							items-center
							justify-start
							text-lg
							font-medium
							text-lionz-accent
							cursor-pointer
							sm:text-xl
							md:text-2xl
							py-7
							hover:text-gray-900
						">
						<svg
							class="
								w-6
								h-6
								mr-3
								transition-all
								duration-200
								ease-out
								transform
								rotate-0
							"
							:class="{ '-rotate-90': !faq.show }"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"></path>
						</svg>
						<span>{{ faq.question }}</span>
					</h4>
					<Transition
						enter-active-class="transition-all ease-out	duration-300"
						enter-class="opacity-0 transform -translate-y-4"
						enter-to-class="opacity-100 transform -translate-y-0"
						leave-active-class="transition-all ease-out	duration-200"
						leave-from-class="opacity-100 transform -translate-y-0"
						leave-to-class="opacity-0 transform -translate-y-4">
						<p
							class="
								px-2
								pt-0
								-mt-2
								text-sm text-gray-800
								sm:text-base
								md:text-lg
								py-7
							"
							v-if="faq.show">
							{{ faq.answer }}
						</p>
					</Transition>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
export default {
	data() {
		return {
			show: false,
			faqs: [
				{
					show: false,
					question: 'How many cubs will there be?',
					answer:
						'500 Cubs will spring into the MetaJungle. Supply decreases as cubs are combined for adults.',
				},
				{
					show: false,
					question: 'What blockchain?',
					answer:
						'The metajungle will be built on the Ethereum network. We are excited for ETH2 and future enhancements and efficiencies.',
				},
				{
					show: false,
					question: 'Mint Price?',
					answer:
						'TBA - Be first to know by joining our Discord!',
				},
				{
					show: false,
					question: 'Token?',
					answer:
						'Oh yeah! It\'s called $HEAT and it\'s neat!',
				},
				{
					show: false,
					question: 'Market place?',
					answer:
						'OpenSea',
				},
				{
					show: false,
					question: 'Utility Ready at Launch?',
					answer:
						'You know it! No empty promises!',
				},
			],
		}
	},
	methods: {
		showAnswer(index) {
			if (this.faqs[index]) {
				this.faqs[index].show = !this.faqs[index].show
			}
		},
	},
}
</script>
