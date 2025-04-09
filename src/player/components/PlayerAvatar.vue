<script setup lang="ts">
import { computed } from "vue";

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

const emit = defineEmits(["selectAvatar"]);
const avatarSrc = computed(() => {
  return new URL(
    `../../assets/avatars/${props.avatarName}.svg`,
    import.meta.url,
  ).href;
});
</script>
<template>
  <div
    class="PlayerAvatar"
    :class="{
      'PlayerAvatar--selected': props.isSelected,
    }"
    @click="() => emit('selectAvatar', props.avatarName)"
  >
    <img :src="avatarSrc" alt="Avatar" />
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
