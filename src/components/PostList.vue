<template>
  <div
    class="postList flex flex-col gap-y-8 md:grid md:grid-cols-2 md:gap-8 2xl:grid-cols-3"
  >
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  // isError: { type: Boolean, default: false },
  // isPostsEmpty: { type: Boolean, default: false },
  // isResultEmpty: { type: Boolean, default: false },
  // postsStatus: { type: String },
});
</script>

<style scoped>
.postList {
  /* width: fit-content; */
  max-width: 100dvw;
}
</style>
