<script setup lang="ts">
import { defineProps } from "vue";

defineProps({
  description: {
    type: String,
    required: true,
    default: "",
  },
});
</script>
<template>
  <div class="QuestionCard">
    <div class="QuestionCard__description">
      <p>{{ description }}?</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.QuestionCard {
  background-color: #fff;
  color: #000;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 80%;
  max-width: 500px;
  text-align: center;
  margin-top: auto;
  //add gradient

  &__description {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }
}
</style>
