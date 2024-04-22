<template>
  <div class="max-w-[468px] rounded-lg shadow-custom flex flex-col">
    <div
      class="shrink-0 w-full max-h-[585px] md:aspect-square rounded-t-[inherit] overflow-hidden relative"
    >
      <img
        class="h-full w-full object-contain md:object-cover cursor-pointer"
        @click="postStore.showPostDetails(post.id)"
        :src="post.image || post.images[0]"
        alt=""
      />
      <div
        v-if="post.images && post.images.length > 1"
        class="absolute right-0 bottom-0 bg-white/45 rounded backdrop-blur m-3 p-1 pointer-events-none"
      >
        <FontAwesomeIcon :icon="faImages" class="text-2xl" />
      </div>
    </div>

    <div class="grow border-t px-4 flex flex-col">
      <div class="my-3 flex items-center justify-start">
        <div class="flex items-center gap-3">
          <AvatarLink
            :user="{
              username: post?.createdBy?.username,
              avatar: post?.createdBy?.avatar,
              displayName: post?.createdBy?.displayName,
              userId: post?.createdBy?.userId,
            }"
            :widthAvatar="12"
          />
          <DisplayNameLink
            :user="{
              username: post?.createdBy?.username,
              avatar: post?.createdBy?.avatar,
              displayName: post?.createdBy?.displayName,
              userId: post?.createdBy?.userId,
            }"
            :isHoverHighlight="false"
          />
        </div>

        <div>
          <div class="mx-1.5 inline text-gray-500">{{ "•" }}</div>
          <TimeBanner :timestamp="post.createdAt?.seconds" :fontSize="'base'" />
        </div>
      </div>

      <div class="mb-1 flex">
        <div class="-ml-2">
          <LikeButton :post="post" />
        </div>
        <div class="">
          <CommentButton :post="post" />
        </div>
        <div class="-mr-2.5 ml-auto">
          <SaveButton :post="post" />
        </div>
      </div>

      <div class="mb-1">
        <LikesCountBanner :post="post" />
      </div>

      <div class="mt-2 min-h-10 grow">
        <p class="whitespace-pre-line leading-5">
          {{ descriptionDisplay }}
          <span
            v-if="post.description.length > maxDescLength"
            class="text-gray-500 cursor-pointer"
            @click="postStore.showPostDetails(post.id)"
            >more</span
          >
        </p>
      </div>

      <div
        class="my-2 *:text-gray-500 *:leading-5 *:cursor-pointer h-6 flex items-center"
      >
        <p
          v-if="post.comments === 0"
          @click="
            () => {
              commentStore.setIsFocus(true);
              postStore.showPostDetails(post.id);
            }
          "
        >
          Make the first comment
        </p>
        <p v-else @click="postStore.showPostDetails(post.id)">
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
        </p>
      </div>
    </div>
  </div>

  <PostDetails
    v-if="isShowPostDetails && post.id === postIdClicked"
    :post="post"
  />
</template>

<script setup>
import { dateToRelative } from "../utils/date";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";

import TheAvatar from "../components/TheAvatar.vue";
import PostDetails from "./PostDetails.vue";
import UserPlate from "./UserPlate.vue";
import AvatarLink from "./AvatarLink.vue";
import DisplayNameLink from "./DisplayNameLink.vue";
import TimeBanner from "./PostButtons/TimeBanner.vue";
import LikeButton from "./PostButtons/LikeButton.vue";
import CommentButton from "./PostButtons/CommentButton.vue";
import SaveButton from "./PostButtons/SaveButton.vue";
import LikesCountBanner from "./PostButtons/LikesCountBanner.vue";

import { ref, computed } from "vue";

import { usePostStore } from "../stores/post";
import { useCommentStore } from "../stores/comment";

const postStore = usePostStore();
const commentStore = useCommentStore();

const isShowPostDetails = computed(() => postStore.isShowPostDetails);
const postIdClicked = computed(() => postStore.postIdClicked);

const props = defineProps({
  post: {
    type: Object,
    default: {},
  },
});

const maxDescLength = 90;
const maxTruncatedWordLength = 10;

const descriptionDisplay = computed(() => {
  const desc = props.post.description;

  if (desc.length <= maxDescLength) return desc;

  const trimmed = desc.substring(0, maxDescLength);

  const lastIndexOfSpace = trimmed.lastIndexOf(" ");

  return (
    (trimmed.length - (lastIndexOfSpace + 1) > maxTruncatedWordLength
      ? trimmed
      : trimmed.substring(0, lastIndexOfSpace)) + "..."
  );
});
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0 0 12px rgba(55, 99, 170, 0.18);
}
</style>
