<template>
  <div class="globalFlex">
    <template v-if="$route.name !== 'login'">
      <!-- <header class="header"> -->
      <NavBar :isMobile="isMobile" />
      <!-- </header> -->
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
      class="mb-12 md:mb-0"
    >
      &copy; 2023INSTAGRAM FROM MEGA
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

/* .upperContent {
  flex-shrink: 0;
} */

/* .header {
  height: fit-content;
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.08);
} */

footer {
  text-align: center;
  margin-top: 24px;
  padding-bottom: 8px;
  color: #828282;
  width: 100%;
  /* position: absolute; */
  /* bottom: 0; */
  /* pointer-events: initial; */
  z-index: 0;
}
</style>
