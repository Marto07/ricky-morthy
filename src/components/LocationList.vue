<script setup>
import { ref, watch, nextTick } from 'vue'
import axios from 'axios'
import { debounce } from 'lodash'

const locations = ref([])
const loading = ref(true)
const searchQuery = ref('')
const error = ref(null)
const containerRef = ref(null)

const fetchLocations = debounce(async () => {
  try {
    const scrollPosition = containerRef.value ? containerRef.value.scrollTop : 0
    loading.value = true
    error.value = null
    let url = 'https://rickandmortyapi.com/api/location/'
    const params = []
    if (searchQuery.value) params.push(`name=${encodeURIComponent(searchQuery.value)}`)
    if (params.length) url += `?${params.join('&')}`
    const response = await axios.get(url)
    // Obtener nombres de los residents
    const locationsWithResidents = await Promise.all(
      response.data.results.map(async (location) => {
        if (location.residents.length === 0) {
          return { ...location, residentNames: [] }
        }
        const residentResponses = await Promise.all(
          location.residents.map((residentUrl) => axios.get(residentUrl))
        )
        const residentNames = residentResponses.map((res) => res.data.name)
        return { ...location, residentNames }
      })
    )
    locations.value = locationsWithResidents
    nextTick(() => {
      if (containerRef.value) {
        containerRef.value.scrollTop = scrollPosition
      }
    })
  } catch (err) {
    error.value = 'No se encontraron ubicaciones o hubo un error'
    locations.value = []
  } finally {
    loading.value = false
  }
}, 300)

fetchLocations()

watch(searchQuery, () => {
  fetchLocations()
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
    <div v-if="loading" class="text-gray-400 text-center">Cargando ubicaciones...</div>
    <div v-else-if="error" class="text-center text-red-400">{{ error }}</div>
    <div v-else-if="locations.length === 0" class="text-center text-gray-400">
      No se encontraron ubicaciones
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="location in locations"
        :key="location.id"
        class="bg-gray-800 text-white p-4 rounded shadow"
      >
        <h2 class="text-lg font-semibold">{{ location.name }}</h2>
        <p class="text-sm text-gray-300">Tipo: {{ location.type }}</p>
        <p class="text-sm">Dimensión: {{ location.dimension }}</p>
        <p class="text-sm">
          Residentes:
          <span v-if="location.residentNames.length === 0" class="text-gray-400">Ninguno</span>
          <span v-else>{{ location.residentNames.join(', ') }}</span>
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