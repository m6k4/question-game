<script setup lang="ts">
import { Form } from "@primevue/forms";
import { defineProps, reactive } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import usePlayer from "@/player/composables/usePlayer";

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

const { createPlayer } = usePlayer();
const initialValues = reactive({
  name: "",
  isHost: props.isHost,
});

const onFormSubmit = async ({ values }) => {
  console.log(values);
  createPlayer({
    sessionId: props.sessionId,
    name: values.name,
    isHost: props.isHost,
  });
};
</script>

<template>
  <div class="CreateNewPlayer">
    <h1>Create New Player</h1>
    <h3>Session id: {{ sessionId }}</h3>
    <Form :initial-values class="CreateNewPlayer__form" @submit="onFormSubmit">
      <div class="flex flex-col gap-1">
        <InputText
          class="CreateNewPlayer__form-row"
          name="name"
          type="text"
          placeholder="Set your player name"
          fluid
        />
      </div>
      <Button
        class="CreateNewPlayer__form-row"
        type="submit"
        severity="secondary"
        label="Submit"
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
