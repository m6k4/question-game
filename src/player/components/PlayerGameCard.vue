<script setup lang="ts">
import PlayerAvatar from "@/player/components/PlayerAvatar.vue";

const props = defineProps({
  playerName: {
    type: String,
    required: true,
    default: "",
  },
  avatarName: {
    type: String,
    required: true,
    default: "amaya",
  },
  isAnsweringPlayer: {
    type: Boolean,
    required: true,
    default: false,
  },
});
</script>

<template>
  <div
    class="PlayerGameCard"
    :class="{
      'PlayerGameCard--answering': props.isAnsweringPlayer,
    }"
  >
    <PlayerAvatar :avatar-name="props.avatarName" :is-selected="true" />
    <div class="PlayerGameCard__name">{{ props.playerName }}</div>
  </div>
</template>

<style scoped lang="scss">
.PlayerGameCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 200px;
  max-width: 200px;

  &--answering {
    box-shadow: 0 0 10px #a15fca;
    background: rgba(255, 255, 255, 0.4);
  }

  &__name {
    font-size: 20px;
    font-weight: bold;
    margin-top: 10px;
    color: #715a7a;
  }
}
</style>
