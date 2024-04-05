<template>
  <div v-for="n in count" class="w-full px-4 py-3">
    <div class="animate-pulse flex items-center w-full gap-3 relative">
      <div class="avatar">
        <div
          class="rounded-full bg-slate-300"
          :class="`w-${widthAvatar}`"
        ></div>
      </div>

      <div
        class="grow flex flex-col gap-2.5 justify-center items-start *:bg-slate-300"
      >
        <div class="h-3 w-3/4 rounded"></div>
        <div class="h-3 w-3/5 rounded"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  widthAvatar: {
    type: Number,
    default: 14,
  },
  count: {
    type: Number,
    default: 3,
  },
});
</script>

<style scoped></style>
