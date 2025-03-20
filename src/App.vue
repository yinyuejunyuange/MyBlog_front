<script setup>
import Edtor from "@/components/editor/Edtor.vue";
import Navigation from "@/navigation/Navigation.vue";
import AiChat from "@/components/aiChat/AiChat.vue";

</script>

<template>
  <header>
    <Navigation />
  </header>

  <main>
<!--    <edtor/>-->
    <RouterView></RouterView>
      <AiChat></AiChat>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;

  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
