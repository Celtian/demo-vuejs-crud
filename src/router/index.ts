import { createRouter, createWebHistory } from 'vue-router'
import NotFoundView from '@/views/NotFoundView.vue'
import PostCreateView from '@/views/PostCreateView.vue'
import PostDetailView from '@/views/PostDetailView.vue'
import PostEditView from '@/views/PostEditView.vue'
import PostListView from '@/views/PostListView.vue'

export const routes = [
  {
    path: '/',
    name: 'post-list',
    component: PostListView,
  },
  {
    path: '/create',
    name: 'post-create',
    component: PostCreateView,
  },
  {
    path: '/:id(\\d+)',
    name: 'post-detail',
    component: PostDetailView,
  },
  {
    path: '/:id(\\d+)/edit',
    name: 'post-edit',
    component: PostEditView,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
