<template>
  <div>
    <span
      class="toggle-wrapper"
      role="checkbox"
      :aria-checked="value.toString()"
      tabindex="0"
      @click="toggle"
      @keydown.space.prevent="toggle"
    >
      <span
        class="toggle-background"
        :class="backgroundStyles"
      />
      <span
        class="toggle-indicator"
        :style="indicatorStyles" 
      >
      </span>
    </span>
  </div>
</template>
<style>
.gold-mid{
  background-color: #d97706;
}

.gray-lighter{
  background-color: #6b7280;
}

.toggle-wrapper {
  display: inline-block;
  position: relative;
  cursor: pointer;
  width: 55px;
  height: 23px;
  border-radius: 9999px;
}

.toggle-wrapper:focus {
  outline: 0;
}

.toggle-background {
  display: inline-block;
  height: 100%;
  width: 100%;
  mask-image: url('@/assets/images/toggle/toggle-background.svg');
  /*box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);*/
  transition: background-color .4s ease;
}

.toggle-indicator {
  position: absolute;
  height: 17px;
  width: 17px;
  left: 2px;
  bottom: 3px;
  background-color: white;
  mask-image: url('@/assets/images/toggle/toggle-indicator.svg');
  /*box-shadow:  0 2px 4px rgba(0, 0, 0, 0.1);*/
  transition: transform .4s ease;
}
</style>
<script>
export default {
  props: {
    value:{
      type: Boolean,
      required: true
    }
  },
  computed: {
    backgroundStyles() {
      return {
        'gold-mid': this.value,
        'gray-lighter': !this.value
      };
    },
    indicatorStyles() {
      return { transform: this.value ? 'translateX(0)' : 'translateX(34px)' };
    }
  },
  methods: {
    toggle() {
      this.$emit('input', !this.value);
    }
  }
}
</script>