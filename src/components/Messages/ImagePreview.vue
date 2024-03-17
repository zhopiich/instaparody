<template>
  <div class="flex justify-center items-center bg-slate-900 relative">
    <button class="btn absolute top-0 left-0" @click="emit('cancel')">X</button>
    <img :src="imagePreview" class="max-h-full max-w-full" />
  </div>
</template>

<script setup>
const props = defineProps(["imagePreview"]);
const emit = defineEmits(["cancel"]);
</script>

<style lang="scss" scoped></style>
