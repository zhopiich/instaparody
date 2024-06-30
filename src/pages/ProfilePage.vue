<template>
  <div class="py-12 md:py-14 md:px-5 w-full max-w-[975px]">
    <UserInfo
      :user="user"
      :isMobile="isMobile"
      :isMe="isMe"
      :isLoggedIn="userStore.isLoggedIn"
    />

    <div class="border-t">
      <div
        v-if="user !== 'noSuchUser'"
        class="border-b md:border-b-0 flex justify-center items-center md:gap-14"
      >
        <div
          v-for="tab in tabs"
          class="grow md:grow-0 h-11 md:h-[52px] flex justify-center items-center cursor-pointer"
          :class="
            tab.type === currentTab
              ? ' border-t border-black -mt-[1px] *:text-blue-500 *:md:text-black'
              : '*:hover:text-neutral-400 *:active:text-neutral-300'
          "
          :key="tab.type"
          @click="switchTab(tab)"
        >
          <div class="flex items-center text-neutral-500">
            <FontAwesomeIcon :icon="tab.icon" class="text-2xl md:text-base" />
            <span class="ml-1.5 text-sm font-semibold hidden md:block">{{
              tab.label
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="currentTab === 'saved' && postsStatus !== 'loading'"
      class="h-16 flex"
    >
      <div class="mt-8 mb-4 flex">
        <span class="whitespace-nowrap text-xs text-gray-500">
          Only you can see what you've saved
        </span>
      </div>
    </div>
    <PostImageList
      v-if="user !== 'noSuchUser'"
      :postsStatus="postsStatus"
      :userStatus="user"
    >
      <PostImageItem
        v-for="post in posts"
        :post="post"
        :key="post.id"
        :isLikedOrSaved="currentTab !== 'created'"
      />
    </PostImageList>
  </div>

  <PostDetails
    v-if="isShowPostDetails"
    :isLikedOrSaved="currentTab !== 'created'"
  />
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faTableCells } from "@fortawesome/free-solid-svg-icons";
import { faHeart, faBookmark } from "@fortawesome/free-regular-svg-icons";

import UserInfo from "../components/UserInfo.vue";
import PostImageList from "../components/PostImageList.vue";
import PostImageItem from "../components/PostImageItem.vue";
import PostDetails from "../components/PostDetails.vue";

import { ref, computed, watch, onBeforeMount } from "vue";
import {
  useRoute,
  useRouter,
  onBeforeRouteUpdate,
  onBeforeRouteLeave,
} from "vue-router";

const route = useRoute();
const router = useRouter();

import { usePostStore } from "../stores/post";
import { useUserStore } from "../stores/user";

import { useMediaQueryStore } from "../stores/mediaQuery";
const mediaQueryStore = useMediaQueryStore();
const isMobile = computed(() => mediaQueryStore.isMobile);

// Posts
const postStore = usePostStore();
const isShowPostDetails = computed(() => postStore.isShowPostDetails);

const postsFiltered = (() => {
  const obj = {};

  for (const type of ["created", "liked", "saved"]) {
    obj[type] = computed(() => postStore.postsFiltered[type]);
  }

  return obj;
})();

const posts = computed(() => postsFiltered[currentTab.value].value);

const postsStatus = computed(() => {
  if (!posts.value) return "loading";
  if (posts.value === "error") return "error";
  if (posts.value.length === 0) return "empty";
});

// Tabs
const tabs = computed(() =>
  [
    {
      label: "POSTS",
      icon: faTableCells,
      type: "created",
    },
    {
      label: "LIKED",
      icon: faHeart,
      type: "liked",
    },
    {
      label: "SAVED",
      icon: faBookmark,
      type: "saved",
    },
  ].filter((tab) => !(tab.type === "saved" && !isMe.value))
);

const currentTab = ref(null);

const switchTab = (tab) => {
  const toTab = tab.type === "created" ? "" : tab.type;

  router.push({
    name: "profile",
    params: { username: route.params.username, tab: toTab },
  });
};

// User info
const userStore = useUserStore();

const isMe = ref(null);

const user = computed(() => {
  if (isMe.value === null) return;

  if (isMe.value) {
    return userStore.userDoc;
  } else {
    return userStore.otherUserDoc;
  }
});

const getTabFromRoute = (param) =>
  ["liked", "saved"].some((type) => param === type) ? param : "created";

onBeforeMount(async () => {
  currentTab.value = getTabFromRoute(route.params.tab);

  // hold saved posts until userStore.userDoc has been resolved
  if (currentTab.value !== "saved") {
    postStore.loadPostsFiltered(currentTab.value, {
      username: route.params.username,
    });
  }

  if (userStore.isLoggedIn) {
    const loadPostsSaved = () => {
      if (currentTab.value !== "saved") return;

      if (isMe.value) {
        postStore.loadPostsFiltered("saved", {
          // Firebase security rules that make the documents
          // accessible only to their creator require uid
          userId: userStore.user.uid,
        });
      } else {
        router.replace({
          name: "profile",
          params: { username: route.params.username, tab: "" },
        });
      }
    };

    const userDocOfMine = computed(() => userStore.userDoc);

    if (!userDocOfMine.value) {
      watch(
        userDocOfMine,
        (newVal) => {
          isMe.value = newVal.username === route.params.username;
          if (!isMe.value) userStore.getOtherUserDoc(route.params.username);

          loadPostsSaved();
        },
        { once: true }
      );
    } else {
      isMe.value = userDocOfMine.value.username === route.params.username;
      if (!isMe.value) userStore.getOtherUserDoc(route.params.username);

      loadPostsSaved();
    }
  } else {
    isMe.value = false;
    userStore.getOtherUserDoc(route.params.username);
  }
});

let lastVisitedUser;

onBeforeRouteUpdate((to, from) => {
  if (
    to.params.username !== from.params.username &&
    lastVisitedUser !== from.params.username
  ) {
    postStore.cleanPostsFiltered();
    postStore.triggerUnSubFiltered();

    isMe.value =
      userStore.isLoggedIn && userStore.userDoc.username === to.params.username;

    if (!isMe.value) {
      userStore.getOtherUserDoc(to.params.username);
    }

    lastVisitedUser = from.params.username;
  }

  currentTab.value = getTabFromRoute(to.params.tab);

  if (currentTab.value !== "saved") {
    postStore.loadPostsFiltered(currentTab.value, {
      username: to.params.username,
    });
  } else {
    if (isMe.value) {
      postStore.loadPostsFiltered("saved", {
        userId: userStore.user.uid,
      });
    } else {
      if (to.params.username === from.params.username) {
        currentTab.value = "created";
      }

      router.push({
        name: "profile",
        params: { username: to.params.username, tab: "" },
      });
    }
  }
});

onBeforeRouteLeave(() => {
  postStore.cleanPostsFiltered();
  postStore.triggerUnSubFiltered();
});
</script>

<style scoped></style>
