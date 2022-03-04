<template>
	<div
		id="unity-container"
		:class="{
			'unity-desktop': !unityMobile,
			'unity-mobile': unityMobile,
		}">
		<div class="header">
			<a href="#default" class="logo"
				><img src="/cyberlionz-twitimg.gif" height="32px" />
			</a>
			<div class="header-right">
				<a class="active" href="#home">Game</a>
				<a href="https://twitter.com/CyberLionzNFT" target="_blank">Twitter</a>
			</div>
		</div>

		<canvas
			id="unity-canvas"
			ref="unity"
			width="960"
			height="600"
			style="background: url(/Build/webgl.jpg) center / cover"></canvas>
		<div id="unity-loading-bar" class="block">
			<div id="unity-logo"></div>
			<div id="unity-progress-bar-empty" v-if="showLoadingBar">
				<div
					id="unity-progress-bar-full"
					:style="{ width: progressBarPercent }"></div>
			</div>
		</div>
		<div
			id="unity-warning"
			:class="`p-4 rounded-md ${bannerColor}`"
			v-if="showUnityBanner">
			{{ bannerMsg }}
		</div>
		<div id="unity-footer">
			<div id="unity-webgl-logo"></div>
			<div id="unity-fullscreen-button" @click.native="setFullscreen"></div>
			<div id="unity-build-title">CyberLionz</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			showUnityBanner: false,
			bannerMsg: '',
			bannerColor: '',
			unityMobile: false,
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

			this.unityMobile = true

			// To lower canvas resolution on mobile devices to gain some
			// performance, uncomment the following line:
			config.devicePixelRatio = 1

			this.canvasWidth = window.innerWidth
			this.canvasHeight = window.innerHeight

			this.unityShowBanner(
				'CyberLionz WebGL is not fully compatabile with mobile devices - Your experience may vary!'
			)
		} else {
			// Desktop style: Render the game canvas in a window that can be maximized to fullscreen:
		}

		window
			.createUnityInstance(this.$refs.unity, config, (progress) => {
				this.progressBarPercent = 100 * progress + '%'
			})
			.then((unityInstance) => {
				this.showLoadingBar = false
				this.unityInstance = unityInstance
			})
			.catch((message) => {
				alert(message)
			})
	},
	methods: {
		setFullscreen() {
			window.unityInstance.SetFullscreen(1)
		},
		unityShowBanner(msg, type) {
			const _this = this
			this.bannerMsg = msg
			this.showUnityBanner = true
			if (type == 'error') this.bannerColor = 'bg-red-400'
			else {
				if (type == 'warning') this.bannerColor = 'bg-yellow-400'
				setTimeout(function () {
					this.showUnityBanner = false
				}, 5000)
			}
		},
	},
}
</script>
