
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue'),
    },
    {
      path: '/list',
      name: 'postlist',
      component: () => import('@/views/PostList.vue'),

    },
    {
      path: '/archive',
      name: 'archivepage',
      component: () => import('@/views/ArchivePage.vue'),
    },
    {
      path: '/add',
      name: 'ArticleAdd',
      component: () => import('@/views/ArticleAdd.vue'),
    },
  ],
})

export default router
