<template>
  <TheModal @close="postStore.hidePostDetails">
    <!-- slot following -->
    <div class="postDetails">
      <div class="relative">
        <img
          v-if="post.image || post.images.length === 1"
          class="postImage"
          :src="post.image || post.images[0]"
          alt=""
        />
        <ImageCarousel v-else :imagesUrl="postImages" />
      </div>

      <div class="postMeta">
        <div class="author">
          <TheAvatar :src="post?.createdBy?.avatar" />
          <span>{{ post?.createdBy?.displayName }}</span>
        </div>
        <pre class="postDesc"
          >{{ post.description }}
        </pre>

        <div v-if="!userStore.isLoggedIn">
          **Please log in to see comments**
        </div>
        <div v-else class="comments">
          <div class="comment" v-for="comment in comments">
            <TheAvatar :src="comment.createdBy?.avatar" />

            <!-- <span
              class="user"
              @click="pushProfilePage(comment.createdBy.username)"
              >{{ comment.createdBy?.displayName }}</span
            > -->

            <router-link :to="'/' + comment?.createdBy?.username"
              ><span class="user">{{
                comment.createdBy?.displayName
              }}</span></router-link
            >

            <span class="commentDate">{{
              dateToRelative(comment.createdAt?.seconds, "short")
            }}</span>
            <p class="commentContent">{{ comment.content }}</p>
            <div
              v-if="comment.createdBy.userId === user.uid"
              class="commentDelete"
              role="button"
              @click="deleteComment(comment.id)"
            >
              Delete
            </div>
          </div>
        </div>
        <!--  -->
        <!-- <div role="button" @click="show2ndModal = true">2nd Modal</div>
        <LikesList
          v-if="show2ndModal"
          @close="show2ndModal = false"
        ></LikesList> -->
        <!--  -->
        <div class="actions">
          <PostActions v-if="!isLikedOrSaved" :post="post" />
          <span class="postPubDate">
            {{ dateToRelative(post.createdAt?.seconds) }}
          </span>
          <input
            type="text"
            v-model="contentCommentInput"
            name="comment"
            id=""
            class="commentInput"
            placeholder="Add a comment..."
          />
          <div
            v-if="contentCommentInput"
            @click="publishComment"
            class="commentPubBtn"
            role="button"
            tabindex="0"
          >
            Post
          </div>
          <div
            v-else
            class="commentPubBtn disabled"
            role="button"
            aria-disabled="true"
            tabindex="-1"
          >
            Post
          </div>
        </div>
      </div>
    </div>
  </TheModal>
</template>

<script setup>
const getUUID = () => window.crypto.randomUUID();

import { ref, computed, onMounted } from "vue";
import { useRoute, onBeforeRouteUpdate, onBeforeRouteLeave } from "vue-router";

import TheIcon from "./TheIcon.vue";
import TheAvatar from "./TheAvatar.vue";
import PostActions from "./PostActions.vue";
import TheModal from "./TheModal.vue";
import ImageCarousel from "./ImageCarousel.vue";

//
// import LikesList from "./LikesList.vue";

import { usePostStore } from "../stores/post";
import { useCommentStore } from "../stores/comment";
import { useUserStore } from "../stores/user";

import { dateToRelative } from "../utils/date";

const props = defineProps({
  post: {
    type: Object,
    default: {},
  },
  isLikedOrSaved: {
    type: Boolean,
  },
});

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

// onMounted(() => {
//   console.log("details!!", props.post.id);
// });

// Required even if access in template
const userStore = useUserStore();
const user = computed(() => userStore.user);
const userDoc = computed(() => userStore.userDoc);

const postStore = usePostStore();
// const post = computed(() => postStore.postDetails);

const commentStore = useCommentStore();
const comments = computed(() => commentStore.list);
const contentCommentInput = ref("");
async function publishComment() {
  await commentStore.uploadComment({
    content: contentCommentInput.value,
    postId: postId.value,
  });

  contentCommentInput.value = "";
}

async function deleteComment(commentId) {
  await commentStore.deleteComment({
    commentId,
    postId: postId.value,
  });
}

onBeforeRouteUpdate(() => {
  console.log("RouteUpdate in postDetails");
  postStore.toggleShowPostDetails(false);
});

onBeforeRouteLeave(() => {
  console.log("RouteLeave in postDetails");
  postStore.toggleShowPostDetails(false);
});

// const router = useRouter();

// const pushProfilePage = (username) => {
//   router.push("/" + username);
// };
//
// const show2ndModal = ref(false);
</script>

<style scoped>
.postDetails {
  display: grid;
  grid-template-columns: 1fr minmax(auto, 300px);
  grid-template-rows: minmax(0, 1fr);
  width: 80vw;
  height: 80vh;
}

.postImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.postMeta {
  padding: 24px;
  padding-top: 36px;
  display: grid;
  align-items: start;
  grid-template-rows: max-content max-content 1fr max-content;
  max-height: 100%;
  height: 100%;
}

.author {
  display: flex;
  align-items: center;
  gap: 10px;
}

.postDesc {
  width: 100%;
  white-space: pre-wrap;
  margin-top: 24px;
}

.comments {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: max-content;
  grid-gap: 28px;
  align-items: start;
  overflow-y: auto;
  height: 100%;
}

.comments::-webkit-scrollbar {
  display: none;
}

.comment {
  display: grid;
  grid-template-areas:
    "avatar name date"
    "comment comment delete";
  grid-template-columns: 34px 1fr 1fr;
  align-items: center;
  column-gap: 10px;
  row-gap: 14px;
}

.commentDate {
  grid-area: date;
  justify-self: end;
  color: #a7a7a7;
}

.commentContent {
  grid-area: comment;
}

.commentDelete {
  grid-area: delete;
  color: #ff431db0;
  /* font-weight: bold; */
  border: none;
  background: none;
  justify-self: end;
  font-size: 14px;
  /* margin-left: 25px; */
}

.actions {
  border-top: 1px solid #eaeaea;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  margin: 20px -24px 0px -24px;
  padding: 20px 24px 0 24px;
  row-gap: 16px;
}

.postActions > :deep(svg) {
  transform: scale(0.8125);
}

.postPubDate {
  color: #9f9f9f;
  grid-column: 2 / 6;
  justify-self: end;
  font-size: 14px;
}

.commentInput {
  background: #f7f7f7;
  border-radius: 16px;
  border: none;
  grid-column: 1 / 4;
}

.commentInput::placeholder {
  color: #b9b9b9;
  border: none;
}

.commentPubBtn {
  color: #1da0ff;
  font-weight: bold;
  border: none;
  background: none;
  font-size: 16px;
  margin-left: 25px;
  grid-column: 4 / 6;
}

.commentPubBtn.disabled {
  color: #68c0ff;
  font-weight: normal;
}
</style>
