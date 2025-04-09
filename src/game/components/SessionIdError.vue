<script setup lang="ts">
import Button from "primevue/button";
import { useRouter } from "vue-router";

const router = useRouter();
</script>
<template>
  <div class="SessionIdError">
    <h1>Wrong Session ID</h1>
    <p>Sorry, the session ID you entered is invalid.</p>

    <Button
      class="SessionIdError__button"
      label="Create new session"
      @click="router.push('/')"
    />
  </div>
</template>

<style scoped lang="scss">
.SessionIdError {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;

  h1 {
    margin-bottom: 20px;
  }

  &__button {
    margin: 20px 0px;
  }
}
</style>
