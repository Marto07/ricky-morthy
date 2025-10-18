import { createRouter, createWebHistory } from 'vue-router'
import CharactersView from '../views/CharactersView.vue'
import LocationsView from '@/views/LocationsView.vue'
import EpisodesView from '@/views/EpisodesView.vue'
import HomeView from '@/views/HomeView.vue'

const routes = [
      {
        path: '/',
        name: 'home',
        component: HomeView 
      },
      {
        path: '/characters',
        name: 'characters',
        component: CharactersView
      },
      {
        path: '/locations',
        name: 'locations',
        component: LocationsView
      },
      {
        path: '/episodes',
        name: 'episodes',
        component: EpisodesView
      }
  ]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
