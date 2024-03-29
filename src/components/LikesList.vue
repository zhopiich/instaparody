<template>
  <TheModal @close="$emit('close')" :stack="2" :isShowCloseBtn="false">
    <!--  -->
    <div class="w-[400px] aspect-square flex flex-col">
      <div class="h-[42px] border-b border-b-neutral-300 flex">
        <div
          class="w-[50px] flex justify-center items-center cursor-pointer"
          @click="$emit('close')"
        >
          <FontAwesomeIcon :icon="faXmark" class="text-[24px]" />
        </div>
        <div class="grow flex justify-center items-center font-semibold">
          <h1>Likes</h1>
        </div>
        <div class="w-[50px]"></div>
      </div>
      <div class="grow overflow-auto">
        <div>
          <div v-for="user in list">
            <div class="flex items-center justify-between px-4 py-2">
              <div class="">
                <UserPlate
                  :isCardFixed="true"
                  :user="{
                    username: user.username,
                    avatar: user.avatar,
                    displayName: user.displayName,
                    userId: user.userId,
                  }"
                  :widthAvatar="14"
                />
              </div>

              <div class="flex items-center">
                <div
                  v-if="user.userId !== userStore.user.uid"
                  class="px-4 py-[7px] bg-sky-500 rounded-md cursor-pointer"
                  @click="
                    enterChat({
                      username: user.username,
                      userId: user.userId,
                      avatar: user.avatar,
                      displayName: user.displayName,
                    })
                  "
                >
                  <p class="text-white">Message</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
  </TheModal>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import TheModal from "./TheModal.vue";
import UserPlate from "./UserPlate.vue";

import { useUserStore } from "../stores/user";
const userStore = useUserStore();

import { usePostStore } from "../stores/post";
const postStore = usePostStore();

import { useMessageStore } from "../stores/message";
const messageStore = useMessageStore();

import { ref, computed, onMounted, onUnmounted, toRefs } from "vue";

const emit = defineEmits(["close"]);

const list = computed(() => postStore.usersLike);

const profilePageURL = (username) => {
  return "/" + username;
};

const enterChat = async ({ ...userInfo }) => {
  const chatId = await messageStore.addContact({ ...userInfo });

  emit("close");
  if (postStore.isShowPostDetails) {
    postStore.hidePostDetails();
  }

  messageStore.loadLastMessages(chatId);
  messageStore.setCurrentChat(chatId);

  messageStore.toggle(true);
  messageStore.enterChat(true);
};

onUnmounted(() => {
  postStore.cleanUsersLike();
});
</script>

<style scoped></style>
