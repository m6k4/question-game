<script setup lang="ts">
import { ref } from "vue";
import InputText from "primevue/inputtext";

const emit = defineEmits(["search"]);

const searchedValue = ref("");

const handleSearch = () => {
  emit("search", searchedValue.value);
};
</script>

<template>
  <InputText
    v-model="searchedValue"
    type="text"
    placeholder="Search by name"
    @input="handleSearch"
  />
</template>
