import { createRouter, createWebHistory } from "vue-router";
// import { getJwtToken } from "./apis/auth";
import { ref, computed, watch } from "vue";
import { useUserStore } from "./stores/user.js";
import { usePostStore } from "./stores/post.js";
import { useMessageStore } from "./stores/message.js";

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
    path: "/messages/:chatId?",
    name: "messages",
    component: () => import("./pages/MessagesPage.vue"),
    beforeEnter: (to, from) => {
      if (from.name !== undefined) {
        const messageStore = useMessageStore();
        messageStore.triggerUnSubMessages();
        messageStore.cleanChat();
        messageStore.resetNewMessages();

        // messageStore.enterChat(false);
      }

      if (to.params.chatId) {
        const messageStore = useMessageStore();
        messageStore.setCurrentChat(to.params.chatId);
        messageStore.loadMessages(to.params.chatId);

        // messageStore.enterChat(true);
      }
    },
  },
  {
    path: "/post/:postId?",
    name: "postDetails",
    component: () => import("./pages/PostDetailsPage.vue"),
    beforeEnter: (to, from) => {
      if (!to.params.postId) {
        return {
          name: "NotAvailable",
          params: { pathMatch: to.path.substring(1).split("/") },
        };
      }

      if (from.name !== "comments" || from.params.postId !== to.params.postId) {
        const postStore = usePostStore();
        postStore.loadPostDetails(to.params.postId);
      }
    },
  },
  {
    path: "/post/:postId?/comments",
    name: "comments",
    component: () => import("./pages/CommentsPage.vue"),
    beforeEnter: (to, from) => {
      if (
        from.name !== "postDetails" ||
        from.params.postId !== to.params.postId
      ) {
        const postStore = usePostStore();
        postStore.loadPostDetails(to.params.postId);
      }
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
    path: "/:username/:tab?",
    name: "profile",
    component: () => import("./pages/ProfilePage.vue"),
    beforeEnter: (to, from) => {
      const userStore = useUserStore();
      if (!userStore.isLoggedIn && to.params.tab === "saved") {
        return {
          name: "profile",
          params: { username: to.params.username, tab: "" },
        };
      }
    },
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
