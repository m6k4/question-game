import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import dayjs from "dayjs";

export function useTimer(startDate: string, duration: number = 3 * 60 * 1000) {
  let timerInterval: ReturnType<typeof setInterval> | null = null;
  const timeLeft = ref(duration);
  const timerEndDate = ref(dayjs(startDate).add(duration, "milliseconds"));

  const isTimerExpired = computed(() => timeLeft.value <= 0);

  const updateTimer = () => {
    const now = dayjs();
    const remainingTime = timerEndDate.value.diff(now);

    timeLeft.value = Math.max(0, remainingTime);
  };

  const startTimer = () => {
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
  };

  const resetTimer = (newStartDate: string) => {
    clearInterval(timerInterval!);
    timerEndDate.value = dayjs(newStartDate).add(duration, "milliseconds");
    updateTimer();
    startTimer();
  };

  const getTimeLeft = () => {
    const minutes = Math.floor((timeLeft.value % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft.value % (1000 * 60)) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  onMounted(() => startTimer());

  onBeforeUnmount(() => {
    if (timerInterval) clearInterval(timerInterval);
  });

  return { 
    timeLeft,
    isTimerExpired,
    getTimeLeft,
    resetTimer 
  };
}