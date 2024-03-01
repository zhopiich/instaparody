<template>
  <NavBarSliding>
    <nav class="navbar" :class="{ showSearch: isShowSearch }">
      <router-link class="logo" :class="{ hiddenSearch: isShowSearch }" to="/"
        ><img src="../assets/logo.svg"
      /></router-link>

      <div class="searchInput" :class="{ hiddenSearch: !isShowSearch }">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="isSubmerged"
          @keyup.enter="leadToResultPage(searchTerm)"
        />
        <div class="searchIcon">
          <TheIcon icon="search" />
        </div>
        <button
          v-if="searchTerm !== ''"
          class="cleanSearchBtn hidden"
          @click="cleanSearchTerm"
        >
          <TheIcon icon="close-round" />
        </button>
        <TheButton
          v-else
          class="cancelSearchBtn"
          color="immerse"
          @click="toggleShowSearch(false)"
        >
          Cancel
        </TheButton>
      </div>
      <button
        class="searchBtn"
        :class="{ hiddenSearch: isShowSearch }"
        @click="toggleShowSearch(true)"
      >
        <TheIcon icon="search" />
      </button>

      <div class="navItems">
        <button
          v-if="$route.name === 'home' || $route.name === 'profile'"
          @click="publishPost"
        >
          <TheIcon icon="publish" />
        </button>
        <div class="profileDropDown">
          <TheAvatar
            :src="user?.photoURL"
            :width="42"
            :height="42"
            style="cursor: pointer"
            @click="isShowDropdown = !isShowDropdown"
          />
          <div
            class="dropdownMenu"
            v-show="isShowDropdown"
            @click="isShowDropdown = false"
          >
            <ul class="profileMenu">
              <li><router-link :to="profilePageURL">My Page</router-link></li>
              <li @click="logout">Log Out</li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </NavBarSliding>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { logOut } from "../firebase/auth";

import TheAvatar from "./TheAvatar.vue";
import TheIcon from "./TheIcon.vue";
import TheButton from "./TheButton.vue";
import NavBarSliding from "./NavBarSliding.vue";

// import { userListener, getUser, updateUser } from "../firebase/firestore.js";

const isShowDropdown = ref(false);

import { useRouter } from "vue-router";
const router = useRouter();

import { usePostStore } from "../stores/post";
const postStore = usePostStore();

function publishPost() {
  postStore.toggleShowPostUpload(true);
}

const isShowSearch = ref(false);
function toggleShowSearch(bool) {
  isShowSearch.value = bool;
}

const searchTerm = ref("");
const cleanSearchTerm = () => {
  searchTerm.value = "";
};

async function leadToResultPage(term) {
  router.push({
    name: "search_result",
    query: { q: term },
  });
}

import { useUserStore } from "../stores/user";
const userStore = useUserStore();
// const userPnia = computed(() => userStore.user);

// real-time listenser only accessible in template
// const user = userListener(userPnia.value.uid);
const user = computed(() => userStore.user);

// const userDoc = computed(() => userStore.userDoc);

const profilePageURL = computed(() => {
  if (userStore.userDoc) {
    return "/" + userStore.userDoc.username;
  }

  return "/";
});

// onMounted(async () => {
//   // if (userPnia.value) {
//   // await userStore.getUserDoc(userPnia.value.uid);
//   // }
// });

async function logout() {
  postStore.resetIsLikedByMe();
  // postStore.cleanPostsAll();
  await logOut();
  router.push("/login");
}
</script>

<style scoped>
.navbar {
  width: 100dvw;
  background: white;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 375px 1fr;
  align-items: center;
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.08);
  @apply h-16 md:h-20 max-sm:px-2 px-4 lg:px-[10dvw];
}

@screen max-md {
  .navbar {
    grid-template-columns: auto 1fr auto;
  }

  .searchBtn.hiddenSearch {
    @apply hidden;
  }
}

@screen max-sm {
  .navbar.showSearch {
    grid-template-columns: 1fr auto;
  }

  .hiddenSearch {
    @apply hidden;
  }
}

.navbar svg {
  width: 38px;
  height: 38px;
}

.searchInput {
  position: relative;
  justify-self: center;
  margin: 0;
  @apply max-lg:max-w-[351px] lg:w-[430px];
}

.searchInput input {
  height: 40px;
  padding: 0 12px 0 38px;
  background: #f1f1f1;
  border-radius: 12px;
}

.searchIcon {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.cleanSearchBtn,
.cancelSearchBtn {
  position: absolute;
  background: none;
  border: none;
  right: 6px;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.cancelSearchBtn {
  @apply sm:hidden;
}

:deep(.button.immerse) {
  color: rgb(214, 50, 50);
  padding: 6px;
  font-size: 14px;
}

.searchBtn {
  justify-self: end;
  margin-right: 18px;
  @apply h-10 w-10 rounded-xl border border-solid border-neutral-500 sm:hidden;
}

.navItems {
  justify-self: end;
  display: flex;
  align-items: center;
  @apply gap-4 md:gap-6;
}

.navItems > button {
  border: none;
  background: none;
}

.profileDropDown {
  position: relative;
}

.profileMenu {
  position: absolute;
  width: max-content;
  padding: 24px 26px;
  list-style: none;
  background: white;
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  right: 0;
  display: grid;
  row-gap: 18px;
  transform: translateY(18px);
}

.profileMenu::before {
  content: "";
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  top: -12px;
  right: 10px;
  border-bottom: 12px solid white;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
}

.profileMenu a,
.profileMenu li {
  text-decoration: none;
  cursor: pointer;
}

.profileMenu a:visited {
  color: initial;
}
</style>
