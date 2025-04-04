<!-- <script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useQuestion } from "@/question/composables/useQuestion";
import { usePlayer } from "@/player/composables/usePlayer";
import { useSession } from "@/session/composables/useSession";
import GameTimer from "@/game/components/GameTimer.vue";
import QuestionCard from "@/question/components/QuestionCard.vue";
import { useRoute } from "vue-router";
import HostControlsPanel from "@/game/components/HostControlsPanel.vue";
import PlayerGameCard from "@/player/components/PlayerGameCard.vue";

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
const { drawQuestion, fetchQuestions, drawnQuestion } = useQuestion(
  currentSessionDetails.value.level,
);
const { playerList, getCurrentPlayer, currentPlayer } = usePlayer(sessionId);

const answeringPlayerIndex = ref(0);

const answeringPlayer = ref(null);

onMounted(async () => {
  await getCurrentPlayer();
  await fetchQuestions();
});

const startGame = () => {
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
};

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

const startTimer = () => {
  updateSession({}, true);
};

const currentQuestionFromSession = computed(() => {
  return currentSessionDetails.value.currentQuestionId;
});
</script>

<template>
  <div class="ActiveGame">
    {{ currentSessionDetails }}
    <h1 class="ActiveGame__title">Let's answer the question!</h1>
    <div v-if="!currentQuestionFromSession" class="ActiveGame__waiting">
      Wait until host start the game...
    </div>
    <div v-else class="ActiveGame__board">
      <QuestionCard :description="currentQuestionFromSession?.description" />
      <GameTimer :start-date="currentSessionDetails?.timerStartedAt" />
      <div class="ActiveGame__playerList">
        <div v-for="player in players" :key="player.id">
          <PlayerGameCard
            :player-name="player.name"
            :avatar-name="player.avatarName"
            :is-answering-player="
              player.id === currentSessionDetails?.currentAnsweringPlayerId?.id
            "
          />
        </div>
      </div>
    </div>
    <HostControlsPanel
      v-if="currentPlayer?.isHost"
      @start-game="startGame"
      @get-next-player="getNextPlayer"
      @get-next-question="getNextQuestion"
      @start-timer="startTimer"
    />
  </div>
</template>

<style scoped lang="scss">
.ActiveGame {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
  display: flex;
  align-items: center;
  text-align: center;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  padding: 60px 0;
  min-height: 100vh;

  &__title {
    margin-bottom: 20px;
  }

  &__waiting {
    font-size: 20px;
    color: #888;
    margin-top: 20px;
  }

  &__board {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 600px;
    margin-bottom: 20px;
  }

  &__playerList {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
    margin-bottom: auto;
  }

  &__playerName {
    font-weight: bold;
    font-size: 16px;

    &--active {
      color: #4caf50;
    }
  }
}
</style> -->

<script setup lang="ts">
import { defineProps } from "vue";
import { useGame } from "@/game/composables/useGame";
import { useSession } from "@/session/composables/useSession";
import GameTimer from "@/game/components/GameTimer.vue";
import QuestionCard from "@/question/components/QuestionCard.vue";
import HostControlsPanel from "@/game/components/HostControlsPanel.vue";
import PlayerGameCard from "@/player/components/PlayerGameCard.vue";
import { useRoute } from "vue-router";

const props = defineProps({
  players: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const route = useRoute();
const sessionId = route.params.sessionId;
const { currentSessionDetails } = useSession();
const {
  startGame,
  getNextPlayer,
  getNextQuestion,
  startTimer,
  currentQuestionFromSession,
  currentPlayer,
} = useGame(sessionId, props.players);
</script>

<template>
  <div class="ActiveGame">
    <h1 class="ActiveGame__title">Let's answer the question!</h1>
    <div v-if="!currentQuestionFromSession" class="ActiveGame__waiting">
      Wait until host starts the game...
    </div>
    <div v-else class="ActiveGame__board">
      <QuestionCard :description="currentQuestionFromSession?.description" />
      <GameTimer
        v-if="currentSessionDetails?.timerStartedAt"
        :start-date="currentSessionDetails.timerStartedAt"
      />
      <div class="ActiveGame__playerList">
        <PlayerGameCard
          v-for="player in players"
          :key="player.id"
          :player-name="player.name"
          :avatar-name="player.avatarName"
          :is-answering-player="
            player.id === currentSessionDetails?.currentAnsweringPlayerId?.id
          "
        />
      </div>
    </div>
    <HostControlsPanel
      v-if="currentPlayer?.isHost"
      @start-game="startGame"
      @get-next-player="getNextPlayer"
      @get-next-question="getNextQuestion"
      @start-timer="startTimer"
    />
  </div>
</template>

<style scoped lang="scss">
.ActiveGame {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
  display: flex;
  align-items: center;
  text-align: center;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  padding: 60px 0;
  min-height: 100vh;

  &__title {
    margin-bottom: 20px;
  }

  &__waiting {
    font-size: 20px;
    color: #888;
    margin-top: 20px;
  }

  &__board {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 600px;
    margin-bottom: 20px;
  }

  &__playerList {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
    margin-bottom: auto;
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
