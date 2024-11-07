import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/home',
      children: [
        {
          path: 'home',
          component: () => import('@/views/layout/HomePage.vue')
        },
        {
          path: 'sort',
          component: () => import('@/views/layout/SortPage.vue')
        },
        {
          path: 'shoppingcar',
          component: () => import('@/views/layout/ShoppingCar.vue')
        },
        { path: 'user', component: () => import('@/views/layout/UserPage.vue') }
      ]
    },
    {
      path: '/search',
      component: () => import('@/views/search/SearchPage.vue')
    },
    {
      path: '/searchlist',
      component: () => import('@/views/search/SearchList.vue')
    },
    {
      path: '/prodetail/:id',
      component: () => import('@/views/prodetail/ProDetail.vue')
    },
    {
      path: '/pay',
      component: () => import('@/views/pay/PayPage.vue')
    },
    {
      path: '/myorder',
      component: () => import('@/views/myorder/MyOrder.vue')
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
