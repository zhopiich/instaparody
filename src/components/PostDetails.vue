<template>
  <TheModal
    :customClass="['flex', 'flex-col', 'justify-center', 'items-stretch']"
    :isPointerEventsAuto="false"
    @close="back"
  >
    <div
      class="flex justify-center items-start min-w-0 min-h-0 overflow-y-auto"
    >
      <div class="flex flex-col w-full h-full justify-center items-center my-0">
        <div
          v-if="post !== null"
          class="detailsContainer m-auto h-full"
          :class="{ mobile: isMobile }"
        >
          <div class="flex flex-col h-full max-w-full">
            <div
              class="flex justify-center items-stretch relative *:pointer-events-auto"
              :class="{ 'flex-col': isMobile }"
            >
              <div
                class="imageFrame shrink overflow-hidden"
                :class="
                  isMobile
                    ? 'mobile rounded-t-md'
                    : 'grow aspect-square rounded-l-md'
                "
              >
                <div :class="isMobile ? 'aspect-square' : 'size-full'">
                  <div class="size-full relative bg-black">
                    <div
                      v-if="post === 'noSuchPost'"
                      class="size-full bg-neutral-50"
                    ></div>

                    <template v-else>
                      <!-- <img
                        v-if="post.image || post.images.length === 1"
                        class="size-full object-cover"
                        :src="post.image || post.images[0]"
                        alt="Image posted"
                      /> -->
                      <ImageCarousel :imagesUrl="post.images" />
                    </template>
                  </div>
                </div>
              </div>

              <div
                class="postInfo grow shrink-[2] relative overflow-hidden"
                :class="
                  isMobile
                    ? 'rounded-b-md'
                    : 'rounded-r-md border-l min-w-[405px]'
                "
                :style="{
                  maxWidth: variableWidth,
                  height: variableHeight,
                }"
              >
                <div class="w-full h-full bg-white flex flex-col">
                  <div
                    class="grow-0 px-4 flex"
                    :class="isMobile ? 'pt-2.5' : 'py-2.5'"
                  >
                    <div class="grow">
                      <UserPlate
                        :isCardFixed="true"
                        :user="
                          typeof post === 'object' && post !== null
                            ? {
                                username: post?.createdBy?.username,
                                avatar: post?.createdBy?.avatar,
                                displayName: post?.createdBy?.displayName,
                                userId: post?.createdBy?.userId,
                              }
                            : null
                        "
                        :widthAvatar="12"
                        :gap="2"
                      />
                    </div>

                    <div v-if="isMe" class="flex items-center">
                      <postMoreButton
                        :postId="postId"
                        :desc="post.description"
                        :images="post.images"
                      />
                    </div>
                  </div>
                  <div
                    v-if="!isMobile"
                    class="flex-auto border-t overflow-auto scrollbar-hidden"
                  >
                    <div class="px-4 h-full flex flex-col">
                      <div
                        v-if="post === 'noSuchPost'"
                        class="size-full flex text-center items-center"
                      >
                        <span class="w-full"
                          >The post has been deleted or is not visible to
                          you.</span
                        >
                      </div>

                      <template v-else>
                        <div class="py-4">
                          <pre
                            class="font-sans break-words whitespace-pre-wrap"
                            >{{ post?.description }}</pre
                          >
                        </div>
                        <div class="grow">
                          <CommentsList :postId="postId" />
                        </div>
                      </template>
                    </div>
                  </div>

                  <div class="shrink-0" :class="{ 'border-t': !isMobile }">
                    <div
                      class="px-4 flex justify-start"
                      :class="isMobile ? 'py-0' : 'py-2'"
                    >
                      <div class="-ml-2">
                        <LikeButton
                          :post="post"
                          :isDisabled="
                            !userStore.isLoggedIn || post === 'noSuchPost'
                          "
                        />
                      </div>
                      <div class="">
                        <CommentButton
                          :post="post"
                          :isDisabled="
                            !userStore.isLoggedIn || post === 'noSuchPost'
                          "
                          @focusInput="commentInput.focus()"
                        />
                      </div>
                      <div class="-mr-2.5 ml-auto">
                        <SaveButton
                          :post="post"
                          :isDisabled="
                            !userStore.isLoggedIn || post === 'noSuchPost'
                          "
                        />
                      </div>
                    </div>

                    <div class="px-4" :class="isMobile ? 'pb-0' : 'pb-1'">
                      <div
                        v-if="post === 'noSuchPost'"
                        class="w-12 h-5 bg-neutral-300 rounded-md"
                      ></div>
                      <LikesCountBanner v-else :post="post" />
                    </div>

                    <div v-if="isMobile && post !== 'noSuchPost'" class="px-4">
                      <div
                        class="mt-1 *:text-gray-500 *:leading-5 *:cursor-pointer *:text-base flex items-center"
                      >
                        <span
                          v-if="userStore.isLoggedIn"
                          @click="$router.push('/post/' + postId + '/comments')"
                        >
                          {{
                            post.comments === 0
                              ? "Make the first comment"
                              : "View " +
                                `${
                                  post.comments === 1
                                    ? "the "
                                    : post.comments === 2
                                    ? "both "
                                    : "all " + post.comments + " "
                                }` +
                                "comment" +
                                `${post.comments > 1 ? "s" : ""}`
                          }}
                        </span>
                      </div>
                    </div>

                    <div
                      class="px-4 leading-4"
                      :class="isMobile ? 'pb-0' : 'pb-4'"
                    >
                      <div v-if="post === 'noSuchPost'" class="w-8 h-5 py-1">
                        <div class="size-full rounded bg-gray-200"></div>
                      </div>
                      <TimeBanner v-else :timestamp="post.createdAt?.seconds" />
                    </div>
                  </div>

                  <div v-if="isMobile" class="overflow-auto grow">
                    <div class="px-4 pb-1">
                      <p
                        v-if="post !== 'noSuchPost'"
                        class="font-sans break-words whitespace-pre-wrap"
                      >
                        {{ descDisplay }}
                        <router-link
                          v-if="post.description.length > maxDescLength"
                          :to="'/post/' + postId"
                          class="text-gray-500 cursor-pointer"
                          >more</router-link
                        >
                      </p>

                      <span v-else>
                        The post has been deleted or is not visible to you.
                      </span>
                    </div>
                  </div>

                  <div
                    v-if="
                      userStore.isLoggedIn && !isMobile && post !== 'noSuchPost'
                    "
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
      </div>
    </div>
  </TheModal>
