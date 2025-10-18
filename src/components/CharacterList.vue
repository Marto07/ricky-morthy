<script setup>
import { ref, watch, nextTick } from 'vue'
import axios from 'axios'
import { debounce } from 'lodash'

const characters = ref([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref(null)
const error = ref(null)
const containerRef = ref(null) // Nuevo: ref para el contenedor

const fetchCharacters = debounce(async () => {
  try {
    // Guardar la posición de scroll antes de la petición
    const scrollPosition = containerRef.value ? containerRef.value.scrollTop : 0
    loading.value = true
    error.value = null
    let url = 'https://rickandmortyapi.com/api/character/'
    const params = []
    if (searchQuery.value) params.push(`name=${encodeURIComponent(searchQuery.value)}`)
    if (statusFilter.value) params.push(`status=${statusFilter.value}`)
    if (params.length) url += `?${params.join('&')}`
    const response = await axios.get(url)
    characters.value = response.data.results
    // Restaurar scroll después del render
    nextTick(() => {
      if (containerRef.value) {
        containerRef.value.scrollTop = scrollPosition
      }
    })
  } catch (err) {
    error.value = 'No se encontraron personajes o hubo un error'
    characters.value = []
  } finally {
    loading.value = false
  }
}, 300)

fetchCharacters()

watch([searchQuery, statusFilter], () => {
  fetchCharacters()
})

const toggleStatus = (status) => {
  statusFilter.value = statusFilter.value === status ? null : status
}
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
    <div class="mb-4 flex gap-2 justify-center">
      <button
        @click="toggleStatus('alive')"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition',
          statusFilter === 'alive' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        ]"
      >
        Vivo
      </button>
      <button
        @click="toggleStatus('dead')"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition',
          statusFilter === 'dead' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        ]"
      >
        Muerto
      </button>
      <button
        @click="toggleStatus('unknown')"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition',
          statusFilter === 'unknown' ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        ]"
      >
        Desconocido
      </button>
    </div>
    <div v-if="loading" class="text-gray-400 text-center">Cargando personajes...</div>
    <div v-else-if="error" class="text-center text-red-400">{{ error }}</div>
    <div v-else-if="characters.length === 0" class="text-center text-gray-400">
      No se encontraron personajes
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="character in characters"
        :key="character.id"
        class="bg-gray-800 text-white p-4 rounded shadow"
      >
        <img :src="character.image" :alt="character.name" class="rounded mb-2" />
        <h2 class="text-lg font-semibold">{{ character.name }}</h2>
        <p class="text-sm text-gray-300">Raza: {{ character.species }}</p>
        <p
          class="text-sm"
          :class="{
            'text-green-400': character.status === 'Alive',
            'text-red-400': character.status === 'Dead',
            'text-yellow-400': character.status === 'unknown'
          }"
        >
          Estado: {{ character.status }}
        </p>
        <p class="text-sm">Género: {{ character.gender }}</p>
        <p class="text-sm">Ubicación actual: {{ character.location.name }}</p>
        <p class="text-sm">Origen: {{ character.origin.name }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
img {
  width: 100%;
  height: auto;
}

.bg-vue-green {
  background-color: #42b983;
}
.bg-vue-green:hover {
  background-color: #3aa876;
  cursor: pointer;
}
</style>