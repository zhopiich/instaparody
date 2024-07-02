<template>
  <div class="aspect-square overflow-hidden relative imageItem">
    <img
      v-if="isLikedOrSaved ? postSnap?.images : true"
      class="h-full w-full object-cover cursor-pointer"
      @click="handlePostDetails"
      :src="isLikedOrSaved ? postSnap.images[0] : post.image || post.images[0]"
      alt="Posted image"
    />

    <div
      v-if="
        isLikedOrSaved
          ? postSnap?.images && postSnap.images.length > 1
          : post.images && post.images.length > 1
      "
      class="absolute right-0 bottom-0 bg-white/35 rounded backdrop-blur m-3 p-1 pointer-events-none"
    >
      <FontAwesomeIcon :icon="faImages" class="text-xl" />
    </div>

    <div
      v-if="
        isLikedOrSaved
          ? [postSnap?.likes, postSnap?.comments]
              .map((num) => typeof num === 'number')
              .every((bool) => bool)
          : true
      "
      class="size-full absolute top-0 pointer-events-none hidden countCover"
    >
      <div
        class="size-full bg-black/30 flex flex-col md:flex-row gap-2 md:gap-6 justify-center items-center text-xl"
      >
        <div class="flex items-center">
          <FontAwesomeIcon :icon="faHeart" class="text-white mr-2" />
          <span class="font-bold text-white">{{ likesCount }}</span>
        </div>
        <div class="flex items-center">
          <FontAwesomeIcon :icon="faComment" class="text-white mr-2" />
          <span class="font-bold text-white">{{ commentsCount }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- <PostDetails
    v-if="!isLikedOrSaved && isShowPostDetails && post.id === postIdClicked"
    :postProps="post"
    :isLikedOrSaved="isLikedOrSaved"
    :isMobile="isMobile"
  /> -->
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faImages,
  faHeart,
  faComment,
} from "@fortawesome/free-solid-svg-icons";

const props = defineProps({
  post: {
    type: Object,
    default: {},
  },
  isLikedOrSaved: {
    type: Boolean,
  },
});

import { ref, computed, onBeforeMount } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

import { useMediaQueryStore } from "../stores/mediaQuery";
const mediaQueryStore = useMediaQueryStore();
const isMobile = computed(() => mediaQueryStore.isMobile);

// import PostDetails from "./PostDetails.vue";

import { usePostStore } from "../stores/post";
const postStore = usePostStore();
const isShowPostDetails = computed(() => postStore.isShowPostDetails);
// const postIdClicked = computed(() => postStore.postIdClicked);

const postId = computed(() =>
  props.isLikedOrSaved ? props.post.postId : props.post.id
);

const postSnap = ref(null);

onBeforeMount(async () => {
  if (props.isLikedOrSaved) {
    postSnap.value = await postStore.getPostById(postId.value);
  }
});

const handlePostDetails = () => {
  if (isMobile.value) {
    router.push("/post/" + postId.value);
  } else {
    postStore.showPostDetails(postId.value);
  }
};

const formatNumber = (number) =>
  typeof number === "number"
    ? number.toLocaleString("en-US", {
        maximumFractionDigits: 1,
        notation: "compact",
        compactDisplay: "short",
      })
    : null;

const likesCount = computed(() =>
  formatNumber(props.isLikedOrSaved ? postSnap.value?.likes : props.post.likes)
);
const commentsCount = computed(() =>
  formatNumber(
    props.isLikedOrSaved ? postSnap.value?.comments : props.post.comments
  )
);
</script>

<style scoped>
.imageItem:hover .countCover {
  display: block;
}
</style>
