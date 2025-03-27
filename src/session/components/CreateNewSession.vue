<script setup lang="ts">
import { playerNumberOptions } from "@/utils/constants";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Message from "primevue/message";
import Button from "primevue/button";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { Form } from "@primevue/forms";
import { reactive } from "vue";
import useSession from "@/session/composables/useSession";
import CreateNewPlayer from "@/player/components/CreateNewPlayer.vue";

const toast = useToast();
const { createSession, createdSessionId } = useSession();

const initialValues = reactive({
  sessionName: "",
  playersNumber: "",
});

const resolver = ({ values }) => {
  const errors = {};

  if (!values.sessionName) {
    errors.sessionName = [{ message: "Session name is required." }];
  }

  if (!values.playersNumber) {
    errors.playersNumber = [{ message: "Number of players is required." }];
  }

  return {
    values,
    errors,
  };
};

const onFormSubmit = async ({ values }) => {
  console.log(values);
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Session created successfully",
    life: 3000,
  });

  createSession(values.sessionName, values.playersNumber.code);
};
</script>

<template>
  <div v-if="!createdSessionId" class="CreateNewSession">
    <h1>Create New Session</h1>
    {{ createdSessionId }}
    <Toast />
    <Form
      v-slot="$form"
      class="CreateNewSession__form"
      :initial-values
      :resolver
      @submit="onFormSubmit"
    >
      <InputText
        class="CreateNewSession__form-row"
        name="sessionName"
        type="text"
        placeholder="Session name"
      />
      <Message
        v-if="$form.sessionName?.invalid"
        class="CreateNewSession__form-row"
        severity="error"
        size="small"
        variant="simple"
        >{{ $form.sessionName.error?.message }}</Message
      >
      <Select
        class="CreateNewSession__form-row"
        name="playersNumber"
        :options="playerNumberOptions"
        option-label="name"
        placeholder="Select number of players"
      />
      <Button
        class="CreateNewSession__form-row"
        type="submit"
        severity="secondary"
        label="Submit"
      />
    </Form>
  </div>
  <CreateNewPlayer v-else :session-id="createdSessionId" :is-host="true" />
</template>

<style scoped lang="scss">
.CreateNewSession {
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
