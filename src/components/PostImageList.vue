<template>
  <div
    v-if="postsStatus === 'loading' || !userStatus"
    class="loading loading-dots loading-md"
  ></div>
  <div
    v-else-if="postsStatus === 'error'"
    class="font-sans text-lg text-zinc-400"
  >
    Error
  </div>
  <div
    v-else-if="postsStatus === 'empty'"
    class="font-sans text-lg text-zinc-400"
  >
    No post
  </div>
  <div v-else class="grid grid-cols-3 gap-1">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps(["postsStatus", "userStatus"]);
</script>

<style scoped></style>
