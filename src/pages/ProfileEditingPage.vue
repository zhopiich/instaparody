<template>
  <div class="py-7 px-3 w-screen max-w-[634px]">
    <div class="py-3 mb-4">
      <h2 class="text-xl font-bold">Edit profile</h2>
    </div>

    <div class="my-4">
      <ChangePhoto :avatarURL="userDoc?.avatar" :profileData="profileData" />
    </div>

    <div>
      <form class="profileForm" @submit.prevent="handleUpdateUser">
        <div class="mb-4 flex flex-col">
          <label for="displayName"
            ><div class="py-4">
              <p class="leading-5 font-bold">Display name</p>
            </div>
          </label>
          <input
            :class="{ '!border-red-500': !isDisplayNameValid }"
            type="text"
            v-model="profileData.displayName"
            id="displayName"
            placeholder="Display name"
          />
        </div>

        <div class="mb-4 flex flex-col">
          <label for="gender-select"
            ><div class="py-4">
              <p class="leading-5 font-bold">Gender</p>
            </div>
          </label>

          <GenderSelect
            :gender="profileData.gender"
            @setGender="setGender"
            @setValidGender="setValidGender"
          />

          <div class="mt-2 flex">
            <span class="text-xs text-gray-500 font-normal"
              >This won’t be part of your public profile.</span
            >
          </div>
        </div>

        <div class="mb-4 flex flex-col">
          <IntroInput
            :initialIntro="initialProfile.intro"
            @introChanged="changeIntro"
            @setValidIntro="setValidIntro"
          />
        </div>

        <div class="mb-4 flex flex-col">
          <label for="websiteURL"
            ><div class="py-4">
              <p class="leading-5 font-bold">Website</p>
            </div>
          </label>
          <input
            :class="{ '!border-red-500': !isWebsiteValid }"
            type="text"
            v-model="profileData.website"
            id="websiteURL"
            placeholder="Website"
          />
        </div>

        <div class="flex justify-center md:justify-end">
          <div class="mt-4 flex flex-col md:flex-row gap-4">
            <TheButton
              type="submit"
              :height="44"
              :width="240"
              :isDisable="!isEdited || !isProfileValid"
              >Submit
            </TheButton>
            <TheButton
              class="md:-order-1"
              type="reset"
              :height="44"
              :width="240"
              color="reverse"
              @click.prevent="router.back()"
              >Cancel
            </TheButton>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import TheButton from "../components/TheButton.vue";
import GenderSelect from "../components/ProfileEditing/GenderSelect.vue";
import IntroInput from "../components/ProfileEditing/IntroInput.vue";
import ChangePhoto from "../components/ProfileEditing/ChangePhoto.vue";

import { ref, reactive, computed, onMounted, watch } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { updateUserDoc } from "../firebase/firestore.js";

import { useUserStore } from "../stores/user";
const userStore = useUserStore();

const userDoc = computed(() => userStore.userDoc);
const user = computed(() => userStore.user);

const initialProfile = {};
const profileData = reactive({
  // displayName: "",
  // intro: "",
  // mobilePhone: "",
  // gender: "",
  // website: "",
});

const setGender = (newGender) => {
  profileData.gender = newGender;
};

const changeIntro = (changedIntro) => {
  profileData.intro = changedIntro;
};

const isEdited = computed(() => {
  if (profileData === {}) return false;

  const { gender, ...rest } = profileData;

  for (const key in rest) {
    if (initialProfile[key] !== rest[key]) {
      return true;
    }
  }

  if (
    typeof gender === "object" &&
    gender &&
    typeof initialProfile.gender === "object" &&
    initialProfile.gender
  ) {
    return initialProfile.gender.custom !== gender.custom;
  } else if (
    typeof gender === "string" &&
    typeof initialProfile.gender === "string"
  ) {
    return initialProfile.gender !== gender;
  } else {
    return true;
  }
});

const isIntroValid = ref(true);
const isGenderValid = ref(true);

const setValidIntro = (bool) => {
  isIntroValid.value = bool;
};
const setValidGender = (bool) => {
  isGenderValid.value = bool;
};

const isDisplayNameValid = computed(() => {
  if (profileData === {} || !profileData.displayName) return true;
  return profileData.displayName.length <= 20;
});
const isWebsiteValid = computed(() => {
  if (profileData === {} || !profileData.website) return true;

  const url = profileData.website.trim();
  return (
    url.length === 0 ||
    (profileData.website.length <= 50 &&
      (url.startsWith("https://") || url.startsWith("http://")) &&
      !url.includes(" "))
  );
});

const isProfileValid = computed(
  () =>
    isIntroValid.value &&
    isGenderValid.value &&
    isDisplayNameValid.value &&
    isWebsiteValid.value
);

onMounted(async () => {
  // Tell if userDoc has been resolved
  // Looking for a better way
  if (!userStore.userDoc) {
    const userDocState = computed(() => userStore.userDoc);

    const waitForUserDoc = () => {
      return new Promise((resolve) => {
        const unwatch = watch(userDocState, () => {
          console.log("** watch userDoc **(once) ");
          unwatch();
          resolve();
        });
      });
    };

    await waitForUserDoc();
  }

  const { avatar, ...rest } = userDoc.value;

  for (const key in rest) {
    initialProfile[key] = rest[key];
    profileData[key] = rest[key];
  }
});

const trimProfile = () => {
  const displayName =
    profileData.displayName.trim().length > 0
      ? profileData.displayName.trim().substring(0, 20)
      : profileData.username;

  const intro = profileData.intro.substring(0, 150);

  const gender =
    profileData.gender.custom !== undefined
      ? profileData.gender.custom.length > 0
        ? { custom: profileData.gender.custom.substring(0, 50) }
        : null
      : profileData.gender;

  const website = profileData.website.trim().substring(0, 50);

  const trimmed = { displayName, intro, website };
  if (gender) trimmed.gender = gender;

  return trimmed;
};

const filterUpdated = (newProfile) => {
  const updated = {};

  for (const key in newProfile) {
    if (newProfile[key] !== initialProfile[key]) {
      updated[key] = newProfile[key];
    }
  }

  return updated;
};

const handleUpdateUser = async () => {
  const trimmedProfile = trimProfile(profileData);
  const updatedProfile = filterUpdated(trimmedProfile);

  await updateUserDoc(userStore.user.uid, updatedProfile);
  await userStore.getUserDoc();

  router.push("/" + userDoc.value.username);
};
</script>

<style scoped>
.profileForm input,
:deep(textarea),
:deep(#gender-select) {
  padding: 10px 16px;
  line-height: 20px;

  border-radius: 12px;
  border-color: rgb(219 219 219);

  &:focus {
    border-color: black;
  }
}

.profileForm :deep(#gender-select) {
  padding: 16px;
}
</style>
