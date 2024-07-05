<template>
  <span
    class="pacifico-regular select-none"
    :style="{ 'font-size': fontSize + 'px', 'line-height': lineHeight + 'px' }"
    >Instaparody</span
  >
</template>

<script setup>
defineProps({ fontSize: { default: 24 }, lineHeight: { default: 32 } });
</script>

<style scoped>
.pacifico-regular {
  font-family: "Pacifico", cursive;
  font-weight: 400;
  font-style: normal;
}
</style>
