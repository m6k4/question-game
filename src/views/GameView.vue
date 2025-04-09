<script setup lang="ts">
import { useSession } from "@/session/composables/useSession";
import { usePlayer } from "@/player/composables/usePlayer";
import WaitingForPlayers from "@/game/components/WaitingForPlayers.vue";
import SessionIdError from "@/game/components/SessionIdError.vue";
import GameActive from "@/game/components/GameActive.vue";
import CommonLoader from "@/components/common/CommonLoader.vue";
import PlayerCreate from "@/player/components/PlayerCreate.vue";
import { watch, ref, computed } from "vue";

const isPlayerInLocalStorageInList = ref(false);

const { sessionList, isLoading, currentSessionDetails, currentSessionId } =
  useSession();
const { playerList } = usePlayer(currentSessionId);

const isValidSessionId = () => {
  return sessionList.value.some((session) => session.id === currentSessionId);
};

watch(playerList, () => {
  setIsPlayerInLocalStorageInList();
});

const isAllPlayersReady = computed(() => {
  return currentSessionDetails?.value?.playerCount == playerList.value.length;
});

const setIsPlayerInLocalStorageInList = () => {
  const playerData = localStorage.getItem("playerData");
  if (!playerData) {
    isPlayerInLocalStorageInList.value = false;
    return;
  }
  const playerDataId = JSON.parse(playerData).id;
  isPlayerInLocalStorageInList.value = playerList.value.some(
    (player) => player.id === playerDataId,
  );
};

const playerCreated = () => {
  setIsPlayerInLocalStorageInList();
};
</script>

<template>
  <CommonLoader v-if="isLoading" />
  <div v-else class="GameView">
    <SessionIdError v-if="!isValidSessionId()" />
    <div v-else-if="isValidSessionId() && !isAllPlayersReady">
      <WaitingForPlayers
        v-if="isPlayerInLocalStorageInList"
        :players="playerList"
      />
      <PlayerCreate
        v-else
        :session-id="currentSessionId"
        :is-host="false"
        @player-created="playerCreated()"
      />
    </div>
    <div v-else>
      <GameActive :players="playerList" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.GameView {
  height: 100vh;
}
</style>
