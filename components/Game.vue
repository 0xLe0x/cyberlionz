<template>
	<section class="relative bg-lionz-purple" id="game-section">
		<h2 class="mb-2 flex justify-center">
			<!-- TODO: change this to the right title when available -->
			<img
				data-aos="fade-down"
				class="h-16"
				src="@/assets/images/lions-game.png"
				alt="FAQ" />
		</h2>

		<div class="flex justify-center">
			<div class="max-w-2xl">
				<p class="leading-loose text-lionz-yellow mb-5 text-shadow-xl">
					Play the first of many metajungle games and experiences right now, right here!
				</p>
			</div>
		</div>

		<div class="flex flex-col items-center mx-auto md:w-[960px]">
			<div class="w-full md:w-[960px] md:h-[600px] relative block">
				<canvas
					ref="unity"
					class="
						w-full
						md:w-[960px] md:h-[600px]
						text-lionz-yellow
						bg-[url(/Build/webgl.jpg)] bg-cover bg-center
					"></canvas>
				<div
					v-if="showLoadingBar"
					class="
						absolute
						top-[50%]
						left-[50%]
						transform
						translate-x-[-50%] translate-y-[-50%]
						w-[300px]
					">
					<div class="w-full">
						<div
							id="unity-progress-bar-full"
							class="h-8 bg-lionz-accent"
							:style="{ width: progressBarPercent }"></div>
					</div>
				</div>
			</div>

			<!-- SMALL MODE ONLY -->
			<div class="text-lionz-yellow md:hidden p-4 rounded-md block sm:hidden">
				Play on Desktop - Coming soon to Google Play Store
			</div>
			<div class="w-full block">
				<!-- hidden sm:block"> -->
				<img
					src="~/assets/images/fullscreen-button.png"
					class="ml-auto h-16 w-16 cursor-pointer"
					@click="setFullscreen" />
			</div>
		</div>
	</section>
</template>

<script>
export default {
	data() {
		return {
			showLoadingBar: true,
			canvasWidth: 960,
			canvasHeight: 600,
			progressBarPercent: '0%',
			unityInstance: {},
		}
	},
	mounted() {
		// Shows a temporary message banner/ribbon for a few seconds, or
		// a permanent error message on top of the canvas if type=='error'.
		// If type=='warning', a yellow highlight color is used.
		// Modify or remove this function to customize the visually presented
		// way that non-critical warnings and error messages are presented to the
		// user.

		var config = {
			dataUrl: '/Build/webgl.data.gz',
			frameworkUrl: '/Build/webgl.framework.js.gz',
			codeUrl: '/Build/webgl.wasm.gz',
			streamingAssetsUrl: '/StreamingAssets',
			companyName: 'Fueled on Bacon',
			productName: 'fob-cyberlionz-runner',
			productVersion: '0.1.4',
			showBanner: this.unityShowBanner,
			showLoadingBar: true,
		}

		// By default Unity keeps WebGL canvas render target size matched with
		// the DOM size of the canvas element (scaled by window.devicePixelRatio)
		// Set this to false if you want to decouple this synchronization from
		// happening inside the engine, and you would instead like to size up
		// the canvas DOM size and WebGL render target sizes yourself.
		// config.matchWebGLToCanvasSize = false;

		if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
			// Mobile device style: fill the whole browser client area with the game canvas:
			// To lower canvas resolution on mobile devices to gain some
			// performance, uncomment the following line:
			// config.devicePixelRatio = 1
		} else {
			// Desktop style: Render the game canvas in a window that can be maximized to fullscreen:
		}

		window.addEventListener('load', () => {
			// run after everything is in-place
			try {
				window
					.createUnityInstance(this.$refs.unity, config, (progress) => {
						if (progress > 0.98) {
							this.showLoadingBar = false
						}
						this.progressBarPercent = 100 * progress + '%'
					})
					.then((unityInstance) => {
						this.showLoadingBar = false
						this.unityInstance = unityInstance
					})
					.catch((message) => {
						alert(message)
					})
			} catch (err) {
				console.log(err)
			}
		})
	},
	methods: {
		setFullscreen() {
			this.unityInstance.SetFullscreen(1)
		},
	},
}
</script>
