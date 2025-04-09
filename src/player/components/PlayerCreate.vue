<script setup lang="ts">
import {
  Form,
  type FormSubmitEvent,
  type FormResolverOptions,
} from "@primevue/forms";
import { ref } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Message from "primevue/message";
import { usePlayer } from "@/player/composables/usePlayer";
import { useRouter } from "vue-router";
import AvatarPicker from "@/player/components/AvatarPicker.vue";
import { type FormErrors } from "@/player/types/types";

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

const emit = defineEmits(["playerCreated"]);

const { createPlayer } = usePlayer(props.sessionId);
const avatarName = ref<string>("");

const isLoading = ref(false);
const initialValues = ref({
  name: "",
  isHost: props.isHost,
});

const resolver = (event: FormResolverOptions) => {
  const values = event.values;
  const errors: FormErrors = {};

  if (!values.playerName) {
    errors.playerName = [{ message: "Player name is required." }];
  }

  if (!avatarName.value) {
    errors.avatarName = [{ message: "Avatar is required." }];
  }

  return {
    values,
    errors,
  };
};

const selectAvatar = (name: string) => {
  console.log("Selected avatar:", name);
  avatarName.value = name;
};

const onFormSubmit = async (event: FormSubmitEvent) => {
  const values = event.values;
  const valid = event.valid;
  if (valid) {
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
  }
};
</script>

<template>
  <div class="PlayerCreate">
    <h1>Create New {{ isHost ? "Host" : "Player" }}</h1>
    <h3>Set your player name and choose avatar</h3>
    <Form
      v-slot="$form"
      :initial-values
      :resolver
      class="PlayerCreate__form"
      @submit="onFormSubmit"
    >
      <div class="PlayerCreate__form-row">
        <InputText
          class="PlayerCreate__form-row"
          name="playerName"
          type="text"
          placeholder="Name"
          fluid
        />
        <Message
          v-if="$form.playerName?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.playerName.error?.message }}
        </Message>
      </div>
      <div class="PlayerCreate__form-row">
        <AvatarPicker @select-avatar="selectAvatar" />
        <Message
          v-if="!avatarName"
          severity="error"
          size="small"
          variant="simple"
        >
          Avatar is required.
        </Message>
      </div>
      <Button
        class="PlayerCreate__form-row"
        type="submit"
        severity="secondary"
        label="Submit"
        :loading="isLoading"
      />
    </Form>
  </div>
</template>

<style scoped lang="scss">
.PlayerCreate {
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
    position: relative;
  }

  .p-message {
    position: absolute;
    bottom: -10px;
  }
}
</style>
