<template>
  <div class="py-2 bg-purple-500 flex flex-col">
    <div v-for="contact in contacts" @click="enterChat(contact.name)">
      <div class="flex gap-3 items-center p-2 py-1 cursor-pointer">
        <div class="avatar online">
          <div class="w-16 rounded-full">
            <img :src="contact.avatar" />
          </div>
        </div>

        <div class="flex flex-col flex-1">
          <div class="flex gap-3 justify-between">
            <p class="font-bold text-gray-200">{{ contact.name }}</p>
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
import { ref, onMounted } from "vue";

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

const enterChat = (who) => {
  messageStore.chooseWho(who);
  messageStore.enterChat(true);
};

const userToContact = ref(null);

const getUser = async () => {
  await messageStore.contactUser(userToContact.value);
  await messageStore.loadContacts();
};

const contacts = ref([]);

onMounted(async () => {
  await messageStore.loadContacts();
});
</script>

<style scoped></style>
