<template>
  <span v-if="!isBraced || !isSent || !contentSegments">{{ content }}</span>

  <template v-else>
    <template v-for="segment in contentSegments">
      <a
        v-if="segment.isUrl"
        :href="(isTherePrefix(segment.content) ? '' : '//') + segment.content"
        rel="noopener noreferrer nofollow"
        target="_blank"
        class="underline hover:decoration-2"
        :class="{ 'text-blue-500': !isFromMe }"
        @click.stop=""
        >{{ segment.content }}</a
      >

      <span v-else>{{ segment.content }}</span>
    </template>
  </template>
</template>

<script setup>
const props = defineProps(["content", "isSent", "isFromMe"]);

import { ref, computed, onMounted } from "vue";

const isBraced = ref(false);

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

const contentSegments = computed(() => {
  if (!isBraced.value) return;
  if (!props.isSent) return;

  const content = props.content;
  const urlsIndexes = messageStore.getUrlsIndexes(content); // [{start, end}]
  if (!urlsIndexes.length) return;

  //
  let lastSlicedIndex = 0;
  const segments = [];

  urlsIndexes.forEach((indexes) => {
    const nonUrlSegment = content.substring(lastSlicedIndex, indexes.start);
    if (nonUrlSegment) segments.push({ content: nonUrlSegment, isUrl: false });

    const urlSegment = content.substring(indexes.start, indexes.end);
    segments.push({ content: urlSegment, isUrl: true });

    lastSlicedIndex = indexes.end;
  });

  // the rest of the content
  if (urlsIndexes.at(-1).end < content.length) {
    segments.push({
      content: content.substring(lastSlicedIndex, content.length),
      isUrl: false,
    });
  }

  return segments;
});

const isTherePrefix = (url) => /^https?:\/\//.test(url);

onMounted(() => {
  isBraced.value = true;
});
</script>

<style scoped></style>
