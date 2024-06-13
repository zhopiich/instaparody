<template>
  <div class="flex">
    <div class="px-3">
      <span class="text-white">{{ alertContent }}</span>
    </div>

    <div v-if="alertLink" class="mr-3">
      <router-link :to="alertLink.to" @click="alertStore.closeAlert"
        ><span class="text-white font-bold">{{
          alertLink.name
        }}</span></router-link
      >
    </div>
  </div>
</template>

<script setup>
import { useAlertStore } from "../../stores/alert";
const alertStore = useAlertStore();

import { ref, computed } from "vue";

const alertContent = computed(() => alertStore.alertContent);
const alertLink = computed(() => alertStore.alertLink);
</script>

<style scoped></style>
