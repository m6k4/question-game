<script setup lang="ts">
import { useRoute } from "vue-router";
import useSession from "@/session/composables/useSession";
import WaitingForPlayers from "@/game/components/WaitingForPlayers.vue";
import WrongSessionId from "@/game/components/WrongSessionId.vue";
import TheLoader from "@/components/common/TheLoader.vue";

const route = useRoute();
const { sessionList, isLoading, currentSessionDetails } = useSession();

const sessionId = route.params.sessionId;

// Check if the session ID is valid
const isValidSessionId = () => {
  return sessionList.value.some((session) => session.id === sessionId);
};
</script>

<template>
  <TheLoader v-if="isLoading" />
  <div v-else class="GameView">
    {{ currentSessionDetails }}
    <WaitingForPlayers v-if="isValidSessionId()" />
    <WrongSessionId v-else />
  </div>
</template>

<style scoped>
.GameView {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
