<script setup lang="ts">
import { ref } from "vue";
import Menubar from "primevue/menubar";
import { useRouter } from "vue-router";

const router = useRouter();

const items = ref([
  {
    label: "Characters",
    icon: "pi pi-home",
    command: () => {
      router.push("/characters");
    },
  },
  {
    label: "Locations",
    icon: "pi pi-star",
    command: () => {
      router.push("/locations");
    },
  },
  {
    label: "Episodes",
    icon: "pi pi-search",
    command: () => {
      router.push("/episodes");
    },
  },
  {
    label: "Favorites",
    icon: "pi pi-heart",
    command: () => {
      router.push("characters/favorites");
    },
  },
]);
</script>

<template>
  <Menubar :model="items" />
</template>
