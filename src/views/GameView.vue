<script setup lang="ts">
import { useRoute } from "vue-router";
import useSession from "@/session/composables/useSession";
import usePlayer from "@/player/composables/usePlayer";
import WaitingForPlayers from "@/game/components/WaitingForPlayers.vue";
import WrongSessionId from "@/game/components/WrongSessionId.vue";
import ActiveGame from "@/game/components/ActiveGame.vue";
import TheLoader from "@/components/common/TheLoader.vue";
import CreateNewPlayer from "@/player/components/CreateNewPlayer.vue";
import { watch, ref, computed } from "vue";

const route = useRoute();

const sessionId = route.params.sessionId;
const isPlayerInLocalStorageInList = ref(false);

const { sessionList, isLoading, currentSessionDetails } = useSession();
const { playerList } = usePlayer(sessionId);

const isValidSessionId = () => {
  return sessionList.value.some((session) => session.id === sessionId);
};

watch(playerList, () => {
  setIsPlayerInLocalStorageInList();
});

const isAllPlayersReady = computed(() => {
  return currentSessionDetails.value.playerCount == playerList.value.length;
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
  <TheLoader v-if="isLoading" />
  <div v-else class="GameView">
    <WrongSessionId v-if="!isValidSessionId()" />
    <div v-else-if="isValidSessionId() && !isAllPlayersReady">
      <WaitingForPlayers
        v-if="isPlayerInLocalStorageInList"
        :players="playerList"
      />
      <CreateNewPlayer
        v-else
        :session-id="sessionId"
        :is-host="false"
        @player-created="playerCreated()"
      />
    </div>
    <div v-else>
      <ActiveGame :players="playerList" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.GameView {
  height: 100vh;
}
</style>
