<script setup>
import EpisodeList from "../components/EpisodeList.vue";
</script>

<template>
    <div class="max-w-full md:max-w-4xl md:mx-auto">
        <div class="md:p-6">
            <h1 class="text-3xl text-center font-bold mb-4 ml-5">Episodios de Rick and Morty</h1>
            <EpisodeList />
        </div>
    </div>
</template>

<style scoped>
    h1 {
    color: #42b983;
    }
</style>