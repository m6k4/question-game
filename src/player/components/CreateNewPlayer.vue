<script setup lang="ts">
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { ref } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { usePlayer } from "@/player/composables/usePlayer";
import { useRouter } from "vue-router";
import AvatarSelect from "@/player/components/AvatarSelect.vue";

const router = useRouter();

const props = defineProps({
  isHost: {
    type: Boolean,
    required: true,
    default: false,
  },
  sessionId: {
    type: String,
    required: true,
    default: "",
  },
});

const { createPlayer } = usePlayer(props.sessionId);

const emit = defineEmits(["playerCreated"]);

const isLoading = ref(false);

const initialValues = ref({
  name: "",
  isHost: props.isHost,
});

const avatarName = ref<string>("");

const selectAvatar = (path: string) => {
  avatarName.value = path;
};

const onFormSubmit = async (event: FormSubmitEvent) => {
  const values = event.values;
  isLoading.value = true;
  createPlayer({
    sessionId: props.sessionId,
    name: values.name,
    isHost: props.isHost,
    avatarName: avatarName.value,
  }).then(() => {
    if (props.isHost) {
      router.push(`/sessionId/${props.sessionId}`);
      isLoading.value = false;
      return;
    }
    isLoading.value = false;
    emit("playerCreated");
  });
};
</script>

<template>
  <div class="CreateNewPlayer">
    <h1>Create New {{ isHost ? "Host" : "Player" }}</h1>
    <h3>Set your player name and choose avatar</h3>
    <Form :initial-values class="CreateNewPlayer__form" @submit="onFormSubmit">
      <InputText
        class="CreateNewPlayer__form-row"
        name="name"
        type="text"
        placeholder="Name"
        fluid
      />
      <AvatarSelect @avatar-selected="selectAvatar" />
      <Button
        class="CreateNewPlayer__form-row"
        type="submit"
        severity="secondary"
        label="Submit"
        :loading="isLoading"
      />
    </Form>
  </div>
</template>

<style scoped lang="scss">
.CreateNewPlayer {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;

  &__form {
    width: 100%;
    max-width: 400px;
  }

  h1 {
    margin-bottom: 20px;
  }

  &__form-row {
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>
