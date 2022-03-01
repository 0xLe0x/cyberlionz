<template>
  <div id="app" class="min-h-screen w-full bg-gray-200">
    <main>
      <component
        v-for="(component, index) in page.components"
        :key="index"
        :is="component.name"
        v-bind="component.props"
      />
    </main>
  </div>
</template>
<script>
import Hero from "../components/Landingpage/Hero.vue";
import Services from "../components/Landingpage/Services.vue";
import Footer from "../components/Footer.vue"
export default {
	name: 'Test',
  components: {
    Hero,
    Services,
    Footer,
  },
    data() {
    return {
      page: {
        components: [
          {
            name: "Hero",
            props: {}
          },
          {
            name: "Services",
            props: {}
          },
          {
            name: "Footer",
            props: {}
          }
        ]
      }
    };
  }
}
</script>
