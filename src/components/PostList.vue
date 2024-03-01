<template>
  <div v-if="postsStatus === 'loading'" class="loading">Loading...</div>
  <div v-else-if="postsStatus === 'error'" class="error">Error</div>
  <div v-else-if="postsStatus === 'empty'" class="nopost">No post</div>
  <!-- <div v-else-if="isResultEmpty" class="noresult">No result</div> -->
  <div v-else class="postList">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  // isError: { type: Boolean, default: false },
  // isPostsEmpty: { type: Boolean, default: false },
  // isResultEmpty: { type: Boolean, default: false },
  postsStatus: { type: String },
});
</script>

<style scoped>
.loading,
.error,
.nopost,
.noresult {
  @apply font-sans text-lg text-zinc-400;
}
.postList {
  /* display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px; */
  width: fit-content;
  @apply flex flex-col gap-y-8 md:grid md:grid-cols-2 md:gap-8 2xl:grid-cols-3;
}
</style>
