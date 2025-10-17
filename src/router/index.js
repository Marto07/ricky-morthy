import { createRouter, createWebHistory } from 'vue-router'
import CharactersView from '../views/CharactersView.vue'

const routes = [
      {
        path: '/characters',
        name: 'characters',
        component: CharactersView
      }
  ]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
