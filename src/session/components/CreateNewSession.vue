<script setup lang="ts">
import { playerNumberOptions, gameLevel } from "@/utils/constants";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Message from "primevue/message";
import Button from "primevue/button";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { Form } from "@primevue/forms";
import { reactive, ref } from "vue";
import useSession from "@/session/composables/useSession";
import CreateNewPlayer from "@/player/components/CreateNewPlayer.vue";
import Popover from "primevue/popover";

const toast = useToast();
const { createSession, createdSessionId } = useSession();
const popoverRef = ref();

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

const toggleDescriptionPopover = (event) => {
  popoverRef.value.toggle(event);
};
</script>

<template>
  <div v-if="!createdSessionId" class="CreateNewSession">
    <Toast />
    <h1>Welcome to the Fun Connection Game!</h1>
    <p>
      Get ready for a fun and interactive experience designed for everyone!
      Whether you're new to a group or friends looking to share a laugh, this
      game is perfect for you.
    </p>

    <Form
      v-slot="$form"
      class="CreateNewSession__form"
      :initial-values
      :resolver
      @submit="onFormSubmit"
    >
      <div class="CreateNewSession__form-element">
        <label for="sessionName">Session name</label>
        <InputText id="sessionName" name="sessionName" type="text" />
        <Message
          v-if="$form.sessionName?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.sessionName.error?.message }}
        </Message>
      </div>
      <div class="CreateNewSession__form-element">
        <label for="playersNumber">Select number of players</label>
        <Select
          id="playersNumber"
          name="playersNumber"
          :options="playerNumberOptions"
          option-label="name"
          placeholder="Select"
        />
      </div>
      <div class="CreateNewSession__form-element">
        <div class="CreateNewSession__form-more-info">
          <label for="qameLevel">Select game level</label>
          <i class="pi pi-info-circle" @click="toggleDescriptionPopover"></i>
          <Popover ref="popoverRef">
            <div class="CreateNewSession__popover">
              <div class="CreateNewSession__popover-title">
                Choose a game level that suits your group.
              </div>
              <p class="CreateNewSession__popover-description">
                <strong>Beginners:</strong> Perfect for those who don't know
                each other well yet.
                <br />
                <strong>Friends:</strong> Ideal for acquaintances looking to
                learn more about one another.
                <br />
                <strong>Good Friends:</strong> Filled with hilarious and
                thought-provoking questions for those who already share bonds!

                <br />
              </p>
            </div>
          </Popover>
        </div>
        <Select
          id="qameLevel"
          name="qameLevel"
          :options="gameLevel"
          option-label="name"
          placeholder="Select"
        />
      </div>
      <Button
        type="submit"
        severity="info"
        label="Submit"
        class="CreateNewSession__button"
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
  min-height: 100vh;
  justify-content: center;

  &__form {
    margin-top: 40px;
    width: 100%;
    max-width: 400px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }

  &__button {
    height: 40px;
    width: 100%;
    margin-top: 20px;
  }

  h1 {
    margin-bottom: 20px;
    text-align: center;
  }

  &__form-element {
    width: 100%;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;

    label {
      color: #333;
      font-size: 16px;
      margin-bottom: 5px;
    }

    input,
    select {
      margin: 0;
      height: 40px;
    }
  }

  &__form-more-info {
    display: flex;
    justify-content: space-between;

    i {
      cursor: pointer;
      color: #007bff;
      font-size: 20px;
    }
    i:hover {
      color: #0056b3;
    }
  }

  .p-message {
    margin-top: -10px;
  }

  &__popover {
    width: 300px;
    padding: 10px;

    &-title {
      font-weight: bold;
      margin-bottom: 10px;
    }

    &-description {
      font-size: 14px;
      color: #555;
    }
  }
}
</style>
