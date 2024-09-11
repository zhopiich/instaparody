<template>
  <TheModal @close="$emit('close')" :isShowCloseBtn="false">
    <div class="max-h-dvh overflow-y-auto">
      <div class="bg-white rounded-lg overflow-hidden">
        <div class="min-w-[336px] w-[calc(100dvw_-_8px)] max-w-[400px]">
          <div class="w-full aspect-square flex flex-col">
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
            <div class="grow basis-0 overflow-auto">
              <div v-if="list" v-for="user in list">
                <div class="flex items-center justify-between px-4 py-2">
                  <div class="">
                    <UserPlate
                      :isCardFixed="true"
                      :user="user"
                      :widthAvatar="12"
                    />
                  </div>

                  <div class="flex items-center">
                    <div
                      v-if="user.userId !== userStore.user.uid"
                      class="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-400 rounded-md cursor-pointer"
                      :class="{
                        'bg-blue-200 pointer-events-none':
                          !userStore.isLoggedIn,
                      }"
                      @click="enterChat(user)"
                    >
                      <p class="text-white text-sm select-none">Message</p>
                    </div>
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

import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const emit = defineEmits(["close"]);

const list = computed(() => postStore.usersLike);

const profilePageURL = (username) => {
  return "/" + username;
};

const enterChat = async ({ ...userInfo }) => {
  const chatId = await messageStore.addContact({ ...userInfo });

  // Close modals if any
  // emit("close");
  // if (postStore.isShowPostDetails) {
  //   postStore.hidePostDetails();
  // }

  router.push("/messages/" + chatId);
};

onUnmounted(() => {
  postStore.cleanUsersLike();
});
</script>

<style scoped></style>
