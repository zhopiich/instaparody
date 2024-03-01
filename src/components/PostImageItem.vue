<template>
  <div class="postItem">
    <!-- <img :src="post.image" alt="" width="100%" height="100%" style="background: #eee;" /> -->
    <img
      class="postImage"
      @click="handlePostDetails"
      :src="post.image"
      alt=""
    />
  </div>
  <PostDetails
    v-if="isShowPostDetails && post.id === postIdClicked"
    :post="post"
    :isLikedOrSaved="isLikedOrSaved"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

import TheAvatar from "../components/TheAvatar.vue";
import PostActions from "../components/PostActions.vue";
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
