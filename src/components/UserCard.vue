<template>
  <TheTooltip
    :bottom="bottom"
    :right="right"
    :dimensions="dimensions"
    :isFixed="isFixed"
  >
    <div
      class="w-[370px] bg-white flex flex-col rounded-lg overflow-hidden shadow-xl border border-neutral-200"
    >
      <div class="flex gap-4 px-4 py-4">
        <div class="avatar">
          <div class="w-16 rounded-full">
            <router-link :to="'/' + user.username">
              <img :src="user.avatar" class="cursor-pointer" />
            </router-link>
          </div>
        </div>
        <div
          class="grow flex flex-col justify-center items-start *:cursor-pointer"
        >
          <router-link :to="'/' + user.username">
            <p class="font-bold">{{ user.displayName }}</p>
            <p class="text-slate-500">@{{ user.username }}</p>
          </router-link>
        </div>
      </div>

      <div class="px-4 pb-2 min-h-6 flex w-full items-center">
        <pre class="whitespace-pre-wrap leading-5">{{ intro }}</pre>
      </div>

      <div class="flex items-center px-4 pb-4">
        <p class="">
          <span class="font-bold">{{ countPosts }}</span
          >{{ " post" + `${countPosts !== 1 ? "s" : ""}` }}
        </p>
      </div>

      <!-- <div class="flex gap-1"> -->
      <div class="grid grid-cols-3 gap-1 *:aspect-square">
        <!-- <div v-for="image in last3Posts" class="grow basis-0 aspect-square"> -->
        <div v-if="!last3Posts || !last3Posts.length" v-for="n in 3">
          <div class="w-full h-full bg-slate-400"></div>
        </div>
        <div v-else v-for="image in last3Posts">
          <img class="w-full h-full object-cover" :src="image" alt="" />
        </div>
      </div>

      <div
        class="flex justify-center items-center *:cursor-pointer *:select-none"
      >
        <router-link
          v-if="isMe"
          to="/profile/edit"
          class="m-4 rounded-lg py-1.5 grow *:text-center bg-neutral-100"
        >
          <p class="text-black">Edit profile</p>
        </router-link>

        <div
          v-else
          class="m-4 rounded-lg py-1.5 grow *:text-center bg-sky-500"
          @click="
            enterChat({
              username: user.username,
              userId: user.userId,
              avatar: user.avatar,
              displayName: user.displayName,
            })
          "
        >
          <p class="text-white">Contact</p>
        </div>
      </div>
    </div>
  </TheTooltip>
</template>

<script setup>
import TheTooltip from "./TheTooltip.vue";

import { ref, computed, onMounted, toRefs, onBeforeMount } from "vue";

import { usePostStore } from "../stores/post";
const postStore = usePostStore();

import { useUserStore } from "../stores/user";
const userStore = useUserStore();

import { useMessageStore } from "../stores/message";
const messageStore = useMessageStore();

const props = defineProps(["isFixed", "bottom", "right", "dimensions", "user"]);

const isMe = props.user.userId === userStore.user.uid;

//
const last3Posts = computed(() => postStore.infoUserCard.last3Posts);
const countPosts = computed(() => postStore.infoUserCard.countPosts);
const intro = computed(() => postStore.infoUserCard.intro);

const enterChat = async ({ ...userInfo }) => {
  const chatId = await messageStore.addContact({ ...userInfo });

  // Close modals if any
  if (postStore.isShowPostDetails) {
    postStore.hidePostDetails();
  }

  if (
    !messageStore.currentContact ||
    messageStore.currentContact.chatId !== chatId
  ) {
    messageStore.loadMessages(chatId);
    messageStore.setCurrentChat(chatId);
  }

  messageStore.toggle(true);
  messageStore.enterChat(true);
};

onBeforeMount(() => {
  postStore.getPostsByUser(props.user.userId);
});
</script>

<style scoped></style>
