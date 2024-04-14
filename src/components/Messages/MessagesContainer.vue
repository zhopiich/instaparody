<template>
  <div
    class="z-[1] fixed bottom-0 rounded-t-2xl overflow-hidden bg-white h-[530px] w-[400px] transition-transform duration-300"
    :class="[
      isExtended ? 'translate-y-0' : 'translate-folded',
      { 'flex flex-col': !isEnterChat },
    ]"
    id="container"
  >
    <ContainerTab
      :isEnterChat="isEnterChat"
      :isExtended="isExtended"
      :heightTab="heightTab"
    />

    <div
      class=""
      :class="isEnterChat ? 'absolute top-0 w-full h-full' : 'relative grow'"
    >
      <Transition name="slide">
        <template v-if="isExtended">
          <Chat />
        </template>
      </Transition>
    </div>
  </div>

  <SearchPeople
    v-if="messageStore.isShowSearch"
    @close="messageStore.toggleSearch(false)"
  />
</template>

<script setup>
import Chat from "./Chat.vue";
import SearchPeople from "./SearchPeople.vue";
import ContainerTab from "./ContainerTab.vue";

import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const heightTab = ref("53px");

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

const isEnterChat = computed(() => messageStore.isEnterChat);

const isExtended = computed(() => messageStore.isExtended);

onMounted(() => {
  messageStore.loadContacts();
});

onBeforeUnmount(() => {
  messageStore.triggerUnSubContacts();
});
</script>

<style scoped>
#container {
  left: calc(100dvw - 400px - 32px);
  box-shadow: rgba(101, 119, 134, 0.2) 0px 0px 15px,
    rgba(101, 119, 134, 0.15) 0px 0px 3px 1px;
}

#container:deep(#messagesFlow) {
  padding-top: v-bind(heightTab);
}

.translate-folded {
  transform: translateY(calc(100% - v-bind(heightTab)));
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
