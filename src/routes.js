import { createRouter, createWebHistory } from "vue-router";
// import { getJwtToken } from "./apis/auth";
import { ref, computed, watch } from "vue";
import { useUserStore } from "./stores/user.js";
import { usePostStore } from "./stores/post";

import { auth } from "./firebase/firebase.js";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("./pages/HomePage.vue"),
    beforeEnter: (to, from) => {
      const postStore = usePostStore();
      postStore.loadPostsAll();
      console.log("before Enter Home");
    },
  },

  {
    path: "/profile/edit",
    name: "profileEdit",
    component: () => import("./pages/ProfileEditingPage.vue"),
    beforeEnter: (to, from) => {
      const userStore = useUserStore();

      if (!userStore.isLoggedIn) {
        return { name: "login" };
      }
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./pages/LoginPage.vue"),
    beforeEnter: (to, from) => {
      const userStore = useUserStore();

      if (userStore.isLoggedIn) {
        return { name: "home" };
      }
    },
  },
  {
    path: "/:username",
    name: "profile",
    component: () => import("./pages/ProfilePage.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotAvailable",
    component: () => import("./pages/NotAvailablePage.vue"),
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach(async (to, from) => {
  if (to.name === "profile" && to.params.username === "profile") {
    return {
      name: "NotAvailable",
      params: { pathMatch: to.path.substring(1).split("/") },
    };
  }
});

export { router };
