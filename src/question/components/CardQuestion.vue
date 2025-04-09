<script setup lang="ts">
defineProps({
  description: {
    type: String,
    required: true,
    default: "",
  },
});
</script>
<template>
  <div class="CardQuestion">
    <div class="CardQuestion__description">
      <p>{{ description }}?</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Atma:wght@300;400;500;600;700&family=Limelight&family=Playfair+Display&display=swap");

.CardQuestion {
  font-family: "Atma", system-ui;
  font-weight: 400;
  font-style: normal;
  background: rgba(255, 255, 255, 0.6);
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
    margin-bottom: 10px;
  }
}
</style>
