<template>
  <div>
    <h2 class="title">Edit profile</h2>
    <div class="changeAvatar">
      <TheAvatar :width="48" :height="48" :src="userDoc?.avatar" />

      <TheUploadBtn @inputChanged="uploadAvatar">Change Avatar</TheUploadBtn>
    </div>
    <form class="profileForm" @submit.prevent="handleUpdateUser">
      <!-- <label for="username">Username: </label>
      <input type="text" v-model="profileData.username" /> -->
      <label for="name">Display name: </label>
      <input type="text" v-model="profileData.displayName" />
      <label for="intro" id="introLabel">Intro: </label>
      <textarea rows="6" v-model="profileData.intro"></textarea>
      <label for="mobilePhone">Phone: </label>
      <input type="text" v-model="profileData.mobilePhone" />

      <label>Gender: </label>
      <div class="genderRadios">
        <div class="radiosOption">
          <input
            type="radio"
            name="gender"
            id="M"
            value="M"
            v-model="profileData.gender"
          />
          Male
        </div>
        <div class="radiosOption">
          <input
            type="radio"
            name="gender"
            id="F"
            value="F"
            v-model="profileData.gender"
          />
          Female
        </div>
        <div class="radiosOption">
          <input
            type="radio"
            name="gender"
            id="O"
            value="O"
            v-model="profileData.gender"
          />
          Others
        </div>
      </div>

      <label for="website">Website: </label>
      <input type="text" v-model="profileData.website" />

      <div class="actions">
        <TheButton type="reset" color="reverse" @click.prevent="router.back()"
          >Cancel</TheButton
        >
        <TheButton type="submit">Confirm</TheButton>
      </div>
    </form>
    <div>{{ progress }}%</div>
  </div>
</template>

<script setup>
import TheButton from "../components/TheButton.vue";
import TheAvatar from "../components/TheAvatar.vue";
import TheUploadBtn from "../components/TheUploadBtn.vue";

import { ref, reactive, computed, onMounted, watch } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { updateUserDoc } from "../firebase/firestore.js";
import { progress, uploadFile } from "../firebase/storage.js";

import { useUserStore } from "../stores/user";
const userStore = useUserStore();

// real-time listenser only "syncable" in template
const userDoc = computed(() => userStore.userDoc);

const profileData = ref({
  // displayName: "",
  // intro: "",
  // mobilePhone: "",
  // gender: "",
  // website: "",
});

onMounted(async () => {
  // Tell if userDoc has been resolved
  // Looking for a better way
  // if (JSON.stringify(userDoc.value) === "{}") {
  //   await userStore.getUserDoc(userStore.user.uid);
  // }
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
  profileData.value = { ...rest };

  if (!rest.displayName) {
    profileData.value.displayName = rest.username;
  }
});

// Avatar updating is independent of profile
async function uploadAvatar(e) {
  const imageFile = e.target.files[0];
  if (!imageFile) return;

  const avatarUrl = await uploadFile(imageFile, "avatars/");
  updateUserDoc(userStore.user.uid, { avatar: avatarUrl });
}

async function handleUpdateUser() {
  await updateUserDoc(userStore.user.uid, profileData.value);
  await userStore.getUserDoc();

  router.push("/" + userDoc.value.username);
}
</script>

<style scoped>
.title {
  margin-bottom: 42px;
  font-size: 24px;
  font-weight: 600;
}

.changeAvatar {
  display: flex;
  align-items: center;
  position: relative;
}

.changeAvatar .button {
  margin-left: 26px;
}

/* .inputFile {
  opacity: 0;
  position: absolute;
  cursor: pointer;
  top: 0;
  bottom: 0;
} */

.profileForm {
  display: grid;
  grid-template-columns: max-content 1fr;
  row-gap: 32px;
  column-gap: 10px;
  margin-top: 38px;
}

.profileForm > label {
  grid-column: 1 / 2;
  justify-self: end;
  align-self: center;
  /* position: relative; */
  /* top: 10px; */
}

.profileForm #introLabel {
  align-self: start;
  position: relative;
  top: 8px;
}

.genderRadios {
  min-height: 36px;
  /* display: grid; */
  /* grid-template-columns: 15px 40px 15px 60px auto; */
  display: flex;
  gap: 0 18px;
  align-items: center;
}

.genderRadios.radiosOption {
  display: flex;
  gap: 0 5px;
  /* align-self: center; */
}

.profileForm .actions {
  grid-column: 1 / 3;
  justify-self: end;
  display: flex;
  gap: 16px;
}
</style>
