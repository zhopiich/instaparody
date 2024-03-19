<template>
  <div class="absolute left-0 bottom-0 -translate-x-full">
    <button class="btn" @click="handleDelete">X</button>
  </div>
</template>

<script setup>
import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

const props = defineProps(["id", "isLast"]);

const handleDelete = () => {
  messageStore.deleteMessage(props.id, props.isLast);
};
</script>

<style scoped></style>
