<template>
  <div class="globalFlex" :class="{ inside: $route.name === 'login' }">
    <!-- <div class="upperContent"> -->
    <template v-if="$route.name !== 'login'">
      <!-- <header class="header"> -->
      <NavBar />
      <!-- </header> -->
      <TheLayout>
        <router-view></router-view>
      </TheLayout>

      <MessagesContainer />
    </template>

    <template v-else>
      <router-view></router-view>
    </template>
    <!-- </div> -->

    <footer :class="{ inside: $route.name === 'login' }">
      <!-- <footer class="footer"> -->
      &copy; 2023INSTAGRAM FROM MEGA
    </footer>
  </div>
</template>

<script setup>
import "./assets/base.css";
import NavBar from "./components/NavBar.vue";
import TheLayout from "./components/TheLayout.vue";
// import TheIcon from "./components/TheIcon.vue";
import MessagesContainer from "./components/Messages/MessagesContainer.vue";
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
  /* align-self: flex-end; */
  /* margin-top: auto; */
  padding-bottom: 8px;
  color: #828282;
  width: 100%;
  position: absolute;
  bottom: 0;
  /* pointer-events: initial; */
  z-index: 0;
}
</style>
