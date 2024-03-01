import { createApp } from "vue";
import { useUserStore } from "./stores/user.js";
import { createPinia } from "pinia";
import { router } from "./routes";

import "./style.css";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);

const userStore = useUserStore();
const iniUser = async () => {
  await userStore.initializeAuthListener();
  //
  userStore.getUserDoc();

  app.use(router);

  app.mount("#app");
};

iniUser();
