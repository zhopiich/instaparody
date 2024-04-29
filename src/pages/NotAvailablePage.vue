<template>
  <div class="w-screen px-10 py-14 flex flex-col">
    <div class="">
      <span class="text-2xl font-semibold"
        >Sorry, this page isn't available.</span
      >
    </div>

    <div class="mt-10 mb-5">
      <span class="text-base font-normal"
        >The link you followed may be broken, or the page may have been removed.
        <router-link
          to="/"
          class="text-neutral-600 hover:text-neutral-400 active:text-neutral-700"
          >Go back to home page.</router-link
        ></span
      >
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
span {
  display: block;
  min-width: 0;
  max-width: 100%;

  text-align: center;
  word-wrap: break-word;
  word-break: break-word;
}
</style>
