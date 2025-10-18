<script setup>
import { ref, watch, nextTick } from 'vue'
import axios from 'axios'
import { debounce } from 'lodash'

const episodes = ref([])
const loading = ref(true)
const searchQuery = ref('')
const error = ref(null)
const containerRef = ref(null)

const fetchEpisodes = debounce(async () => {
  try {
    const scrollPosition = containerRef.value ? containerRef.value.scrollTop : 0
    loading.value = true
    error.value = null
    let url = 'https://rickandmortyapi.com/api/episode/'
    const params = []
    if (searchQuery.value) params.push(`name=${encodeURIComponent(searchQuery.value)}`)
    if (params.length) url += `?${params.join('&')}`
    const response = await axios.get(url)
    const episodesWithCharacters = await Promise.all(
      response.data.results.map(async (episode) => {
        if (episode.characters.length === 0) {
          return { ...episode, characterNames: [] }
        }
        const characterResponses = await Promise.all(
          episode.characters.map((characterUrl) => axios.get(characterUrl))
        )
        const characterNames = characterResponses.map((res) => res.data.name)
        return { ...episode, characterNames }
      })
    )
    episodes.value = episodesWithCharacters
    nextTick(() => {
      if (containerRef.value) {
        containerRef.value.scrollTop = scrollPosition
      }
    })
  } catch (err) {
    error.value = 'No se encontraron episodios o hubo un error'
    episodes.value = []
  } finally {
    loading.value = false
  }
}, 300)

fetchEpisodes()

watch(searchQuery, () => {
  fetchEpisodes()
})
</script>

<template>
  <div class="md:p-6 max-w-full md:max-w-4xl md:mx-auto" ref="containerRef">
    <div class="mb-4 flex gap-2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por nombre..."
        class="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
      />
      <button
        v-if="searchQuery"
        @click="searchQuery = ''"
        class="bg-vue-green text-white px-4 py-2 rounded-lg transition"
      >
        Limpiar
      </button>
    </div>
    <div v-if="loading" class="text-gray-400 text-center">Cargando episodios...</div>
    <div v-else-if="error" class="text-center text-red-400">{{ error }}</div>
    <div v-else-if="episodes.length === 0" class="text-center text-gray-400">
      No se encontraron episodios
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="episode in episodes"
        :key="episode.id"
        class="bg-gray-800 text-white p-4 rounded shadow"
      >
        <h2 class="text-lg font-semibold">{{ episode.name }}</h2>
        <p class="text-sm text-gray-300">Código: {{ episode.episode }}</p>
        <p class="text-sm">Fecha de emisión: {{ episode.air_date }}</p>
        <p class="text-sm">
          Personajes:
          <span v-if="episode.characterNames.length === 0" class="text-gray-400">Ninguno</span>
          <span v-else>{{ episode.characterNames.join(', ') }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-vue-green {
  background-color: #42b983;
}
.bg-vue-green:hover {
  background-color: #3aa876;
  cursor: pointer;
}
</style>