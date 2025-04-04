<script setup lang="ts">
import { defineProps, watch } from "vue";
import { useTimer } from "@/game/composables/useTimer";

const props = defineProps({
  startDate: {
    type: String,
    required: true,
    default: "",
  },
});

const { isTimerExpired, getTimeLeft, resetTimer } = useTimer(props.startDate);

watch(
  () => props.startDate,
  (newStartDate) => {
    resetTimer(newStartDate);
  },
);
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
