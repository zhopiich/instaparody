<template>
  <TheModal
    :customClass="['flex', 'flex-col', 'justify-center', 'items-stretch']"
    :isPointerEventsAuto="false"
    @close="postStore.hidePostDetails"
  >
    <div
      class="flex justify-center items-start min-w-0 min-h-0 overflow-y-auto"
    >
      <div class="flex flex-col w-full h-full justify-center items-center my-0">
        <div
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
                    <img
                      v-if="post.image || post.images.length === 1"
                      class="size-full object-cover"
                      :src="post.image || post.images[0]"
                      alt="Image posted"
                    />
                    <ImageCarousel v-else :imagesUrl="postImages" />
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
                  <div
                    v-if="!isMobile"
                    class="flex-auto border-t overflow-auto scrollbar-hidden"
                  >
                    <div class="px-4">
                      <div class="py-4">
                        <pre
                          class="font-sans break-words whitespace-pre-wrap"
                          >{{ post.description }}</pre
                        >
                      </div>
                      <CommentsList :postId="postId" />
                    </div>
                  </div>

                  <div
                    v-if="!isLikedOrSaved"
                    class="shrink-0"
                    :class="{ 'border-t': !isMobile }"
                  >
                    <div
                      class="px-4 flex justify-start"
                      :class="isMobile ? 'py-0' : 'py-2'"
                    >
                      <div class="-ml-2">
                        <LikeButton :post="post" />
                      </div>
                      <div class="">
                        <CommentButton
                          :post="post"
                          @focusInput="commentInput.focus()"
                        />
                      </div>
                      <div class="-mr-2.5 ml-auto">
                        <SaveButton :post="post" />
                      </div>
                    </div>

                    <div class="px-4" :class="isMobile ? 'pb-0' : 'pb-1'">
                      <LikesCountBanner :post="post" />
                    </div>

                    <div v-if="isMobile" class="px-4">
                      <div
                        class="mt-1 *:text-gray-500 *:leading-4 *:cursor-pointer *:text-sm flex items-center"
                      >
                        <span v-if="post.comments === 0" @click="">
                          Make the first comment
                        </span>
                        <span v-else @click="">
                          {{
                            "View " +
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
                      <TimeBanner :timestamp="post.createdAt?.seconds" />
                    </div>
                  </div>

                  <div v-if="isMobile" class="overflow-auto grow">
                    <div class="px-4 pb-1">
                      <pre class="font-sans break-words whitespace-pre-wrap">{{
                        post.description
                      }}</pre>
                    </div>
                  </div>

                  <div class="shrink-0 border-t border-gray-300">
                    <CommentInput
                      :postId="postId"
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
const getUUID = () => window.crypto.randomUUID();

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

import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { onBeforeRouteUpdate, onBeforeRouteLeave } from "vue-router";

import { usePostStore } from "../stores/post";

const postStore = usePostStore();

const props = defineProps({
  post: {
    type: Object,
    default: {},
  },
  isLikedOrSaved: {
    type: Boolean,
  },
  isMobile: { type: Boolean },
});

const commentInput = ref(null);
const setInputRef = (val) => {
  commentInput.value = val;
};

const postImages = ref([]);
if (props.post.images && props.post.images.length > 1) {
  postImages.value = props.post.images.map((image) => ({
    url: image,
    id: getUUID(),
  }));
}

const postId = computed(() => {
  if (props.isLikedOrSaved) {
    return props.post.postId;
  } else {
    return props.post.id;
  }
});

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

  if (props.isMobile) return "100%";

  return (
    (remainedWidth <= 405 ? 405 : remainedWidth <= 500 ? remainedWidth : 500) +
    "px"
  );
});
const variableHeight = computed(() => {
  const squareImageWidth = remainedX.value - 405;
  const squareImageHeight = remainedY.value;

  if (props.isMobile) return "265px";

  return (
    (squareImageWidth <= 450 || squareImageHeight <= 450
      ? 450
      : squareImageWidth <= squareImageHeight
      ? squareImageWidth
      : squareImageHeight) + "px"
  );
});

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
