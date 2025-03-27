<script setup lang="ts">
import { defineProps, onMounted, ref, computed } from "vue";
import useQuestion from "@/composables/useQuestion";
import usePlayer from "@/player/composables/usePlayer";
import useSession from "@/session/composables/useSession";
import Button from "primevue/button";
import { useRoute } from "vue-router";

defineProps({
  players: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const route = useRoute();

const sessionId = route.params.sessionId;

const { currentSessionDetails, updateSession } = useSession();
const { drawQuestion, fetchQuestions, drawnQuestion } = useQuestion();

const { playerList, getCurrentPlayer, currentPlayer } = usePlayer(sessionId);

//save in localstorage index of answering player
const answeringPlayerIndex = ref(0);

const answeringPlayer = ref(null);

onMounted(async () => {
  await getCurrentPlayer();
  await fetchQuestions();
  drawQuestion();
  setAnsweringPlayer();
  localStorage.setItem(
    "playerIndex",
    JSON.stringify(answeringPlayerIndex.value),
  );
  updateSession({
    currentQuestionId: drawnQuestion.value.id,
    currentAnsweringPlayerId: answeringPlayer.value.id,
  });
});

const setAnsweringPlayer = () => {
  const storedIndex = localStorage.getItem("playerIndex");
  if (!storedIndex) {
    answeringPlayerIndex.value = 0;
    localStorage.setItem(
      "playerIndex",
      JSON.stringify(answeringPlayerIndex.value),
    );
  }
  answeringPlayer.value = playerList.value[answeringPlayerIndex.value];
};

const getNextQuestion = async () => {
  drawQuestion();
  updateSession({
    currentQuestionId: drawnQuestion.value.id,
  });
};

const getNextPlayer = async () => {
  if (answeringPlayerIndex.value === playerList.value.length - 1) {
    answeringPlayerIndex.value = 0;
    localStorage.setItem(
      "playerIndex",
      JSON.stringify(answeringPlayerIndex.value),
    );
  } else {
    answeringPlayerIndex.value = answeringPlayerIndex.value + 1;
    localStorage.setItem(
      "playerIndex",
      JSON.stringify(answeringPlayerIndex.value),
    );
  }
  answeringPlayer.value = playerList.value[answeringPlayerIndex.value];
  updateSession({
    currentAnsweringPlayerId: answeringPlayer.value.id,
  });
};

const currentQuestionFromSession = computed(() => {
  return currentSessionDetails.value.currentQuestionId;
});
</script>

<template>
  <div class="ActiveGame">
    <h1>Active Game</h1>
    {{ currentSessionDetails }}
    <div class="ActiveGame__question">
      <div class="ActiveGame__questionText">
        <p>{{ currentQuestionFromSession?.description }}</p>
      </div>
      <div class="ActiveGame__timer">
        <p>3:00</p>
      </div>
    </div>
    <div class="ActiveGame__playerList">
      <div
        v-for="player in players"
        :key="player.id"
        class="ActiveGame__playerDetails"
      >
        <p
          :class="{
            ActiveGame__playerName: true,
            'ActiveGame__playerName--active':
              player.id === currentSessionDetails?.currentAnsweringPlayerId?.id,
          }"
        >
          Player: {{ player.name }}
        </p>
      </div>
    </div>
    <div v-if="currentPlayer?.isHost" class="ActiveGame__hostControls">
      <Button class="ActiveGame__button" @click="getNextPlayer()">
        Next Player
      </Button>
      <Button class="ActiveGame__button" @click="getNextQuestion()">
        Draw a Question
      </Button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ActiveGame {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 80vh;

  &__question {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: 80%;
    max-width: 500px;
    text-align: center;
    margin-top: auto;
  }

  &__questionText {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  &__timer {
    font-size: 18px;
    color: #ff4f4f;
    font-weight: bold;
  }

  &__playerList {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
    margin-bottom: auto;
  }

  &__playerDetails {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    width: 150px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &__playerName {
    font-weight: bold;
    font-size: 16px;

    &--active {
      color: #4caf50;
    }
  }
}
</style>
