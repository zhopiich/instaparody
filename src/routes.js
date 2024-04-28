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
    // component: HomePage,
    component: () => import("./pages/HomePage.vue"),
    beforeEnter: (to, from) => {
      const postStore = usePostStore();
      postStore.loadPostsAll();
    },
  },
  // {
  //   path: "/search",
  //   name: "search_result",
  //   component: () => import("./pages/SearchPage.vue"),
  //   beforeEnter: (to) => {
  //     if (!to.query.q) return { name: "home" };
  //   },
  //   props: (route) => ({ query: route.query.q }),
  // },
  // {
  //   path: "/profile",
  //   beforeEnter: async (to) => {
  //     const userStore = useUserStore();
  //     const userDoc = computed(() => userStore.userDoc);

  //     const waitForUserDoc = (userDoc) => {
  //       return new Promise((resolve) => {
  //         watch(
  //           userDoc,
  //           () => {
  //             console.log("** watch userDoc in router ** ");
  //             // unwatch();
  //             resolve();
  //           },
  //           { once: true }
  //         );
  //       });
  //     };

  //     if (!userDoc.value) {
  //       await waitForUserDoc(userDoc);
  //     }
  //     console.log(userDoc.value.username);

  //     // return { path: "/" + userDoc.value.username };
  //     return { path: "/mika" };
  //   },
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
    component: () => import("./pages/ProfileEditingPage.vue"),
    beforeEnter: (to, from) => {
      //
      const userStore = useUserStore();
      const user = computed(() => userStore.user);

      if (user.value === "guest") {
        return { name: "login" };
      }
    },
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
