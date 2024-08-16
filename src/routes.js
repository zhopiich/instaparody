import { createRouter, createWebHistory } from "vue-router";
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
    meta: { title: "Messages" },
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
    path: "/post/:postId?/liked_by",
    name: "likes",
    component: () => import("./pages/LikesPage.vue"),
    beforeEnter: (to, from) => {
      const postStore = usePostStore();
      postStore.getUsersLike(to.params.postId, { isToBeChecked: true });
    },
    meta: { title: "Likes" },
  },
  {
    path: "/profile/edit",
    name: "profileEdit",
    component: () => import("./pages/ProfileEditingPage.vue"),
    meta: { title: "Edit profile", requiresAuth: true },
  },
  {
    path: "/change_password",
    name: "changePassword",
    component: () => import("./pages/ChangePasswordPage.vue"),
    meta: { title: "Change password", requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./pages/LoginPage.vue"),
    meta: { title: "Login", requiresUnauth: true },
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("./pages/SignUpPage.vue"),
    meta: { title: "Sign up", requiresUnauth: true },
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
    meta: { title: "Page not found" },
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

const name = "Instaparody";
const getTitle = (route) => route + " • " + name;

router.beforeEach(async (to, from) => {
  const userStore = useUserStore();
  if (
    (to.meta.requiresAuth && !userStore.isLoggedIn) ||
    (to.meta.requiresUnauth && userStore.isLoggedIn)
  ) {
    return { name: "home" };
  }

  if (to.name === "home") {
    document.title = name;
  }
  if (to.meta.title) {
    switch (to.name) {
      case "messages":
        if (!to.params.chatId) document.title = getTitle(to.meta.title);
        break;
      default:
        document.title = getTitle(to.meta.title);
    }
  }
  if (to.params.username) {
    document.title = getTitle("@" + to.params.username);
  }

  if (to.name === "profile" && to.params.username === "profile") {
    return {
      name: "NotAvailable",
      params: { pathMatch: to.path.substring(1).split("/") },
    };
  }
});

export { router };
