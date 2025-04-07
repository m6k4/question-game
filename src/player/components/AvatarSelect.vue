<script setup lang="ts">
import { ref } from "vue";
import PlayerAvatar from "@/player/components/PlayerAvatar.vue";
import { avatarNames } from "@/utils/constants";

const emit = defineEmits(["avatarSelected"]);
const selectedAvatar = ref<string | null>(null);

const selectAvatar = (avatarName: string) => {
  selectedAvatar.value = avatarName;
  emit("avatarSelected", avatarName);
};
</script>

<template>
  <div class="AvatarSelect">
    <PlayerAvatar
      v-for="(avatarName, index) in avatarNames"
      :key="index"
      :avatar-name="avatarName"
      :is-selected="selectedAvatar === avatarName"
      class="AvatarSelect__avatar"
      @avatar-selected="selectAvatar"
    />
  </div>
</template>

<style scoped lang="scss">
.AvatarSelect {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;

  &__avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 20px;

    &:hover {
      cursor: pointer;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }

    &--selected {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }

    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>
