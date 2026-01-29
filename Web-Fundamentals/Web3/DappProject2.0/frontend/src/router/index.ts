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
      path: '/deploy',
      name: 'deploy',
      component: () => import('../views/DeployView.vue')
    },
    {
      path: '/native',
      name: 'native',
      component: () => import('../views/NativeAssets.vue')
    },
    {
      path: '/erc20',
      name: 'erc20',
      component: () => import('../views/ERC20Assets.vue')
    }
  ]
})

export default router
