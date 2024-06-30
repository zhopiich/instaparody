<template>
  <div
    v-if="post && post !== 'noSuchPost'"
    class="commentsHeight w-full flex flex-col md:border-b"
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
                :icon="faArrowLeft"
                class="fa-xl scale-75 pointer-events-none"
              />
            </div>
          </div>

          <div class="flex-1 flex justify-center items-center">
            <h1 class="font-semibold">Comments</h1>
          </div>

          <div class="flex items-center">
            <div class="h-9 aspect-square"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="detailsContainer grow shrink h-0">
      <div class="size-full overflow-auto">
        <div class="h-full flex flex-col items-stretch">
          <div class="grow-0 px-4 py-2.5 flex">
            <UserPlate
              :isCardFixed="true"
              :user="{
                username: post.createdBy.username,
                avatar: post.createdBy.avatar,
                displayName: post.createdBy.displayName,
                userId: post.createdBy.userId,
              }"
              :widthAvatar="12"
              :gap="2"
            />
          </div>

          <div class="px-4">
            <p class="font-sans break-words whitespace-pre-wrap">
              {{ descDisplay }}
              <span
                v-if="post.description.length > maxDescLength && isDescFolded"
                class="text-gray-500 cursor-pointer"
                @click="isDescFolded = false"
                >more</span
              >
            </p>
          </div>

          <div class="px-4 pt-1 pb-2 leading-4">
            <TimeBanner
              :timestamp="post.createdAt?.seconds"
              :isKeptFull="true"
            />
          </div>

          <div class="pt-2 mb-4 border-b border-gray-300 h-0"></div>

          <div class="px-4 grow">
            <CommentsList :postId="postId" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="userStore.isLoggedIn" class="shrink-0 border-t bg-white">
      <CommentInput :postId="postId" :postCreatedBy="postCreatedBy" />
    </div>
  </div>

  <template v-else-if="post">
    <NoSuchPost />
  </template>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import UserPlate from "../components/UserPlate.vue";
import CommentsList from "../components/CommentsList.vue";
import CommentInput from "../components/CommentInput.vue";
import TimeBanner from "../components/PostButtons/TimeBanner.vue";
import NoSuchPost from "../components/NoSuchPost.vue";

import { ref, computed, watch } from "vue";
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

const post = computed(() => postStore.postSnapshot);

const postId = computed(() => route.params.postId);
const postCreatedBy = computed(() => post.value?.createdBy?.userId);

const maxDescLength = 60;
const maxTruncatedWordLength = 10;

const isDescFolded = ref(true);
const descDisplay = computed(() => {
  const desc = post.value.description;

  if (desc.length <= maxDescLength || !isDescFolded.value) return desc;

  const trimmed = desc.substring(0, maxDescLength);

  const lastIndexOfSpace = trimmed.lastIndexOf(" ");

  return (
    (trimmed.length - (lastIndexOfSpace + 1) > maxTruncatedWordLength
      ? trimmed
      : trimmed.substring(0, lastIndexOfSpace)) + "..."
  );
});

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
  postStore.resetPostDetailsPage();

  isDescFolded.value = true;

  if (!to.params.postId) return;
  postStore.loadPostDetails(to.params.postId);
});

onBeforeRouteLeave((to) => {
  if (
    to.name === "postDetails" &&
    to.params.postId &&
    to.params.postId === route.params.postId
  )
    return;

  postStore.resetPostDetailsPage();
});
</script>

<style scoped>
.commentsHeight {
  height: calc(100dvh - 160px);
}

.commentsHeight.mobile {
  height: calc(100dvh - 49px);
}
</style>
