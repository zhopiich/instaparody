<template>
  <svg :viewBox="viewbox">
    <use :href="`${sprite}#icon-${icon}`"></use>
  </svg>
</template>

<script setup>
import sprite from "../assets/icons/sprite.svg"

defineProps({
  icon: String,
  viewbox: {
    type: String,
    // default: null,
  },
})
</script>

<style scoped>
/* svg {
  height: 2em;
} */
</style>