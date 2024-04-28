<template>
  <div class="postItem">
    <!-- <img :src="post.image" alt="" width="100%" height="100%" style="background: #eee;" /> -->
    <!-- <img
      class="postImage"
      @click="handlePostDetails"
      :src="post.image"
      alt=""
    /> -->

    <div class="w-full aspect-square overflow-hidden relative">
      <img
        class="h-full w-full object-cover cursor-pointer"
        @click="handlePostDetails"
        :src="post.image || post.images[0]"
        alt=""
      />
      <div
        v-if="post.images && post.images.length > 1"
        class="absolute right-0 bottom-0 bg-white/35 rounded backdrop-blur m-3 p-1"
      >
        <FontAwesomeIcon :icon="faImages" class="text-2xl" />
      </div>
    </div>
  </div>
  <PostDetails
    v-if="isShowPostDetails && post.id === postIdClicked"
    :post="post"
    :isLikedOrSaved="isLikedOrSaved"
  />
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";

import { ref, computed, onMounted } from "vue";

import TheAvatar from "../components/TheAvatar.vue";
import PostDetails from "./PostDetails.vue";

import { dateToRelative } from "../utils/date";

import { usePostStore } from "../stores/post";
const postStore = usePostStore();
const isShowPostDetails = computed(() => postStore.isShowPostDetails);
const postIdClicked = computed(() => postStore.postIdClicked);

const props = defineProps({
  post: {
    type: Object,
    default: {},
  },
  isLikedOrSaved: {
    type: Boolean,
  },
});

const handlePostDetails = () => {
  if (props.isLikedOrSaved) {
    postStore.showPostDetails(props.post.id, {
      idLikedOrSaved: props.post.postId,
    });
  } else {
    postStore.showPostDetails(props.post.id);
  }
};

// onMounted(() => {
//   console.log(props.post.id);
//   console.log("click", postIdClicked.value);
// });
</script>

<style scoped>
.postItem {
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  /* width: 483px; */
  @apply max-lg:w-80 lg:w-[430px];
}

.postImage {
  width: inherit;
  cursor: pointer;
  /* border-top-left-radius: inherit; */
  /* border-top-right-radius: inherit; */
  @apply lg:bg-black object-contain md:max-lg:object-cover md:aspect-square;
}

@screen max-md {
  @media (min-height: 518px) {
    .postImage {
      @apply object-cover max-h-[518px];
    }
  }
}
</style>
