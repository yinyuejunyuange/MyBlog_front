<script setup>
import Navigation from "@/navigation/Navigation.vue";
import AiChat from "@/components/aiChat/AiChat.vue";
import Layout from "@/layout/layout.vue"

</script>

<template>
  <header>
    <Navigation />
  </header>
  <main>
    <div class="container">
      <layout/>
      <div class="content">
        <RouterView></RouterView>
        <AiChat></AiChat>
      </div>
    </div>

  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;

  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}

.container{
  display: flex;
}
</style>
