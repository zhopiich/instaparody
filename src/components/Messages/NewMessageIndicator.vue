<template>
  <div class="flex items-center pb-2 bg-slate-100/60">
    <div class="flex-grow bg-neutral-200 h-[1px]"></div>
    <div class="flex-grow-0 mx-1.5">
      <p class="text-neutral-400 text-sm">{{ display }}</p>
    </div>
    <div class="flex-grow bg-neutral-200 h-[1px]"></div>
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
