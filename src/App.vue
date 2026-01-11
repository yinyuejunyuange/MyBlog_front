<script setup>
import Navigation from "@/navigation/Navigation.vue";
import AiChat from "@/components/aiChat/AiChat.vue";
import Layout from "@/layout/layout.vue"

</script>

<template>
  <header>
    <Navigation class="navigation" />
  </header>
  <main>
    <div class="container">
      <layout class="layout"/>
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
.navigation{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  z-index: 999;
}
.layout{
  position: fixed;
  top: 80px;
  left: 0;
  width: 100%;
  background-color: #ffffff;
}
</style>
