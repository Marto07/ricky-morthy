<script setup>
    import { ref, onMounted } from 'vue'
    import axios from 'axios'

    const characters = ref([])
    const loading = ref(true)

    onMounted(async () => {
    try {
        const response = await axios.get('https://rickandmortyapi.com/api/character/')
        characters.value = response.data.results
    } catch (error) {
        console.error('Error al obtener personajes:', error)
    } finally {
        loading.value = false
    }
    })
</script>

<template>
  <div>
    <div v-if="loading" class="text-gray-500">Cargando personajes...</div>
    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="character in characters"
        :key="character.id"
        class="bg-gray-800 text-white p-4 rounded shadow"
      >
        <img :src="character.image" :alt="character.name" class="rounded mb-2" />
        <h2 class="text-lg font-semibold">{{ character.name }}</h2>
        <p class="text-sm text-gray-300">{{ character.species }}</p>
        <p
          class="text-sm"
          :class="{
            'text-green-400': character.status === 'Alive',
            'text-red-400': character.status === 'Dead',
            'text-yellow-400': character.status === 'unknown'
          }"
        >
          {{ character.status }}
        </p>
      </div>
    </div>
  </div>

</template>

<style scoped>
    img {
    width: 100%;
    height: auto;
    }
</style>

    