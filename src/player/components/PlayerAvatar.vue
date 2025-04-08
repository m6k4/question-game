<script setup lang="ts">
const props = defineProps({
  avatarName: {
    type: String,
    required: true,
    default: "amaya",
  },
  isSelected: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const emit = defineEmits(["avatarSelected"]);
</script>
<template>
  <div
    class="PlayerAvatar"
    :class="{
      'PlayerAvatar--selected': props.isSelected,
    }"
    @click="() => emit('avatarSelected', props.avatarName)"
  >
    <img :src="`src/assets/avatars/amaya.svg`" alt="Avatar" />
  </div>
</template>

<style scoped lang="scss">
.PlayerAvatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;

  &--selected {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }
}
</style>
