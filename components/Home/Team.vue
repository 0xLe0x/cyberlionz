<template>
	<section class="w-full py-16 bg-lionz-blue lg:py-24" id="team-section">
		<div class="px-12 mx-auto text-center max-w-7xl">
			<div class="space-y-12 md:text-left">
				<div
					class="
						mb-20
						space-y-5
						sm:mx-auto sm:max-w-xl
						md:max-w-2xl
						sm:space-y-4
						lg:max-w-5xl
					">
					<h2 class="relative flex justify-center">
						<img
							data-aos="fade-down"
							class="h-16"
							src="@/assets/images/lions-team.png"
							alt="Team" />
					</h2>
				</div>
				<div
					class="
						mx-auto
						space-y-16
						sm:grid sm:grid-cols-2 sm:gap-16 sm:space-y-0
						lg:grid-cols-3 lg:max-w-5xl
					">
					<div
						v-for="dev in devs"
						class="space-y-6 text-center lg:ml-0 md:ml-10"
						data-aos="fade-in">
						<div class="relative w-48 h-48 p-2 mx-auto md:w-56 md:h-56">
							<img
								class="relative z-20 w-full h-full rounded-xl"
								:src="dev.imageSource"
								:alt="dev.imageAlt" />
							<svg
								class="
									absolute
									inset-0
									w-full
									h-full
									text-pink-500
									transform
									scale-150
									fill-current
									opacity-10
								"
								viewBox="0 0 200 200"
								xmlns="http://www.w3.org/2000/svg">
								<path
									d="M34.2,-54.9C47,-51.8,62,-48.1,70.2,-38.9C78.4,-29.6,79.9,-14.8,80,0.1C80.2,14.9,78.9,29.9,70.8,39.3C62.6,48.7,47.6,52.6,34.7,57.1C21.7,61.6,10.9,66.7,-1.7,69.7C-14.3,72.7,-28.7,73.6,-42.4,69.6C-56.1,65.5,-69.2,56.5,-74.9,44.1C-80.6,31.7,-79,15.8,-77.6,0.8C-76.2,-14.2,-75,-28.4,-70.1,-42.3C-65.2,-56.2,-56.7,-69.8,-44.4,-73.2C-32.1,-76.6,-16.1,-69.9,-2.7,-65.2C10.7,-60.5,21.3,-58,34.2,-54.9Z"
									transform="translate(100 100)"></path>
							</svg>
						</div>
						<div class="space-y-2">
							<div class="space-y-1 text-lg font-medium leading-6">
								<h3 class="text-lionz-accent drop-shadow">{{ dev.name }}</h3>
								<p class="text-orange-600 drop-shadow">{{ dev.job }}</p>
							</div>
							<div class="relative flex items-center justify-center space-x-3">
								<a
									:href="dev.twitter"
									target="_blank"
									class="text-gray-300 hover:text-gray-400">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="w-6 h-6 fill-current"
										viewBox="0 0 24 24">
										<path
											d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
									</svg>
								</a>
								<!--
								<a
									:href="dev.discord"
									target="_blank"
									class="text-gray-300 hover:text-gray-400">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="w-6 h-6 fill-current"
										viewBox="0 0 24 24">
										<path
											d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
									</svg>
								</a>
								-->
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import lionDev1 from '@/assets/images/lion-cub-dev-1.png'
import lionDev2 from '@/assets/images/lion-cub-dev-2.png'
import lionDev3 from '@/assets/images/lion-cub-dev-3.png'

import lionDev4 from '@/assets/images/lion-cub-artist-1.png'
import lionDev5 from '@/assets/images/lion-cub-artist-2.png'

import lionDev6 from '@/assets/images/lion-cub-mod-1.png'

export default {
	data() {
		return {
			devs: [
				{
					imageSource: lionDev1,
					imageAlt: '0xAsh',
					name: '0xAsh',
					job: 'Founder and CEO',
					twitter: 'https://twitter.com/?lang=en',
					discord: 'https://discord.com/',
				},
				{
					imageSource: lionDev2,
					imageAlt: 'PixelPirate',
					name: 'Pixel Pirate',
					job: 'Lead Pixel Artist',
					twitter: 'https://twitter.com/?lang=en',
					discord: 'https://discord.com/',
				},
				{
					imageSource: lionDev3,
					imageAlt: 'EnigmaFactory',
					name: 'Enigma Factory',
					job: 'Game Developer',
					twitter: 'https://twitter.com/EnigmaFactory',
					discord: 'https://discord.com/',
				},
				{
					imageSource: lionDev4,
					imageAlt: '0xBacon',
					name: '0xBacon',
					job: 'Team Manager',
					twitter: 'https://twitter.com/?lang=en',
					discord: 'https://discord.com/',
				},
				{
					imageSource: lionDev5,
					imageAlt: 'CanICryptIt',
					name: 'CanICryptIt',
					job: 'Lead Developer',
					twitter: 'https://twitter.com/ryantcwynar',
					discord: 'https://discord.com/',
				},
				{
					imageSource: lionDev6,
					imageAlt: '0xWoof',
					name: '0xWoof',
					job: 'Lead Moderator',
					twitter: 'https://twitter.com/90woof1',
					discord: 'https://discord.com/',
				},
			],
		}
	},
}
</script>

