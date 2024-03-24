<template>
  <div class="postItem">
    <!-- <img :src="post.image" alt="" width="100%" height="100%" style="background: #eee;" /> -->
    <div
      class="w-full aspect-square rounded-t-[inherit] overflow-hidden relative"
    >
      <img
        class="h-full w-full object-cover cursor-pointer"
        @click="postStore.showPostDetails(post.id)"
        :src="post.image || post.images[0]"
        alt=""
      />
      <div
        v-if="post.images && post.images.length > 1"
        class="absolute right-0 bottom-0 bg-white/55 rounded backdrop-blur m-3 p-1"
      >
        <FontAwesomeIcon :icon="faImages" class="text-2xl" />
      </div>
    </div>

    <div class="postInfo">
      <div class="postMeta">
        <TheAvatar :src="post?.createdBy?.avatar" />
        <!-- To Be A Link to Profile Page -->
        <!-- <span>{{ post?.createdBy?.displayName }}</span> -->

        <router-link :to="'/' + post?.createdBy?.username"
          ><span>{{ post?.createdBy?.displayName }}</span></router-link
        >

        <span class="postPubDate">
          {{ dateToRelative(post.createdAt?.seconds) }}
        </span>
        <PostActions :post="post" />
      </div>

      <div class="postDesc">
        <p>
          {{ post.description }}
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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";

import { ref, computed, onMounted, toRefs } from "vue";
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
});

// const post = computed(() => props.post);
// const { post } = toRefs(props);

onMounted(() => {
  // if (props.post.description === "sample") {
  //   timeAgo.value = dateToRelative(
  //     new Date(props.post.createdAt.seconds * 1000)
  //   );
  // }
});
</script>

<style scoped>
.postItem {
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  /* width: 483px; */
  @apply max-lg:w-80 lg:w-[430px];
}

.postInfo {
  padding: 24px;
}

/* .postImage {
  width: inherit;
  cursor: pointer;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  @apply lg:bg-black object-contain md:max-lg:object-cover md:aspect-square;
}

@screen max-md {
  @media (min-height: 518px) {
    .postImage {
      @apply object-cover max-h-[518px];
    }
  }
} */

.postMeta {
  display: grid;
  grid-template-areas:
    "avatar name actions"
    "pubDate pubDate actions";
  grid-template-columns: 42px 1fr 3fr;
  row-gap: 6px;
  min-height: 82px;
}

.postMeta .avatar {
  grid-area: avatar;
}

.postMeta .postPubDate {
  grid-area: pubDate;
  color: #9f9f9f;
  font-size: 14px;
}

.postActions {
  grid-area: actions;
  justify-self: end;
}

.postDesc {
  margin-top: 28px;
  white-space: pre-line;
}
</style>
