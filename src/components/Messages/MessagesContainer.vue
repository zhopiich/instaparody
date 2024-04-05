<template>
  <div
    class="z-[1] fixed bottom-0 bg-orange-400 h-[500px] w-[450px] transition-transform duration-300"
    :class="isExtended ? 'translate-y-0' : 'translate-y-full'"
    id="container"
  >
    <div
      class="z-[2] absolute -top-14 w-full px-4 flex bg-amber-300 text-4xl hover:cursor-pointer"
      @click="messageStore.toggle"
      id="tab"
    >
      <div v-if="isEnterChat">
        <button class="btn" @click.stop="leaveChat">Back</button>
      </div>

      <div v-if="!isEnterChat" class="grow font-bold">Messages</div>
      <div v-else class="grow flex flex-col justify-center">
        <div class="font-bold text-[20px] leading-6">
          {{ currentContact.displayName }}
        </div>
        <div class="text-[13px] leading-4">@{{ currentContact.username }}</div>
      </div>

      <div v-if="!isEnterChat" class="flex items-center">
        <div
          class="flex items-center justify-center h-10 aspect-square rounded-full cursor-pointer hover:bg-white/35 transition-colors"
          @click.stop="messageStore.toggleSearch(true)"
        >
          <FontAwesomeIcon :icon="faCommentMedical" class="fa-2xs scale-110" />
        </div>
      </div>

      <div class="w-14 text-center">{{ isExtended ? "ˇ" : "^" }}</div>
      <!-- <div class="w-14">a</div> -->
    </div>

    <Transition name="slide">
      <template v-if="isExtended">
        <Chat />
      </template>
    </Transition>
  </div>

  <SearchPeople
    v-if="messageStore.isShowSearch"
    @close="messageStore.toggleSearch(false)"
  />
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCommentMedical } from "@fortawesome/free-solid-svg-icons";

import Chat from "./Chat.vue";
import SearchPeople from "./SearchPeople.vue";

import { ref, shallowRef, computed, onMounted } from "vue";

const heightTab = ref("3.5rem");

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

const currentContact = computed(() => messageStore.currentContact);
const isEnterChat = computed(() => messageStore.isEnterChat);

const isExtended = computed(() => messageStore.isExtended);

const leaveChat = () => {
  messageStore.enterChat(false);
  messageStore.triggerUnSubMessages();
  messageStore.resetNewMessages();
};

onMounted(() => {
  messageStore.contactsListener();
});
</script>

<style scoped>
#container {
  left: calc(100dvw - 450px - 32px);
}

#tab {
  height: v-bind(heightTab);
}

/* Remove the contents after slide down */
.slide-leave-active {
  /* transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); */
  transition: opacity 0s ease 0.3s;
}

.slide-leave-to {
  /* transform: translateY(100%); */
  opacity: 0;
}
</style>
