<template>
  <span
    class="toggle-wrapper relative cursor-pointer w-full h-full"
    role="checkbox"
    :aria-checked="value.toString()"
    tabindex="0"
    @click="toggle"
    @keydown.space.prevent="toggle">
    <span
      class="
        relative
        block
        w-full
        h-full
        transition-[background-color]
        duration-[400ms]
        ease-in-out
      "
      :class="backgroundStyles">
      <div class="bg-[#24142c] absolute left-[0] top-[0] w-[3px] h-[3px]"></div>
      <div class="bg-[#24142c] absolute left-[0] bottom-[0] w-[3px] h-[3px]"></div>
      <div class="bg-[#24142c] absolute right-[0] top-[0] w-[3px] h-[3px]"></div>
      <div
        class="bg-[#24142c] absolute right-[0] bottom-[0] w-[3px] h-[3px]"></div>
    </span>
    <span
      class="
        absolute
        h-[140%]
        left-[-5%]
        top-[-20%]
        transition-transform
        duration-[400ms]
        ease-in-out
      "
      :style="indicatorStyles">
      <img src="/Evolving/Lions-UI_Knob.png" class="w-full h-full" />
    </span>
  </span>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    backgroundStyles() {
      return {
        'bg-[#3dff6e]': this.value,
        'bg-[#ff417d]': !this.value,
      }
    },
    indicatorStyles() {
      return { transform: this.value ? 'translateX(0)' : 'translateX(400%)' }
    },
  },
  methods: {
    toggle() {
      this.$emit('input', !this.value)
    },
  },
}
</script>
