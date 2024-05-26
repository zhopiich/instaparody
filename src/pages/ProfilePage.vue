<template>
  <div class="py-12 md:py-14 md:px-5 w-full max-w-[975px]">
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
              <router-link
                v-if="isMe"
                to="/profile/edit"
                class="flex items-center rounded-lg px-4 h-8 font-semibold text-sm leading-[18px] bg-gray-100 hover:bg-neutral-200 active:bg-neutral-100 active:text-gray-400"
                >Edit profile</router-link
              >

              <div
                v-else
                class="flex items-center rounded-lg px-4 h-8 font-semibold text-sm leading-[18px] bg-blue-500 hover:bg-blue-600 active:bg-blue-400 cursor-pointer"
                @click="
                  enterChat({
                    username: user.username,
                    userId: user.userId,
                    avatar: user.avatar,
                    displayName: user.displayName,
                  })
                "
              >
                <span class="text-white">Message</span>
              </div>
            </div>
          </div>
        </Teleport>

        <div class="h-0 mb-6 md:mb-5"></div>

        <div class="leading-6">
          <pre class="whitespace-pre-wrap">{{ user?.intro }}</pre>
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
            <span class="font-semibold">{{ postsByUserCount }}</span
            >{{ " post" + `${postsByUserCount !== 1 ? "s" : ""}` }}
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
                @{{ route.params.username }}
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

    <div class="border-t">
      <div
        v-if="user !== 'noSuchUser'"
        class="border-b md:border-b-0 flex justify-center items-center md:gap-14"
      >
        <div
          v-for="tab in tabs"
          class="grow md:grow-0 h-11 md:h-[52px] flex justify-center items-center cursor-pointer"
          :class="
            tab.type === currentTab
              ? ' border-t border-black -mt-[1px] *:text-blue-500 *:md:text-black'
              : '*:hover:text-neutral-400 *:active:text-neutral-300'
          "
          :key="tab.type"
          @click="switchTab(tab)"
        >
          <div class="flex items-center text-neutral-500">
            <FontAwesomeIcon :icon="tab.icon" class="text-2xl md:text-base" />
            <span class="ml-1.5 text-sm font-semibold hidden md:block">{{
              tab.label
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="currentTab === 'saved' && postsStatus !== 'loading'"
      class="h-16 flex"
    >
      <div class="mt-8 mb-4 flex">
        <span class="whitespace-nowrap text-xs text-gray-500">
          Only you can see what you've saved
        </span>
      </div>
    </div>
    <PostImageList
      v-if="user !== 'noSuchUser'"
      :postsStatus="postsStatus"
      :userStatus="user"
    >
      <PostImageItem
        v-for="post in posts"
        :post="post"
        :key="post.id"
        :isLikedOrSaved="currentTab !== 'created'"
      />
    </PostImageList>
  </div>

  <!-- <PostUpload v-if="isShowPostUpload" /> -->
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faLink, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { faHeart, faBookmark } from "@fortawesome/free-regular-svg-icons";

import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onUnmounted,
  onBeforeMount,
} from "vue";
import {
  useRoute,
  useRouter,
  onBeforeRouteUpdate,
  onBeforeRouteLeave,
} from "vue-router";

// For <Teleport />

// const mql = window.matchMedia("(min-width: 768px)");
const isMounted = ref(false);
// const isBeyondPoint = ref(mql.matches);

// const handleChange = () => {
//   isBeyondPoint.value = mql.matches;
// };
import { useMediaQueryStore } from "../stores/mediaQuery";
const mediaQueryStore = useMediaQueryStore();
const isMobile = computed(() => mediaQueryStore.isMobile);

onMounted(() => {
  isMounted.value = true;

  // mql.addEventListener("change", handleChange);
});

onUnmounted(() => {
  // mql.removeEventListener("change", handleChange);
});

import PostImageList from "../components/PostImageList.vue";
import PostImageItem from "../components/PostImageItem.vue";
// import PostUpload from "../components/PostUpload.vue";
import TheAvatar from "../components/TheAvatar.vue";

import { usePostStore } from "../stores/post";
import { useUserStore } from "../stores/user";

const route = useRoute();
const router = useRouter();

const postStore = usePostStore();
// const isShowPostUpload = computed(() => postStore.isShowPostUpload);

const postsFiltered = (() => {
  const obj = {};

  for (const type of ["created", "liked", "saved"]) {
    obj[type] = computed(() => postStore.postsFiltered[type]);
  }

  return obj;
})();

const posts = computed(() => postsFiltered[currentTab.value].value);

const postsByUserCount = computed(() => {
  if (!postsFiltered.created.value) return;
  return postsFiltered.created.value.length;
});

const postsStatus = computed(() => {
  if (!posts.value) return "loading";
  if (posts.value === "error") return "error";
  if (posts.value.length === 0) return "empty";
});

const tabs = computed(() =>
  [
    {
      label: "POSTS",
      icon: faTableCells,
      type: "created",
    },
    {
      label: "LIKED",
      icon: faHeart,
      type: "liked",
    },
    {
      label: "SAVED",
      icon: faBookmark,
      type: "saved",
    },
  ].filter((tab) => !(tab.type === "saved" && !isMe.value))
);

const currentTab = ref("created");

const switchTab = (tab) => {
  currentTab.value = tab.type;
  postStore.loadPostsFiltered(
    currentTab.value,
    route.params.username === user.value.username &&
      currentTab.value === "saved"
      ? // Firebase security rules that make the documents
        // accessible only to their creator require uid
        { userId: userStore.user.uid }
      : { username: route.params.username }
  );
};

// User info

const userStore = useUserStore();

const isMe = ref(null);

const user = computed(() => {
  if (isMe.value === null) return;

  if (isMe.value) {
    return userStore.userDoc;
  } else {
    return userStore.otherUserDoc;
  }
});

import { useMessageStore } from "../stores/message";
const messageStore = useMessageStore();

const enterChat = async ({ ...userInfo }) => {
  const chatId = await messageStore.addContact({ ...userInfo });

  router.push("/messages/" + chatId);
};

const urlDisplay = computed(() => {
  if (!user.value) return;

  const url = user.value.website;
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

onBeforeMount(async () => {
  postStore.loadPostsFiltered("created", {
    username: route.params.username,
  });

  if (userStore.isLoggedIn) {
    const userDocOfMine = computed(() => userStore.userDoc);

    if (!userDocOfMine.value) {
      watch(
        userDocOfMine,
        (newVal) => {
          isMe.value = newVal.username === route.params.username;
          if (!isMe.value) userStore.getOtherUserDoc(route.params.username);
        },
        { once: true }
      );
    } else {
      isMe.value = userDocOfMine.value.username === route.params.username;
      if (!isMe.value) userStore.getOtherUserDoc(route.params.username);
    }
  } else {
    userStore.getOtherUserDoc(route.params.username);
  }
});

onBeforeRouteUpdate((to) => {
  postStore.cleanPostsFiltered();
  postStore.triggerUnSubFiltered();

  currentTab.value = "created";
  postStore.loadPostsFiltered("created", {
    username: to.params.username,
  });

  isMe.value =
    userStore.isLoggedIn && userStore.userDoc.username === to.params.username;

  if (!isMe.value) {
    userStore.getOtherUserDoc(to.params.username);
  }
});

onBeforeRouteLeave(() => {
  postStore.cleanPostsFiltered();
  postStore.triggerUnSubFiltered();
});
</script>

<style scoped></style>
