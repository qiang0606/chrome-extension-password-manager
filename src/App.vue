<template>
  <div class="app-container">
    <Popup />
  </div>
</template>

<script setup>
// import Home from "./views/Home.vue";
import Popup from "./views/Popup.vue";
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100%;
  min-width: 400px;
  min-height: 400px;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}
</style>
