import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { validateToken } from '@/api/validate'

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
          path: '/explore/:id',
          component: () => import('@/components/ItemDetail.vue')
        },
        {
          path: 'publish',
          component: () => import('@/views/layout/PublishPage.vue')
        },
        {
          path: 'notification',
          component: () => import('@/views/layout/NotificationPage.vue')
        },
        {
          path: 'user',
          component: () => import('@/views/layout/UserPage.vue')
        },
        {
          path: 'search',
          component: () => import('@/views/search/SearchPage.vue')
        }
      ]
    }
  ]
})

router.beforeEach(async to => {
  const userStore = useUserStore()
  console.log(userStore.token)
  if (!userStore.token && to.path !== '/login') {
    return '/login'
  }
  if(userStore.token && to.path !== '/login') {
    const res = await validateToken(userStore.token)
    console.log(res)
    if(res.code !== 200) {
      return '/login'
    }
  }
})

export default router
