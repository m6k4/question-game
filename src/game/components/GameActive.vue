<script setup lang="ts">
import { type PropType } from "vue";
import { useGame } from "@/game/composables/useGame";
import { useSession } from "@/session/composables/useSession";
import GameTimer from "@/game/components/GameTimer.vue";
import CardQuestion from "@/question/components/CardQuestion.vue";
import PanelHostControls from "@/game/components/PanelHostControls.vue";
import PlayerGameCard from "@/player/components/PlayerGameCard.vue";
import { type Player } from "@/types/types";

const props = defineProps({
  players: {
    type: Array as PropType<Player[]>,
    required: true,
    default: () => [],
  },
});

const { currentSessionDetails, currentSessionId } = useSession();
const {
  startGame,
  getNextPlayer,
  getNextQuestion,
  startTimer,
  currentQuestionFromSession,
  currentPlayer,
} = useGame(currentSessionId, props.players);

console.log("currentPlayer");
</script>

<template>
  <div class="GameActive">
    <h1 class="GameActive__title">Let's answer the question!</h1>
    <div v-if="!currentQuestionFromSession" class="GameActive__waiting">
      Wait until host starts the game...
    </div>
    <div v-else class="GameActive__board">
      <CardQuestion
        :description="currentQuestionFromSession?.description ?? ''"
      />
      <GameTimer
        v-if="currentSessionDetails?.timerStartedAt"
        :start-date="currentSessionDetails.timerStartedAt"
      />
      <div class="GameActive__playerList">
        <PlayerGameCard
          v-for="player in players"
          :key="player.id"
          :player-name="player.name"
          :avatar-name="player.avatarName"
          :is-answering-player="
            player.id === currentSessionDetails?.currentAnsweringPlayerRef?.id
          "
        />
      </div>
    </div>
    <PanelHostControls
      v-if="currentPlayer?.isHost"
      @start-game="startGame"
      @get-next-player="getNextPlayer"
      @get-next-question="getNextQuestion"
      @start-timer="startTimer"
    />
  </div>
</template>

<style scoped lang="scss">
.GameActive {
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
