<template>
  <div class="w-full bg-black">
    <div class="w-full px-4 py-2 flex justify-center items-center text-white">
      <span class="w-full break-words">{{ message }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["message"]);
</script>
