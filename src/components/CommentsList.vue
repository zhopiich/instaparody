<template>
  <div
    v-if="!userStore.isLoggedIn"
    class="h-full py-4 flex justify-center items-center"
  >
    <span class="text-base leading-5 break-words whitespace-pre-line">
      Please
      <router-link
        to="/login"
        class="underline text-neutral-600 hover:text-neutral-400 active:text-neutral-700"
        >log in</router-link
      >
      to see the comments
    </span>
  </div>

  <div v-else class="flex flex-col items-stretch">
    <div v-for="comment in comments" class="mb-4 flex items-start commentItem">
      <div class="mr-4">
        <AvatarLink
          :isCardFixed="true"
          :user="{
            username: comment.createdBy.username,
            avatar: comment.createdBy.avatar,
            displayName: comment.createdBy.displayName,
            userId: comment.createdBy.userId,
          }"
          :widthAvatar="10"
        />
      </div>

      <div class="grow">
        <div class="inline-flex items-baseline">
          <span class="mr-1"
            ><DisplayNameLink
              :isCardFixed="true"
              :user="{
                username: comment.createdBy.username,
                avatar: comment.createdBy.avatar,
                displayName: comment.createdBy.displayName,
                userId: comment.createdBy.userId,
              }"
          /></span>
        </div>

        <div
          :class="isThereLongWord(comment.content) ? '*:break-all' : 'inline'"
        >
          <span class="whitespace-pre-wrap">{{ comment.content }}</span>
        </div>

        <div class="mt-2 mb-1 w-full flex *:leading-4">
          <div class="shrink-0">
            <TimeBanner :timestamp="comment.createdAt?.seconds" />
          </div>

          <div
            v-if="comment.createdBy.userId === user.uid"
            class="ml-auto mr-1 md:hidden deleteBtn"
          >
            <div
              class="text-red-500 hover:text-red-400 active:text-red-300 cursor-pointer"
              @click="deleteComment(comment.id)"
            >
              <p class="font-bold select-none">Delete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TimeBanner from "./PostButtons/TimeBanner.vue";
import AvatarLink from "./AvatarLink.vue";
import DisplayNameLink from "./DisplayNameLink.vue";

import { computed } from "vue";

const props = defineProps(["postId"]);

import { useCommentStore } from "../stores/comment";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();
const user = computed(() => userStore.user);

const commentStore = useCommentStore();
const comments = computed(() => commentStore.list);

async function deleteComment(commentId) {
  await commentStore.deleteComment({
    commentId,
    postId: props.postId,
  });
}

const isThereLongWord = (str) => {
  const longLength = 25;
  const wordsList = str.split(" ");

  return wordsList.some((word) => word.length >= longLength);
};
</script>

<style scoped>
.commentItem:hover .deleteBtn {
  display: block;
}
</style>
