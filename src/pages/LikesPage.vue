<template>
  <div
    v-if="list && list !== 'noSuchPost'"
    class="likesHeight w-full flex flex-col md:border-b"
    :class="{ mobile: isMobile }"
  >
    <div v-if="isMobile" class="shrink-0 h-[45px]">
      <div class="w-full fixed top-0 h-[45px] border-b bg-white z-[1]">
        <div class="size-full px-1 flex">
          <div class="flex items-center">
            <div
              class="flex items-center justify-center h-9 aspect-square rounded-full cursor-pointer hover:bg-neutral-300/50 active:bg-neutral-300/35 active:text-neutral-500 transition-colors"
              @click="back"
            >
              <FontAwesomeIcon
                :icon="faXmark"
                class="fa-xl scale-75 pointer-events-none"
              />
            </div>
          </div>

          <div class="flex-1 flex justify-center items-center">
            <h1 class="font-semibold">Likes</h1>
          </div>

          <div class="flex items-center">
            <div class="h-9 aspect-square"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="grow basis-0 overflow-auto">
      <div v-for="user in list">
        <div class="flex items-center justify-between px-4 py-2">
          <div class="">
            <UserPlate
              :isCardFixed="true"
              :user="{
                username: user.username,
                avatar: user.avatar,
                displayName: user.displayName,
                userId: user.userId,
              }"
              :widthAvatar="12"
            />
          </div>

          <div class="flex items-center">
            <div
              v-if="user.userId !== userStore.user.uid"
              class="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-400 rounded-md cursor-pointer"
              :class="{
                'bg-sky-200 pointer-events-none': !userStore.isLoggedIn,
              }"
              @click="
                enterChat({
                  username: user.username,
                  userId: user.userId,
                  avatar: user.avatar,
                  displayName: user.displayName,
                })
              "
            >
              <p class="text-white text-sm select-none">Message</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <template v-else-if="list">
    <NoSuchPost />
  </template>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import UserPlate from "../components/UserPlate.vue";
import NoSuchPost from "../components/NoSuchPost.vue";

import { computed, watch } from "vue";
import {
  useRoute,
  useRouter,
  onBeforeRouteUpdate,
  onBeforeRouteLeave,
} from "vue-router";

const route = useRoute();
const router = useRouter();

import { useMediaQueryStore } from "../stores/mediaQuery";
const mediaQueryStore = useMediaQueryStore();
const isMobile = computed(() => mediaQueryStore.isMobile);

import { useUserStore } from "../stores/user";
const userStore = useUserStore();

import { usePostStore } from "../stores/post";
const postStore = usePostStore();

import { useMessageStore } from "../stores/message";
const messageStore = useMessageStore();

const list = computed(() => postStore.usersLike);

const profilePageURL = (username) => {
  return "/" + username;
};

const enterChat = async ({ ...userInfo }) => {
  const chatId = await messageStore.addContact({ ...userInfo });

  router.push("/messages/" + chatId);
};

let prevPath;
watch(
  () => route.params.postId,
  () => {
    prevPath = router.options.history.state.back;
  },
  { immediate: true }
);

const back = () => {
  if (prevPath) {
    router.back();
  } else {
    router.push("/post/" + route.params.postId);
  }
};

onBeforeRouteUpdate((to) => {
  postStore.cleanUsersLike();

  if (!to.params.postId) return;
  postStore.getUsersLike(to.params.postId);
});

onBeforeRouteLeave((to) => {
  postStore.cleanUsersLike();
});
</script>

<style scoped>
.likesHeight {
  height: calc(100dvh - 160px);
}

.likesHeight.mobile {
  height: calc(100dvh - 49px);
}
</style>
