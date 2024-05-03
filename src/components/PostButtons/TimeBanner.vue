<template>
  <time
    class="text-gray-500 py-2 pr-3 -my-2 -mr-3"
    :class="`text-${fontSize} leading-${lineHeight}`"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    >{{ timeDisplay }}</time
  >
</template>

<script setup>
import { dateToRelative } from "../../utils/date";

import { ref, computed, onMounted } from "vue";

const props = defineProps({
  timestamp: { type: Number },
  "font-size": { type: String, default: "sm" },
  "line-height": { type: Number, default: 3 },
});

const isHovered = ref(false);

const timeDisplay = computed(() =>
  dateToRelative(props.timestamp, {
    short: true,
    interval: isHovered.value ? null : "week",
  })
);
</script>

<style scoped></style>
