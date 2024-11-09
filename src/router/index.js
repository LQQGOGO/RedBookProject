import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/explore',
      children: [
        {
          path: 'explore',
          component: () => import('@/views/layout/ExplorePage.vue')
        },
        {
          path: 'notificition',
          component: () => import('@/views/layout/NotificationPage.vue')
        },
        {
          path: 'user',
          component: () => import('@/views/layout/UserPage.vue')
        }
      ]
    },
    {
      path: '/search',
      component: () => import('@/views/search/SearchPage.vue')
    }
  ]
})

router.beforeEach(to => {
  const userStore = useUserStore()
  if (!userStore.token && to.path !== '/login') {
    return '/login'
  }
})

export default router
