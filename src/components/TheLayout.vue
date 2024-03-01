<template>
  <div class="content">
    <slot></slot>
  </div>
</template>

<script setup></script>

<style scoped>
.content {
  /* width: 80vw; */
  /* max-width: 1124px; */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 88px auto;
  /* margin-top: 88px;
  padding-bottom: 80px; */
}
</style>
