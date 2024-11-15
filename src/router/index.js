import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PacmanView from '@/views/PacmanView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/vuetify',
      name: 'vuetify_tree',
      component: () => import('../views/VuetifyTreeView.vue')
    },
    {
      path: '/primevue',
      name: 'primevue_tree',
      component: () => import('../views/PrimevueTreeView.vue')
    },
    {
      path: '/pacman',
      name: 'pacman',
      component: PacmanView
    }
  ]
})

export default router
