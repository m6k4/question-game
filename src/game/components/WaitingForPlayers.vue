<script setup lang="ts">
import PlayerAvatar from "@/player/components/PlayerAvatar.vue";
import { usePlayer } from "@/player/composables/usePlayer";
import { useSession } from "@/session/composables/useSession";
import Button from "primevue/button";
import { type PropType, ref } from "vue";
import { type Player } from "@/types/types";

defineProps({
  players: {
    type: Array as PropType<Player[]>,
    required: true,
    default: () => [],
  },
});

const { currentSessionId } = useSession();
const { getCurrentPlayer, currentPlayer } = usePlayer(currentSessionId);
const isCopied = ref(false);

getCurrentPlayer();

const copyToClipboard = () => {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(
    () => {
      isCopied.value = true;
    },
    (err) => {
      console.error("Could not copy text: ", err);
      isCopied.value = false;
    },
  );
};
</script>

<template>
  <div class="WaitingForPlayers">
    <h1>Waiting for all players ...</h1>
    <Button
      v-if="currentPlayer?.isHost"
      class="WaitingForPlayers__inviteButton"
      @click="copyToClipboard"
    >
      <i class="pi pi-link" style="font-size: 1.8rem"></i>
      Invite friends
    </Button>
    <p v-if="isCopied" class="WaitingForPlayers__successMessage">
      <i class="pi pi-check"></i>
      Link copied to clipboard!
    </p>
    <div class="WaitingForPlayers__playerList">
      <div
        v-for="player in players"
        :key="player.id"
        class="WaitingForPlayers__playerCard"
      >
        <div class="WaitingForPlayers__cardColumn">
          <PlayerAvatar :avatar-name="player.avatarName" :is-selected="true" />
        </div>
        <div class="WaitingForPlayers__cardColumn">
          <p class="WaitingForPlayers__title">Player name:</p>
          <p class="WaitingForPlayers__playerName">
            {{ player.name }}
          </p>
        </div>
        <div class="WaitingForPlayers__cardColumn">
          <p class="WaitingForPlayers__title">Status:</p>
          <p class="WaitingForPlayers__playerStatus">connected</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.WaitingForPlayers {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;
  padding: 20px;

  &__inviteButton {
    margin: 20px 0;
    color: white;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }

  &__successMessage {
    color: #8d9194;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  &__playerList {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    max-width: 400px;
  }

  &__playerCard {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.4);
    border-radius: 8px;
    font-size: 16px;
    color: #333;
  }

  &__cardColumn {
    display: flex;
    flex-direction: column;
    align-items: left;
  }

  &__title {
    font-size: 1.1rem;
    color: #666;
    font-weight: bold;
  }

  &__playerName {
    font-weight: bold;
    font-size: 1.4rem;
  }

  &__playerStatus {
    color: #4caf50;
    font-weight: bold;
    font-size: 1.4rem;
  }
}
</style>
