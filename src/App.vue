<script setup>
  import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/characters">Personajes</RouterLink>
  </nav>
  <RouterView />
</template>

<style scoped></style>
