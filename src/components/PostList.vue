<template>
  <div
    class="w-[min(470px,_100dvw)] md:w-fit flex flex-col gap-8 md:grid md:grid-cols-[repeat(2,_minmax(0,_470px))] 2xl:grid-cols-[repeat(3,_minmax(0,_470px))]"
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

<style scoped></style>
