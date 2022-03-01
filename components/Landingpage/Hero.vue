<template>
  <div class="relative block pt-5 pb-32 content-center items-center justify-center block" style="min-height: 75vh;" >
    <div class="absolute top-0 w-full h-full bg-center bg-cover bg-[url('@/assets/img/hero.png')]" >
      <span id="blackOverlay" class="w-full h-full absolute opacity-75 bg-black"></span>
    </div>
    <div class="flex items-center justify-between h-16 px-8 mx-auto max-w-7xl">
        <a href="#_" class="relative z-10 flex items-center w-auto text-2xl font-extrabold leading-none text-white select-none">NFT Project</a>
        <a href="#_" class="inline-flex z-10 items-center justify-center px-6 py-3 text-lg font-medium leading-tight text-blue-500 whitespace-no-wrap border border-blue-300 rounded-full shadow-sm bg-blue-50 focus:ring-offset-blue-600 hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-100"
		:disabled="!!$wallet.account"
						@click="onWalletConnect">
            <strong>{{ $wallet.accountCompact }}</strong>
        </a>
    </div>
    <div class="container relative mx-auto">
      <div class="items-center flex flex-wrap">
        <div class="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
          <div class="mt-8 sm:mt-0">
            <div class="sm:hidden bg-orange-400 rounded-lg mb-4 p-4">If on mobile, use the MetaMask browser to connect your wallet.</div>
            <h1 class="text-white font-semibold text-5xl">Mint our NFT</h1>
            <Mint/>
          </div>
        </div>
      </div>
    </div>
    <div
      class="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
      style="height: 70px; transform: translateZ(0px);"
    >
      <svg
        class="absolute bottom-0 overflow-hidden"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        version="1.1"
        viewBox="0 0 2560 100"
        x="0"
        y="0"
      >
        <polygon class="text-gray-300 fill-current" points="2560 0 2560 100 0 100"></polygon>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
		async onWalletConnect() {
			try {
				await this.$wallet.connect()
			} catch (err) {
				console.error({err})
				this.$toast.error(err.message || 'Wallet connection failed', {
					title: 'Wallet',
					variant: 'danger',
					action : {
						text : 'Close',
						onClick : (e, toastObject) => {
							toastObject.goAway(0);
						}
					},
				})
			}
		}
	}
};
</script>