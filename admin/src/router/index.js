import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../views/ProjectsView.vue')
    },
    {
      path: '/icons',
      name: 'icons',
      component: () => import('../views/IconsView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/skills',
      name: 'skills',
      component: () => import('../views/SkillsView.vue')
    },
    {
      path: '/colors',
      name: 'colors',
      component: () => import('../views/ColorsView.vue')
    },
    {
      path: '/socials',
      name: 'socials',
      component: () => import('../views/SocialsView.vue')
    },
    {
      path: '/default-window',
      name: 'default-window',
      component: () => import('../views/DefaultWindowView.vue')
    }
  ]
})

export default router
