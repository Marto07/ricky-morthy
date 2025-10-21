<script setup>
    import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="bg-gray-950 text-white min-h-screen scrollbar-stable flex flex-col">
    <!-- Header -->
    <header class="p-6 max-w-full md:max-w-4xl md:mx-auto text-center">
      <RouterLink to="/"> 
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-vue-green cursor-pointer">
          Portal Finder 3000
        </h1>
      </RouterLink>
      <p class="mt-2 text-sm md:text-base text-gray-300 opacity-50">
        Una aplicación web para localizar personajes, ubicaciones y episodios a través del multiverso
      </p>
    </header>

    <!-- Navegación -->
    <nav class="p-6 max-w-full md:max-w-4xl md:mx-auto flex justify-center gap-6 text-lg font-semibold">
      <RouterLink
        to="/characters"
        class="text-gray-300 hover:text-vue-green transition"
        active-class="text-vue-green underline underline-offset-4"
      >
        Personajes
      </RouterLink>
      <RouterLink
        to="/locations"
        class="text-gray-300 hover:text-vue-green transition"
        active-class="text-vue-green underline underline-offset-4"
      >
        Ubicaciones
      </RouterLink>
      <RouterLink
        to="/episodes"
        class="text-gray-300 hover:text-vue-green transition"
        active-class="text-vue-green underline underline-offset-4"
      >
        Episodios
      </RouterLink>
    </nav>

    <!-- Contenido -->
    <main class="p-6 max-w-full md:max-w-4xl md:mx-auto flex-grow">
      <RouterView />
    </main>
    <!-- Footer -->
    <footer class="text-center text-gray-500 text-sm opacity-50 py-6 select-none">
      © 2025 <span class="text-vue-green">Martin Coppa</span>. Todos los derechos reservados.
    </footer>
  </div>
</template>

<style scoped>
.bg-vue-green {
  background-color: #42b983;
}
.text-vue-green {
  color: #42b983;
}
.bg-vue-green:hover {
  background-color: #3aa876;
}
.scrollbar-stable {
  scrollbar-gutter: stable;
}

</style>