<template>
  <div class="py-2 bg-purple-500 flex flex-col">
    <div v-for="contact in contacts" @click="enterChat(contact.chatId)">
      <div class="flex gap-3 items-center p-2 py-1 cursor-pointer">
        <div class="avatar online">
          <div class="w-16 rounded-full">
            <img :src="contact.avatar" />
          </div>
        </div>

        <div class="flex flex-col flex-1">
          <div class="flex gap-2 justify-start">
            <p class="font-bold text-gray-200">{{ contact.displayName }}</p>
            <p class="text-gray-200">@{{ contact.username }}</p>
          </div>
        </div>
      </div>
    </div>

    <input
      v-model="userToContact"
      type="text"
      placeholder="Type here"
      class="input input-bordered w-full max-w-xs"
    />
    <button class="btn btn-warning" @click="getUser">Get user</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

const enterChat = (chatId) => {
  messageStore.loadLastMessages(chatId);
  messageStore.setCurrentChat(chatId);
  messageStore.enterChat(true);
};

const userToContact = ref(null);

const getUser = async () => {
  await messageStore.addContact(userToContact.value);
  await messageStore.loadContacts();
};

const contacts = computed(() => messageStore.contactsList);

onMounted(async () => {
  await messageStore.loadContacts();
});
</script>

<style scoped></style>
