<template>

	<header class="w-full px-8 text-gray-700 absolute z-50">
				<ConnectModal />

		<div
			class="
				container
				flex flex-col flex-wrap
				items-center
				justify-between
				py-2
				md:py-5
				mx-auto
				md:flex-row
				max-w-7xl
			">
			<div class="relative flex flex-col md:flex-row">
				<nav
					class="
						hidden
						md:flex
						flex-wrap
						items-center
						mb-5
						text-sm
						md:mb-0 md:pl-10
					">
					<a
						href="#about-section"
						class="mr-5 font-medium leading-6 text-lionz-accent hover:text-gray-900"
						>About
					</a>

					<a
						href="#game-section"
						class="mr-5 font-medium leading-6 text-lionz-accent hover:text-gray-900"
						>Game
					</a>
					<a
						href="/stake"
						class="
							mr-5
							font-medium
							leading-6
							text-lionz-accent
							hover:text-gray-900
							text-center
						"
						>Stake</a
					>

					<a
						href="#roadmap-section"
						class="mr-5 font-medium leading-6 text-lionz-accent hover:text-gray-900"
						>Roadmap</a
					>

					<a
						href="#team-section"
						class="mr-5 font-medium leading-6 text-lionz-accent hover:text-gray-900"
						>Team</a
					>
					<a
						href="#faq-section"
						class="mr-5 font-medium leading-6 text-lionz-accent hover:text-gray-900"
						>FAQ</a
					>
				</nav>
				<!-- <nav class="md:flex items-center mb-5 text-sm md:mb-0 md:pl-10"> -->
				<!--	<a
						href="/#"
						class="
							mr-5
							font-medium
							leading-6
							text-lionz-accent
							hover:text-gray-900
							text-center
						"
						>Evolve</a
					>
					<a
						href="/#"
						class="
							mr-5
							font-medium
							leading-6
							text-lionz-accent
							hover:text-gray-900
							text-center
							disabled
						"
						>Market</a
					>
				</nav> -->
			</div>
			<div class="inline-flex items-center space-x-6 lg:justify-end">
				<connected-button />
				<!-- <span class="text-xl">
					{{ displayTime }}
				</span> -->
			</div>
		</div>
	</header>
</template>

<script>
export default {}
</script>
