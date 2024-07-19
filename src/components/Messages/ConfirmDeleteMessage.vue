<template>
  <ConfirmModal @close="emits('close')" @action="emits('delete')">
    <template #header>Delete message?</template>
    <template #content
      >Your contact will not be able to see it anymore.</template
    >
    <template #action>Delete</template>
  </ConfirmModal>
</template>

<script setup>
import ConfirmModal from "../ConfirmModal.vue";

const emits = defineEmits(["delete", "close"]);
</script>

<style scoped></style>
