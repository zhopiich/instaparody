// import HomePage from "./pages/HomePage.vue";
// import LoginPage from "./pages/LoginPage.vue";
// import ProfilePage from "./pages/ProfilePage.vue";
// import ProfileEdittingPage from "./pages/ProfileEdittingPage.vue";
// import SearchPage from "./pages/SearchPage.vue";

import { createRouter, createWebHistory } from "vue-router";
// import { getJwtToken } from "./apis/auth";
import { ref, computed } from "vue";
import { useUserStore } from "./stores/user.js";
import { usePostStore } from "./stores/post";

import { auth } from "./firebase/firebase.js";

const routes = [
  {
    path: "/",
    name: "home",
    // component: HomePage,
    component: () => import("./pages/HomePage.vue"),
    beforeEnter: (to, from) => {
      const postStore = usePostStore();
      postStore.loadPostsAll();
    },
  },
  {
    path: "/search",
    name: "search_result",
    component: () => import("./pages/SearchPage.vue"),
    beforeEnter: (to) => {
      if (!to.query.q) return { name: "home" };
    },
    props: (route) => ({ query: route.query.q }),
  },
  // {
  //   path: "/profile",
  //   name: "profile",
  //   component: () => import("./pages/ProfilePage.vue"),
  //   // beforeEnter: (to, from) => {
  //   //   const postStore = usePostStore();
  //   //   // postStore.loadPostsAll();
  //   //   postStore.loadPostsFiltered("created");
  //   // },
  // },
  {
    path: "/:username",
    name: "profile",
    component: () => import("./pages/ProfilePage.vue"),
    beforeEnter: (to, from) => {
      //   const userStore = useUserStore();
      //   if (
      //     !userStore.userDoc ||
      //     userStore.userDoc.username !== to.params.username
      //   ) {
      //     userStore.getOtherUserDoc(to.params.username);
      //   }
    },
  },
  {
    path: "/profile/edit",
    name: "profileEdit",
    component: () => import("./pages/ProfileEdittingPage.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./pages/LoginPage.vue"),
    beforeEnter: (to, from) => {
      //
      const userStore = useUserStore();
      const user = computed(() => userStore.user);

      // if (to.name !== "login" && !user.value) {
      //   return { name: "login" };
      // }
      if (user.value && user.value !== "guest") {
        return { name: "home" };
      }
    },
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

// redirect unloggedin/loggedin user
// to the login/home page
// router.beforeEach(async (to, from) => {
//   const userStore = useUserStore();
//   const user = computed(() => userStore.user);

//   // if (to.name !== "login" && !user.value) {
//   //   return { name: "login" };
//   // }
//   if (to.name === "login" && user.value) {
//     return { name: "home" };
//   }
// });

export { router };
