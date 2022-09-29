import { createRouter, createWebHistory } from 'vue-router'
import UserView from '../views/UserView.vue'
import LoginView from '../views/LoginView.vue'
import TaskView from '../views/TaskView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'TaskView',
      component: TaskView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/user',
      name: 'user',
      component: UserView
    }
  ]
})

export default router
