<script setup lang="ts">
import { onMounted, shallowRef } from "vue";

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
const avatarComponent = shallowRef(null);

const loadAvatar = async () => {
  if (props.avatarName) {
    try {
      //change path due to problem with absolute path
      const avatar = await import(
        `../../assets/avatars/${props.avatarName}.svg`
      );
      avatarComponent.value = avatar.default;
    } catch (error) {
      console.error(`Error loading avatar ${props.avatarName}:`, error);
    }
  }
};

onMounted(loadAvatar);
</script>
<template>
  <div
    class="PlayerAvatar"
    :class="{
      'PlayerAvatar--selected': props.isSelected,
    }"
    @click="() => emit('avatarSelected', props.avatarName)"
  >
    <component :is="avatarComponent" />
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
