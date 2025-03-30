<script setup lang="ts">
import { defineEmits } from "vue";
import Button from "primevue/button";

const emit = defineEmits([
  "startGame",
  "getNextPlayer",
  "getNextQuestion",
  "startTimer",
]);
</script>
<template>
  <div class="HostControlsPanel">
    <Button class="HostControlsPanel__button" @click="() => emit('startGame')">
      Start Game
    </Button>
    <Button
      class="HostControlsPanel__button"
      @click="() => emit('getNextPlayer')"
    >
      Next Player
    </Button>
    <Button
      class="HostControlsPanel__button"
      @click="() => emit('getNextQuestion')"
    >
      Draw a Question
    </Button>
    <Button class="HostControlsPanel__button" @click="() => emit('startTimer')">
      Start Timer
    </Button>
  </div>
</template>

<style scoped lang="scss">
.HostControlsPanel {
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  width: 100%;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  max-width: 600px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);

  &__button {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    background-color: #50af53;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #45a049;
    }
  }
}
</style>
