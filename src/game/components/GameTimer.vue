<script setup lang="ts">
import {
  defineProps,
  computed,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
} from "vue";
import dayjs from "dayjs";

const props = defineProps({
  startDate: {
    type: String,
    required: true,
    default: "",
  },
});

let timerInterval: NodeJS.Timeout | null = null;
const timerDuration = 3 * 60 * 1000;
const timeLeft = ref(timerDuration);
const timerEndDate = ref(null);

const isTimerExpired = computed(() => {
  return timeLeft.value <= 0;
});

watch(
  () => props.startDate,
  (newStartDate) => {
    resetTimer(newStartDate);
  },
);

const resetTimer = (newStartDate: string) => {
  clearInterval(timerInterval!);
  setEndDate(newStartDate);
  updateTimer();
  startTimer();
};

const setEndDate = (startDate: string) => {
  timerEndDate.value = dayjs(startDate).add(timerDuration, "milliseconds");
};

const startTimer = () => {
  timerInterval = setInterval(updateTimer, 1000);
};

const getTimeLeft = () => {
  const minutes = Math.floor((timeLeft.value % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft.value % (1000 * 60)) / 1000);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const updateTimer = () => {
  const now = dayjs();
  const remainingTime = timerEndDate.value.diff(now);

  if (remainingTime > 0) {
    timeLeft.value = remainingTime;
  } else {
    timeLeft.value = 0;
  }
};

setEndDate(props.startDate);

onMounted(() => {
  updateTimer();
  startTimer();
});

onBeforeUnmount(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<template>
  <div class="GameTimer">
    <p v-if="isTimerExpired">Time is up!</p>
    <p v-else>{{ getTimeLeft() }}</p>
  </div>
</template>

<style scoped>
.GameTimer {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #333;
  font-size: 24px;
  margin: 20px 0;
}
</style>
