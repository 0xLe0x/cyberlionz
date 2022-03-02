<template>
	<div id="app" class="min-h-screen w-full bg-gray-200">
		<main>
			<component
				v-for="(component, index) in page.components"
				:key="index"
				:is="component.name"
				v-bind="component.props" />
		</main>
	</div>
</template>

<script>
import Hero from '../components/Landingpage/Hero.vue'
import About from '../components/Landingpage/About.vue'
import Roadmap from '../components/Landingpage/Roadmap.vue'
import Team from '../components/Landingpage/Team.vue'
import Faq from '../components/Landingpage/Faq.vue'
import Footer from '../components/Footer.vue'

export default {
	name: 'Test',
	components: {
		Hero,
		About,
		Roadmap,
		Team,
		Faq,
		Footer,
	},
	data() {
		return {
			page: {
				components: [
					{
						name: 'Hero',
						props: {},
					},
					{
						name: 'About',
						props: {},
					},
					{
						name: 'Roadmap',
						props: {},
					},
					{
						name: 'Team',
						props: {},
					},
					{
						name: 'Faq',
						props: {},
					},
					{
						name: 'Footer',
						props: {},
					},
				],
			},
		}
	},
}
</script>
