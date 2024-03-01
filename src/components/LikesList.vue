<template>
  <div>
    <TheModal @close="$emit('close')" :stack="2">
      <!--  -->
      <div class="postUpload">
        <div style="width: 300px; height: 150px">AAA</div>
        <div style="width: 300px; height: 150px">BBB</div>
      </div>
      <!--  -->
    </TheModal>
  </div>
</template>

<script setup>
import TheModal from "./TheModal.vue";

defineEmits(["close"]);
</script>

<style scoped></style>
