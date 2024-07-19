<template>
  <div class="p-4 background-highlight rounded-[20px] flex">
    <div class="grow flex items-center">
      <div>
        <div
          class="w-fit aspect-square rounded-full overflow-hidden"
          :class="!isTherePhoto ? 'pointer-events-none' : ' cursor-pointer'"
          @click.self="isShowMenu = true"
        >
          <label
            class=""
            :class="
              isTherePhoto
                ? 'pointer-events-none'
                : 'pointer-events-auto cursor-pointer'
            "
            for="inputAvatar"
          >
            <TheAvatar :width="56" :src="avatarURL" />
          </label>
        </div>
      </div>

      <div class="px-4 flex flex-col">
        <div class="font-bold leading-5">
          {{ displayName }}
        </div>
        <div class="text-neutral-500 leading-5">
          @{{ profileData.username }}
        </div>
      </div>
    </div>

    <div class="flex flex-col justify-center">
      <TheUploadBtn
        :isLabelDisable="isTherePhoto"
        inputId="inputAvatar"
        @inputChanged="uploadAvatar"
        @clicked="isShowMenu = true"
        >Change photo</TheUploadBtn
      >
    </div>
  </div>

  <ChangePhotoMenu
    v-if="isShowMenu"
    inputId="inputAvatar"
    @close="isShowMenu = false"
    @delete="deleteAvatar"
  />
</template>

<script setup>
import { updateUserDoc } from "../../firebase/firestore.js";
import { uploadFile, deleteFile } from "../../firebase/storage.js";

import TheAvatar from "../../components/TheAvatar.vue";
import TheUploadBtn from "./TheUploadBtn.vue";
import ChangePhotoMenu from "./ChangePhotoMenu.vue";

import { useUserStore } from "../../stores/user";
const userStore = useUserStore();

const props = defineProps(["avatarURL", "profileData"]);

import { ref, computed } from "vue";

const displayName = computed(() => {
  if (!props.profileData.displayName || !props.profileData.displayName.trim())
    return props.profileData.username;

  return props.profileData.displayName.trim().substring(0, 20);
});

const isTherePhoto = computed(
  () => props.avatarURL !== null && props.avatarURL !== ""
);

const isShowMenu = ref(false);

const uploadAvatar = async (e) => {
  const imageFile = e.target.files[0];
  if (!imageFile) return;

  if (isShowMenu.value) isShowMenu.value = false;

  const avatarUrl = await uploadFile(
    imageFile,
    "avatars/" + userStore.userDoc.username + "/"
  );

  await Promise.all(
    [
      updateUserDoc(userStore.user.uid, { avatar: avatarUrl }),
      deleteFile(props.avatarURL),
    ].slice(0, isTherePhoto.value ? 2 : 1)
  );

  await userStore.getUserDoc();
};

const deleteAvatar = async () => {
  isShowMenu.value = false;

  await Promise.all([
    updateUserDoc(userStore.user.uid, { avatar: "" }),
    deleteFile(props.avatarURL),
  ]);

  await userStore.getUserDoc();
};
</script>

<style scoped>
.background-highlight {
  background: rgb(239 239 239);
}
</style>
