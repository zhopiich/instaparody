<template>
  <header
    class="mx-4 md:mx-0 mb-4 md:mb-8 flex flex-col md:flex-row items-stretch"
  >
    <div
      class="avatar-row shrink-0 md:grow md:basis-0 flex md:flex-col md:justify-center"
    >
      <div class="shrink-0 mr-7 flex justify-center">
        <TheAvatar :responsiveWidth="[80, 150]" :src="user?.avatar" />
      </div>
    </div>

    <section
      v-if="user && user !== 'noSuchUser'"
      class="shrink grow basis-0 md:grow-[2] md:basis-[30px] flex flex-col items-stretch"
    >
      <Teleport
        to="header > .avatar-row"
        v-if="isMounted"
        :disabled="!isMobile"
      >
        <div class="flex flex-col md:flex-row">
          <div class="mr-5 min-w-12 flex flex-col items-start">
            <h2 class="text-xl leading-6 break-words whitespace-pre-line">
              {{ user?.displayName }}
            </h2>
            <div class="flex">
              <span class="text-[15px] leading-[20px] text-[rgb(83_100_113)]"
                >@{{ user?.username }}</span
              >
            </div>
          </div>

          <div class="mt-1 md:mt-0 shrink-0 flex items-center">
            <div v-if="isMe" class="flex gap-2">
              <router-link
                to="/profile/edit"
                class="grow flex justify-center items-center rounded-lg px-4 h-8 bg-gray-100 hover:bg-neutral-200 active:bg-neutral-100 active:text-gray-400"
                ><span
                  class="font-semibold text-sm leading-[18px] text-center select-none"
                  >Edit profile</span
                >
              </router-link>
              <div
                class="grow flex justify-center items-center rounded-lg px-4 h-8 border border-red-200 bg-white hover:bg-red-100 active:bg-red-50 *:active:text-red-300 cursor-pointer"
                @click="logout"
              >
                <span
                  class="font-semibold text-sm leading-[18px] text-red-600 text-center select-none"
                  >Log out</span
                >
              </div>
            </div>

            <div
              v-else
              class="flex items-center rounded-lg px-4 h-8 font-semibold text-sm leading-[18px] bg-sky-500 hover:bg-blue-500 active:bg-blue-400 cursor-pointer"
              :class="{ '!bg-sky-300 pointer-events-none': !isLoggedIn }"
              @click="
                enterChat({
                  username: user.username,
                  userId: user.userId,
                  avatar: user.avatar,
                  displayName: user.displayName,
                })
              "
            >
              <span class="text-white select-none">Message</span>
            </div>
          </div>
        </div>
      </Teleport>

      <div class="h-0 mb-6 md:mb-5"></div>

      <div class="leading-6">
        <pre class="font-sans whitespace-pre-wrap">{{ user?.intro }}</pre>
      </div>

      <div class="flex" v-if="user?.website">
        <span class="mr-2"
          ><FontAwesomeIcon :icon="faLink" class="text-sm text-neutral-500"
        /></span>
        <a :href="user?.website" class="">
          <span class="font-semibold text-[rgb(0_55_107)]">{{
            urlDisplay
          }}</span></a
        >
      </div>

      <div class="mt-4 flex items-center">
        <p class="text-base leading-[18px]">
          <span class="font-semibold">{{ postsCount }}</span
          >{{ " post" + `${postsCount !== 1 ? "s" : ""}` }}
        </p>
      </div>
    </section>

    <section
      v-if="user === 'noSuchUser'"
      class="shrink grow basis-0 md:grow-[2] md:basis-[30px] flex flex-col items-stretch"
    >
      <Teleport
        to="header > .avatar-row"
        v-if="isMounted"
        :disabled="!isMobile"
      >
        <div class="flex items-center">
          <div class="flex flex-col items-start">
            <h2
              class="text-xl leading-6 break-words whitespace-pre-line font-bold"
            >
              @{{ $route.params.username }}
            </h2>
          </div>
        </div>
      </Teleport>

      <div class="h-0 mb-6 md:mb-5"></div>

      <div class="mb-2">
        <span
          class="text-[31px] leading-9 break-words whitespace-pre-line font-extrabold"
        >
          This account doesn’t exist
        </span>
      </div>
      <div class=" ">
        <span
          class="text-base leading-5 break-words whitespace-pre-line text-neutral-500"
        >
          Try searching for another.
        </span>
      </div>
    </section>
  </header>
</template>

<script setup>
import { logOut } from "../firebase/auth";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

import TheAvatar from "../components/TheAvatar.vue";

const props = defineProps(["user", "isMobile", "isMe", "isLoggedIn"]);

import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useAlertStore } from "../stores/alert";

const route = useRoute();
const router = useRouter();

// For <Teleport />
const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});

import { useMessageStore } from "../stores/message";
const messageStore = useMessageStore();

const enterChat = async ({ ...userInfo }) => {
  const chatId = await messageStore.addContact({ ...userInfo });

  router.push("/messages/" + chatId);
};

import { usePostStore } from "../stores/post";
const postStore = usePostStore();

const postsCount = computed(() => postStore.postsCount);

watch(
  () => route.params.username,
  (newVal) => {
    postStore.getPostsCount(newVal);
  },
  { immediate: true }
);

const urlDisplay = computed(() => {
  if (!props.user) return;

  const url = props.user.website;
  let trimmed;

  if (url.startsWith("http://") || url.startsWith("https://")) {
    const { host, pathname } = new URL(url);
    trimmed = host + pathname;
  } else {
    trimmed = url;
  }

  if (trimmed.endsWith("/")) trimmed = trimmed.slice(0, -1);

  return trimmed;
});

const logout = async () => {
  postStore.resetIsActedByMe();

  messageStore.reset();

  const alertStore = useAlertStore();
  alertStore.reset();

  await logOut();

  router.push("/login");
};
</script>
