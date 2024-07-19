<template>
  <ConfirmModal @close="emits('close')" @action="emits('confirm')">
    <template #header>{{ display.header }}</template>
    <template #content>{{ display.content }}</template>
    <template #action>{{ display.action }}</template>
  </ConfirmModal>
</template>

<script setup>
import ConfirmModal from "../ConfirmModal.vue";

const props = defineProps(["type"]);
const emits = defineEmits(["close", "confirm"]);

import { computed } from "vue";

const typeList = {
  delete: {
    header: "Delete post?",
    content: "Are you sure you want to delete this post?",
    action: "Delete",
  },
  discard: {
    header: "Discard changes?",
    content: "If you leave, your edits won't be saved.",
    action: "Discard",
  },
};

const display = computed(() => typeList[props.type]);
</script>

<style scoped></style>
