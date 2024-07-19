<template>
  <TheModal :isShowCloseBtn="false" @close="emits('close')">
    <div class="bg-white rounded-xl overflow-hidden">
      <div class="menuFrame">
        <div class="flex flex-col">
          <div
            class="menuList flex flex-col hover:*:bg-neutral-100 active:*:bg-neutral-200 [&:not(:first-child)]:*:border-t"
          >
            <div
              class="h-12 flex justify-center items-center cursor-pointer"
              @click="isShowConfirm = true"
            >
              <span class="text-sm font-bold text-red-600">Delete</span>
            </div>

            <div
              class="h-12 flex justify-center items-center cursor-pointer"
              @click="
                () => {
                  emits('close');
                  emits('edit');
                }
              "
            >
              <span class="text-sm">Edit</span>
            </div>

            <div
              class="h-12 flex justify-center items-center cursor-pointer"
              @click="emits('close')"
            >
              <span class="text-sm">Cancel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TheModal>

  <ConfirmModal
    v-if="isShowConfirm"
    type="delete"
    @confirm="handleDeletePost"
    @close="isShowConfirm = false"
  />
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  toRefs,
  onBeforeMount,
  defineAsyncComponent,
} from "vue";

import TheModal from "../TheModal.vue";

const ConfirmModal = defineAsyncComponent(() =>
  import("./ConfirmDeleteOrDiscard.vue")
);

import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

import { useAlertStore } from "../../stores/alert";
const alertStore = useAlertStore();

import { usePostStore } from "../../stores/post";
const postStore = usePostStore();

const props = defineProps(["postId", "images", "prevPath"]);

const emits = defineEmits(["edit", "close"]);

const isShowConfirm = ref(false);

const back = () => {
  if (
    props.prevPath &&
    (props.prevPath.endsWith("/")
      ? props.prevPath.slice(0, -1)
      : props.prevPath) !==
      "/post/" + route.params.postId + "/comments"
  ) {
    router.back();
  } else {
    router.push("/");
  }
};

const handleDeletePost = async () => {
  const res = await postStore.deletePost({
    postId: props.postId,
    images: props.images,
  });

  if (res) {
    alertStore.addAlert({
      content: "Sorry, something went wrong.",
    });
  } else {
    alertStore.addAlert({
      content: "Your post was deleted.",
    });

    if (route.name === "postDetails") {
      back();
    } else {
      postStore.hidePostDetails();
    }
  }
};
</script>

<style scoped>
.menuFrame {
  width: min(400px, 80dvw);
  min-width: 260px;
}

.menuList span {
  user-select: none;
}
</style>
