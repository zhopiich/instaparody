<template>
  <!-- <div class="flex justify-center mb-2"> -->
  <div v-if="!isSameAsPrev" class="flex justify-center mb-2">
    <div
      class="rounded-full bg-yellow-300 w-fit h-6 px-3 flex justify-center items-center"
    >
      <p class="leading-5">{{ displayDate }}</p>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  shallowRef,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  watchEffect,
  toRef,
} from "vue";

const props = defineProps(["prevMessageAt", "messageAt", "isFromMe", "isLast"]);
const thisTime = toRef(props.messageAt);
const prevTime = computed(() => props.prevMessageAt);

const emit = defineEmits(["lastMounted"]);

const toDate = (time) => new Date(time * 1000);

const dates = computed(() =>
  [prevTime.value, thisTime.value]
    .map((time) => toDate(time))
    .map((date) => ({
      date: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    }))
);

const areSameDay = (date1, date2) => {
  const dateComponents = {
    date: [],
    month: [],
    year: [],
  };

  [date1, date2].forEach((date) => {
    for (const component in date) {
      dateComponents[component].push(date[component]);
    }
  });

  const areSame = {};

  for (const component in dateComponents) {
    areSame[component] =
      dateComponents[component][0] === dateComponents[component][1];
  }

  return areSame.date && areSame.month && areSame.year;
};

const isSameAsPrev = computed(() => areSameDay(...dates.value));

const now = new Date();
const today = {
  date: now.getDate(),
  month: now.getMonth() + 1,
  year: now.getFullYear(),
};

const isToday = computed(() => areSameDay(dates.value[1].date, today));
const isThisYear = computed(() => today.year === dates.value[1].year);

const displayDate = computed(() => {
  const year = !isThisYear.value ? dates.value[1].year + " / " : null;

  return isToday.value
    ? "Today"
    : year + dates.value[1].month + " / " + dates.value[1].date;
});

onMounted(() => {
  if (props.isLast) {
    emit("lastMounted", [isSameAsPrev.value, props.isFromMe]);
  }
});
</script>

<style lang="scss" scoped></style>
