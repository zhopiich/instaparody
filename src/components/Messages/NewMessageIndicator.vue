<template>
  <div class="flex items-center mb-3 px-4">
    <div class="flex-grow bg bg-red-400/60 h-[1px]"></div>
    <div class="flex-grow-0 mx-1.5 text-red-600/80">
      {{ display }}
    </div>
    <div class="flex-grow bg bg-red-400/60 h-[1px]"></div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";

const emit = defineEmits(["mounted"]);

const props = defineProps(["isMoreThanOne"]);

const display = computed(() =>
  !props.isMoreThanOne ? "A new message following" : "New messages following"
);

onMounted(() => {
  emit("mounted");
});
</script>

<style lang="scss" scoped></style>
