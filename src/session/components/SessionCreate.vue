<script setup lang="ts">
import { playerNumberOptions, gameLevel } from "@/utils/constants";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Message from "primevue/message";
import Button from "primevue/button";
import {
  Form,
  type FormSubmitEvent,
  type FormResolverOptions,
} from "@primevue/forms";
import { ref } from "vue";
import { useSession } from "@/session/composables/useSession";
import PlayerCreate from "@/player/components/PlayerCreate.vue";
import Popover from "primevue/popover";
import { type FormErrors } from "@/session/types/types";

const { createSession, createdSessionId } = useSession();
const popoverRef = ref();
const isLoading = ref(false);
const initialValues = ref({
  sessionName: "",
  playersNumber: playerNumberOptions[0],
  gameLevel: gameLevel[0],
});

const resolver = (event: FormResolverOptions) => {
  const values = event.values;
  const errors: FormErrors = {};

  if (!values.sessionName) {
    errors.sessionName = [{ message: "Session name is required." }];
  }

  if (!values.playersNumber) {
    errors.playersNumber = [{ message: "Number of players is required." }];
  }

  if (!values.gameLevel) {
    errors.gameLevel = [{ message: "Game level is required." }];
  }

  return {
    values,
    errors,
  };
};

const onFormSubmit = async (event: FormSubmitEvent) => {
  const values = event.values;
  const valid = event.valid;
  if (valid) {
    isLoading.value = true;
    createSession(
      values.sessionName,
      values.playersNumber.code,
      values.gameLevel.code,
    ).then(() => {
      isLoading.value = false;
    });
  }
};

const toggleDescriptionPopover = (event: MouseEvent) => {
  popoverRef.value.toggle(event);
};
</script>

<template>
  <div v-if="!createdSessionId" class="SessionCreate">
    <h1>Welcome to the Fun Connection Game!</h1>
    <p>
      Get ready for a fun and interactive experience designed for everyone!
      Whether you're new to a group or friends looking to share a laugh, this
      game is perfect for you.
    </p>

    <Form
      v-slot="$form"
      class="SessionCreate__form"
      :initial-values
      :resolver
      @submit="onFormSubmit"
    >
      <div class="SessionCreate__form-element">
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
      <div class="SessionCreate__form-element">
        <label for="playersNumber">Select number of players</label>
        <Select
          id="playersNumber"
          name="playersNumber"
          :options="playerNumberOptions"
          option-label="name"
          placeholder="Select"
        />
      </div>
      <div class="SessionCreate__form-element">
        <div class="SessionCreate__form-more-info">
          <label for="gameLevel">Select game level</label>
          <i class="pi pi-info-circle" @click="toggleDescriptionPopover"></i>
          <Popover ref="popoverRef">
            <div class="SessionCreate__popover">
              <div class="SessionCreate__popover-title">
                Choose a game level that suits your group.
              </div>
              <p class="SessionCreate__popover-description">
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
          id="gameLevel"
          name="gameLevel"
          :options="gameLevel"
          option-label="name"
          placeholder="Select"
        />
      </div>
      <Button
        type="submit"
        severity="info"
        label="Submit"
        class="SessionCreate__button"
        :loading="isLoading"
      />
    </Form>
  </div>
  <PlayerCreate v-else :session-id="createdSessionId" :is-host="true" />
</template>

<style scoped lang="scss">
.SessionCreate {
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
    border-radius: 12px;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.4);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 30px;
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
    display: flex;
    flex-direction: column;
    position: relative;

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
    position: absolute;
    top: 90px;
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
