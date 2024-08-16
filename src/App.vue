<template>
  <div class="globalFlex">
    <template v-if="$route.name !== 'login' && $route.name !== 'signup'">
      <NavBar :isMobile="isMobile" />

      <TheLayout>
        <Alert />
        <router-view></router-view>
      </TheLayout>

      <MessagesContainer v-if="$route.name !== 'messages' && !isMobile" />
    </template>

    <template v-else>
      <router-view></router-view>
    </template>

    <footer
      v-if="
        $route.name !== 'messages' &&
        $route.name !== 'comments' &&
        $route.name !== 'likes'
      "
      class="mt-6 mb-2 flex justify-center z-0"
      :class="
        isMobile && $route.name !== 'login' && $route.name !== 'signup'
          ? 'mb-12'
          : 'mb-0'
      "
    >
      <span class="text-xs text-neutral-500"
        >&copy; 2024 Instaparody from Mega</span
      >
    </footer>
  </div>
</template>

<script setup>
import "./assets/base.css";
import NavBar from "./components/NavBar.vue";
import TheLayout from "./components/TheLayout.vue";
import MessagesContainer from "./components/Messages/MessagesContainer.vue";
import Alert from "./components/Alert/Alert.vue";

import { computed, onMounted } from "vue";

import { useMediaQueryStore } from "./stores/mediaQuery";
const mediaQueryStore = useMediaQueryStore();
const isMobile = computed(() => mediaQueryStore.isMobile);

import { useMessageStore } from "./stores/message";
const messageStore = useMessageStore();

onMounted(() => {
  mediaQueryStore.setListener();

  messageStore.loadContacts();
});
</script>

<style>
@media (min-width: 768px) {
  body {
    scrollbar-gutter: stable;
  }
}

body {
  height: 100dvh;
  overflow: auto;
}
</style>
<style scoped>
.globalFlex {
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 100dvh;
}
</style>
