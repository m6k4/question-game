<script setup lang="ts">
import { defineProps } from "vue";
import TheLoader from "@/components/common/TheLoader.vue";

defineProps({
  players: {
    type: Array,
    required: true,
    default: () => [],
  },
});
</script>

<template>
  <div class="WaitingForPlayers">
    <h1>Waiting for all players</h1>
    <TheLoader />
    <div class="WaitingForPlayers__playerList">
      <div
        v-for="player in players"
        :key="player.id"
        class="WaitingForPlayers__playerDetails"
      >
        <p class="WaitingForPlayers__playerName">Player: {{ player.name }}</p>
        <p class="WaitingForPlayers__playerStatus">connected</p>
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

  &__playerList {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    max-width: 400px;
  }

  &__playerDetails {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 16px;
    color: #333;
  }

  &__playerName {
    font-weight: bold;
    font-size: 18px;
  }

  &__playerStatus {
    color: #4caf50;
    font-weight: bold;
  }
}
</style>
