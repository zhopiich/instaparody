<template>
  <div class="profileContainer">
    <TheAvatar :width="186" :height="186" :src="user?.avatar" />
    <div class="profile">
      <p class="name">
        <span>{{ user?.displayName || user?.username }}</span>
        <router-link v-if="isMe" to="/profile/edit">Edit Profile</router-link>
      </p>
      <p class="handle">@{{ user?.username }}</p>
      <div class="description">
        <pre>{{ user?.intro }}</pre>
      </div>
      <p class="website">{{ user?.website }}</p>
    </div>
  </div>

  <div class="tabs">
    <div
      v-for="tab in tabs"
      class="tabPosts"
      :class="{ active: tab.type === currentTab }"
      :key="tab.type"
      @click="switchTab(tab)"
    >
      <TheIcon :icon="tab.icon" />
      <p>{{ tab.label }}</p>
    </div>
  </div>

  <div class="tabContent">
    <!-- <PostList :isPostsEmpty="posts.length === 0"> -->
    <PostList :postsStatus="postsStatus">
      <PostImageItem
        v-for="post in posts"
        :post="post"
        :key="post.id"
        :isLikedOrSaved="currentTab !== 'created'"
      />
    </PostList>
    <!-- <PostDetails v-if="isShowPostDetails" /> -->
    <PostUpload v-if="isShowPostUpload" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeMount } from "vue";
import { useRoute, onBeforeRouteUpdate, onBeforeRouteLeave } from "vue-router";

import PostList from "../components/PostList.vue";
import PostImageItem from "../components/PostImageItem.vue";
import PostUpload from "../components/PostUpload.vue";
import TheIcon from "../components/TheIcon.vue";
import TheAvatar from "../components/TheAvatar.vue";

import { usePostStore } from "../stores/post";
import { useUserStore } from "../stores/user";

const route = useRoute();

const postStore = usePostStore();
const isShowPostUpload = computed(() => postStore.isShowPostUpload);

const types = ["created", "liked", "saved"];

const postsFiltered = (() => {
  const obj = {};

  for (const type of types) {
    obj[type] = computed(() => postStore.postsFiltered[type]);
  }

  return obj;
})();

const posts = computed(() => {
  return postsFiltered[currentTab.value].value;
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
      icon: "posts",
      type: "created",
    },
    {
      label: "LIKED",
      icon: "like",
      type: "liked",
    },
    {
      label: "SAVED",
      icon: "favorite",
      type: "saved",
    },
  ].filter((tab) => !(tab.type === "saved" && !isMe.value))
);

const currentTab = ref("created");
// watch(
//   currentTab,
//   async () => {
//     postStore.loadPostsFiltered(currentTab.value);
//     // posts.value = postsFiltered.value[currentTab.value];
//   }
//   // { immediate: true }
// );
const switchTab = (tab) => {
  currentTab.value = tab.type;
  postStore.loadPostsFiltered(currentTab.value, {
    username: route.params.username,
  });
};

// user

const userStore = useUserStore();

let user;
let isMe = ref(null);

const waitForUserDoc = (userDoc) => {
  return new Promise((resolve) => {
    const unwatch = watch(userDoc, () => {
      console.log("** watch userDoc **(once) ");
      unwatch();
      resolve();
    });
  });
};

onBeforeMount(async () => {
  if (userStore.isLoggedIn) {
    const userDocOfMine = computed(() => userStore.userDoc);
    if (!userDocOfMine.value) {
      await waitForUserDoc(userDocOfMine);
    }

    isMe.value = userDocOfMine.value.username === route.params.username;
  }

  if (isMe.value) {
    user = computed(() => userStore.userDoc);
  } else {
    userStore.getOtherUserDoc(route.params.username);
    user = computed(() => userStore.otherUserDoc);
  }

  postStore.loadPostsFiltered(currentTab.value, {
    username: route.params.username,
  });
});

// real-time listenser only accessible in template
// const isMe = ref(null);
// const user = computed(() => {
//   if (isMe.value === null) return;

//   if (isMe.value) {
//     return userStore.userDoc;
//   } else {
//     return userStore.otherUserDoc;
//   }
// });

// onMounted(async () => {
//   console.log("current userdoc", userDocOfMine.value);
//   if (!userDocOfMine.value) {
//     const waitForUserDoc = () => {
//       return new Promise((resolve) => {
//         const unwatch = watch(userDocOfMine, () => {
//           console.log("** watch userDoc **(once) ");
//           unwatch();
//           resolve();
//         });
//       });
//     };

//     await waitForUserDoc();
//   }
//   console.log("current userdoc_after", userDocOfMine.value);

//   postStore.loadPostsFiltered(currentTab.value, user.value.username);
// });

onBeforeRouteUpdate((to) => {
  //
  console.log("route updated!!");
  currentTab.value = "created";
  user = null;
  isMe.value = null;
  postStore.cleanPostsFiltered();
  postStore.triggerUnSubFiltered();
  console.log("report: ", user, isMe.value, postsFiltered);

  if (userStore.isLoggedIn) {
    isMe.value = userStore.userDoc.username === to.params.username;
  }
  console.log("isMe:", isMe.value);

  if (isMe.value) {
    user = computed(() => userStore.userDoc);
  } else {
    userStore.getOtherUserDoc(to.params.username);
    user = computed(() => userStore.otherUserDoc);
  }

  postStore.loadPostsFiltered(currentTab.value, {
    username: to.params.username,
  });
});

onBeforeRouteLeave((to, from) => {
  postStore.cleanPostsFiltered();
  postStore.triggerUnSubFiltered();
});
</script>

<style scoped>
.profileContainer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10vw;
}

.avatar {
  justify-self: end;
}

.profile .name {
  display: flex;
  align-items: center;
}

.profile .name > span {
  font-size: 26px;
}

.profile .name > a {
  color: #1da0ff;
  text-decoration: none;
  margin-left: 26px;
}

.profile .handle {
  margin-top: 4px;
  color: #848484;
}

.profile .description {
  margin-top: 26px;
  margin-bottom: 22px;
}

.tabs {
  display: grid;
  grid-template-columns: repeat(3, 88px);
  column-gap: 4vw;
  justify-content: center;

  margin-top: 7vmin;
  margin-bottom: 20px;
}

.tabPosts {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;
  padding: 12px 0 8px 0;
  cursor: pointer;

  & > svg {
    margin: 0 auto;
    width: 32px;
    height: 32px;
    stroke: #8a9194;
    fill: #8a9194;
  }
}

.tabPosts.active {
  background: #eff4f8;
  border-radius: 18px;

  & > svg {
    stroke: #1787d9;
    fill: #1787d9;
  }

  & > p {
    color: #1787d9;
  }
}

.tabContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 60px auto 0 auto;
  /* text-align: center;
  font-weight: 600;
  margin-bottom: 32px; */
}

.posts {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 40px;
}

.postImage {
  width: 100%;
  height: 321px;
  background: #eee;
  object-fit: cover;
}
</style>
