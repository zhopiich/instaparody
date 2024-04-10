<template>
  <div
    class="flex items-center justify-center h-9 aspect-square rounded-full cursor-pointer hover:bg-sky-200/50 transition-colors *:pointer-events-none"
  >
    <FontAwesomeIcon :icon="faEllipsis" class="fa-lg text-neutral-400" />
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
</script>

<style scoped></style>
