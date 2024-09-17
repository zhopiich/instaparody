<template>
  <div
    v-if="post && post !== 'noSuchPost'"
    :class="{ 'flex flex-col': isMobile }"
  >
    <div v-if="isMobile" class="relative h-[45px]">
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
            <h1 class="font-semibold">Post</h1>
          </div>

          <div class="flex items-center">
            <div class="h-9 aspect-square"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="detailsContainer md:aspect-[1.62/1]">
      <div
        class="w-full h-full flex flex-col md:flex-row relative *:pointer-events-auto"
      >
        <div v-if="isMobile" class="grow-0 px-4 py-2.5 flex" id="@aaa">
          <div class="grow">
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

          <div v-if="isMe" class="flex items-center">
            <postMoreButton
              :postId="postId"
              :desc="post.description"
              :images="post.images"
              :prevPath="prevPath"
            />
          </div>
        </div>

        <div
          class="imageFrame overflow-hidden aspect-square"
          :class="isMobile ? 'w-full' : 'h-full'"
        >
          <div class="size-full relative bg-black">
            <!-- <img
              v-if="post.image || post.images.length === 1"
              class="size-full object-cover"
              :src="post.image || post.images[0]"
              alt="Image posted"
            /> -->
            <ImageCarousel :imagesUrl="post.images" />
          </div>
        </div>

        <div
          class="postInfo relative"
          :class="{
            'w-0 grow border border-t-0 border-gray-300 overflow-hidden h-full':
              !isMobile,
          }"
        >
          <div class="h-full bg-white flex flex-col">
            <div v-if="!isMobile" class="grow-0 px-4 py-2.5 flex">
              <div class="grow">
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

              <div v-if="isMe" class="flex items-center">
                <postMoreButton
                  :postId="postId"
                  :desc="post.description"
                  :images="post.images"
                  :prevPath="prevPath"
                />
              </div>
            </div>

            <div v-if="!isMobile" class="flex-auto border-t overflow-auto">
              <div class="px-4 h-full flex flex-col">
                <div class="py-4">
                  <pre class="font-sans break-words whitespace-pre-wrap">{{
                    post.description
                  }}</pre>
                </div>
                <div class="grow">
                  <CommentsList :postId="postId" />
                </div>
              </div>
            </div>

            <div class="shrink-0 md:border-t">
              <div
                class="px-4 flex justify-start"
                :class="isMobile ? 'py-2' : 'py-1'"
              >
                <div class="-ml-2">
                  <LikeButton
                    :post="post"
                    :isDisabled="!userStore.isLoggedIn"
                  />
                </div>
                <div class="">
                  <CommentButton
                    :post="post"
                    :isDisabled="!userStore.isLoggedIn"
                    @focusInput="commentInput.focus()"
                    :isToPage="isMobile"
                  />
                </div>
                <div class="-mr-2.5 ml-auto">
                  <SaveButton
                    :post="post"
                    :isDisabled="!userStore.isLoggedIn"
                  />
                </div>
              </div>

              <div class="px-4" :class="isMobile ? 'pb-2' : 'pb-0'">
                <LikesCountBanner :post="post" />
              </div>

              <div v-if="isMobile">
                <div class="px-4 pb-1">
                  <p class="font-sans break-words whitespace-pre-wrap">
                    {{ descDisplay }}
                    <span
                      v-if="
                        post.description.length > maxDescLength && isDescFolded
                      "
                      class="text-gray-500 cursor-pointer"
                      @click="isDescFolded = false"
                      >more</span
                    >
                  </p>
                </div>
              </div>

              <div v-if="userStore.isLoggedIn && isMobile" class="px-4 pb-2">
                <div
                  class="mt-1 *:text-gray-500 *:leading-5 *:cursor-pointer *:text-sm flex items-center"
                >
                  <router-link :to="commentsLink">
                    <span v-if="post.comments === 0" @click="">
                      Make the first comment
                    </span>
                    <span v-else @click="">
                      {{
                        "View " +
                        `${
                          post.comments === 1
                            ? "the "
                            : "all " + post.comments + " "
                        }` +
                        "comment" +
                        `${post.comments > 1 ? "s" : ""}`
                      }}
                    </span>
                  </router-link>
                </div>
              </div>

              <div class="px-4 pb-2 leading-4">
                <TimeBanner
                  :timestamp="post.createdAt?.seconds"
                  :isKeptFull="isMobile && route.name === 'postDetails'"
                />
              </div>
            </div>

            <div
              v-if="userStore.isLoggedIn && !isMobile"
              class="shrink-0 border-t border-gray-300"
            >
              <CommentInput
                :postId="postId"
                :postCreatedBy="postCreatedBy"
                @setInputRef="setInputRef"
                @focus="commentInput.focus()"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <template v-else-if="post">
    <NoSuchPost />
  </template>
</template>

<script setup>
// const getUUID = () => window.crypto.randomUUID();

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import ImageCarousel from "../components/ImageCarousel.vue";
import UserPlate from "../components/UserPlate.vue";
import CommentsList from "../components/CommentsList.vue";
import CommentInput from "../components/CommentInput.vue";
import LikeButton from "../components/PostButtons/LikeButton.vue";
import CommentButton from "../components/PostButtons/CommentButton.vue";
import SaveButton from "../components/PostButtons/SaveButton.vue";
import LikesCountBanner from "../components/PostButtons/LikesCountBanner.vue";
import TimeBanner from "../components/PostButtons/TimeBanner.vue";
import NoSuchPost from "../components/NoSuchPost.vue";
import postMoreButton from "../components/PostButtons/postMoreButton.vue";

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
const isMe = computed(
  () => post.value.createdBy?.userId === userStore.user?.uid
);

const commentInput = ref(null);
const setInputRef = (val) => {
  commentInput.value = val;
};

// const postImages = computed(() =>
//   post.value.images && post.value.images.length > 1
//     ? post.value.images.map((image) => ({
//         url: image,
//         id: getUUID(),
//       }))
//     : null
// );

const postId = computed(() => route.params.postId);
const postCreatedBy = computed(() => post.value?.createdBy?.userId);

const maxDescLength = 90;
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

const commentsLink = computed(
  () => "/post/" + route.params.postId + "/comments"
);

const prevPath = ref(null);
watch(
  () => route.params.postId,
  () => {
    prevPath.value = router.options.history.state.back;
  },
  { immediate: true }
);

const back = () => {
  if (
    prevPath.value &&
    (prevPath.value.endsWith("/")
      ? prevPath.value.slice(0, -1)
      : prevPath.value) !==
      "/post/" + route.params.postId + "/comments"
  ) {
    router.back();
  } else {
    router.push("/");
  }
};

watch(
  () => postStore.documentTitle,
  (newVal) => {
    if (!newVal) return;
    document.title = newVal;
  },
  { immediate: true }
);

onBeforeRouteUpdate((to) => {
  postStore.resetPostDetailsPage();

  isDescFolded.value = true;

  if (!to.params.postId) return;
  postStore.loadPostDetails(to.params.postId);
});

onBeforeRouteLeave((to) => {
  if (
    to.name === "comments" &&
    to.params.postId &&
    to.params.postId === route.params.postId
  )
    return;

  postStore.resetPostDetailsPage();
});
</script>

<style scoped>
.detailsContainer {
  width: min(100dvw, 1100px);
}
</style>
