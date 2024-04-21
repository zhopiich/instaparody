<template>
  <time
    class="text-sm leading-3 text-gray-500 py-2 px-3 -my-2 -mx-3"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    >{{ timeDisplay }}</time
  >
</template>

<script setup>
import { dateToRelative } from "../../utils/date";

import { ref, computed, onMounted } from "vue";

const props = defineProps(["timestamp"]);

const isHovered = ref(false);

const timeDisplay = computed(() =>
  dateToRelative(props.timestamp, {
    short: true,
    interval: isHovered.value ? null : "week",
  })
);
</script>

<style scoped></style>
