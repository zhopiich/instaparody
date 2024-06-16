<template>
  <section class="p-10">
    <div class="mb-2 text-center">
      <span
        class="text-2xl leading-9 break-words whitespace-pre-line font-extrabold"
      >
        This post doesn’t exist.
      </span>
    </div>
    <div>
      <span class="text-base leading-5 break-words whitespace-pre-line">
        {{
          "The link you followed may be broken, or the page may have been removed. "
        }}
        <router-link
          to="/"
          class="text-neutral-600 hover:text-neutral-400 active:text-neutral-700"
          >Go back to home page.</router-link
        >
      </span>
    </div>
  </section>
</template>

<script setup></script>