</template>

<script setup>
// const getUUID = () => window.crypto.randomUUID();

import TheModal from "./TheModal.vue";
import ImageCarousel from "./ImageCarousel.vue";
import UserPlate from "./UserPlate.vue";
import CommentsList from "./CommentsList.vue";
import CommentInput from "./CommentInput.vue";
import LikeButton from "./PostButtons/LikeButton.vue";
import CommentButton from "./PostButtons/CommentButton.vue";
import SaveButton from "./PostButtons/SaveButton.vue";
import LikesCountBanner from "./PostButtons/LikesCountBanner.vue";
import TimeBanner from "./PostButtons/TimeBanner.vue";
import postMoreButton from "./PostButtons/postMoreButton.vue";

import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { onBeforeRouteUpdate, onBeforeRouteLeave } from "vue-router";

import { useUserStore } from "../stores/user";
const userStore = useUserStore();

import { usePostStore } from "../stores/post";
const postStore = usePostStore();

import { useMediaQueryStore } from "../stores/mediaQuery";
const mediaQueryStore = useMediaQueryStore();
const isMobile = computed(() => mediaQueryStore.isMobile);

const props = defineProps({
  // postProps: {
  //   type: Object,
  //   default: {},
  // },
  isLikedOrSaved: {
    type: Boolean,
    default: false,
  },
});

if (props.isLikedOrSaved) {
  postStore.loadPost(postStore.postIdClicked);
}

const post = computed(() =>
  props.isLikedOrSaved ? postStore.postSnapshot : postStore.clickedPost
);
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

const postId = computed(() =>
  post.value && post.value !== "noSuchPost" ? post.value.id : null
);
const postCreatedBy = computed(() => post.value.createdBy?.userId);

// Rein in the size of the right part

const widthViewport = ref(0);
const heightViewport = ref(0);

const resizeObserver = new ResizeObserver((entries) => {
  const entry = entries[0];
  const { width, height } = entry.contentRect;
  widthViewport.value = width;
  heightViewport.value = height;
});

const remainedY = computed(() => heightViewport.value - 48);
const remainedX = computed(() => widthViewport.value - 64 * 2);

const variableWidth = computed(() => {
  const squareImageWidth = remainedY.value;
  const remainedWidth = remainedX.value - squareImageWidth;

  if (isMobile.value) return "100%";

  return (
    (remainedWidth <= 405 ? 405 : remainedWidth <= 500 ? remainedWidth : 500) +
    "px"
  );
});
const variableHeight = computed(() => {
  const squareImageWidth = remainedX.value - 405;
  const squareImageHeight = remainedY.value;

  if (isMobile.value) return userStore.isLoggedIn ? "220px" : "200px";

  return (
    (squareImageWidth <= 450 || squareImageHeight <= 450
      ? 450
      : squareImageWidth <= squareImageHeight
      ? squareImageWidth
      : squareImageHeight) + "px"
  );
});

const maxDescLength = 19;
const maxTruncatedWordLength = 10;

const descDisplay = computed(() => {
  const desc = post.value.description;

  if (!isMobile.value || desc.length <= maxDescLength) return desc;

  const trimmed = desc.substring(0, maxDescLength);

  const lastIndexOfSpace = trimmed.lastIndexOf(" ");

  return (
    (trimmed.length - (lastIndexOfSpace + 1) > maxTruncatedWordLength
      ? trimmed
      : trimmed.substring(0, lastIndexOfSpace)) + "..."
  );
});

// Open this modal, change the URL, add a new history entry,
// and keep the previous page as it was in the brackground.
// Not sure how to achieve this with Vue Router.
const newURL = "/post/" + postStore.postIdClicked;
history.pushState(
  {
    ...history.state,
    back: history.state.current,
    current: newURL,
    position: history.state.position + 1,
    forward: null,
  },
  null,
  newURL
);

const back = () => {
  history.back();
};

onBeforeRouteUpdate(() => {
  postStore.hidePostDetails();
});

onBeforeRouteLeave(() => {
  postStore.hidePostDetails();
});

onMounted(() => {
  resizeObserver.observe(document.body);
});

onBeforeUnmount(() => {
  if (props.isLikedOrSaved) {
    postStore.triggerUnSubPost();
  }

  resizeObserver.disconnect();
});
</script>

<style scoped>
.detailsContainer {
  max-height: calc(100dvh - 40px);
  max-width: calc(100% - calc(2 * 64px));
  width: 100%;

  &.mobile {
    max-width: calc(100% - calc(2 * 8px));
  }
}

.imageFrame {
  --variable: calc(100dvh - 48px);
  max-height: var(--variable);
  max-width: var(--variable);
  flex-basis: var(--variable);
  min-height: 450px;

  &.mobile {
    --variable-mobile: calc(100dvw - 8px);
    max-height: var(--variable-mobile);
    max-width: var(--variable-mobile);
    flex-basis: auto;
    min-height: 0;
  }
}

.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}
</style>
