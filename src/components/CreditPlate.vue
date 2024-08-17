<template>
  <div class="flex justify-end">
    <div
      class="container w-fit flex rounded-lg overflow-hidden hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
      :class="{ border: isMobile }"
    >
      <a
        :href="repoUrl"
        rel="noopener noreferrer nofollow"
        target="_blank"
        class="flex"
      >
        <div class="p-2 flex gap-2 *:select-none">
          <span class="text-neutral-500"
            >Made by <span class="font-bold">{{ developer }}</span>
          </span>

          <FontAwesomeIcon :icon="faGithub" class="text-2xl text-neutral-600" />
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

defineProps(["isMobile"]);

import { ref } from "vue";

const developer = ref("zhopiich");
const repoUrl = ref("https://github.com/zhopiich/instaparody");
</script>

<style scoped>
.container:hover {
  span,
  svg {
    color: #525252;
  }
}
</style>
