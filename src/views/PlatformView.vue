<script setup lang="ts">
// import TheFooter from "@/components/platform/TheFooter.vue";
// import TheMenu from "@/components/platform/TheMenu.vue";
// import SessionCreate from "@/session/components/SessionCreate.vue";
// import { db } from "@/firebase";
//get collection from firebase
// import { useCollection, useDocument } from "vuefire";
// import { collection, doc } from "firebase/firestore";

// const sessionDocRef = doc(db, "sessions", "Bz43AUk2snVvkJO3JhY4");
// const playersCollectionRef = collection(sessionDocRef, "players");

// const players = useCollection(playersCollectionRef);

// });
</script>

<template>
  <div class="PlatformView">
    <!-- <TheMenu /> -->
    <div class="PlatformView__content">
      <!-- <SessionCreate /> -->
      <router-view />
    </div>
    <!-- <div class="PlatformView__footer">
      <TheFooter />
    </div> -->
  </div>
</template>

<style scoped lang="scss">
.PlatformView {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100svh;
  background-color: #efdd91;

  &__content {
    padding: 0 40px;
  }

  &__footer {
    margin-top: auto;
  }
}
</style>
