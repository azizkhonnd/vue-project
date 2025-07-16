import { createRouter, createWebHistory, type RouteRecordRaw,  } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/employees'
  },
  {
    path: '/employees',
    name: 'Employees',
    component: () => import('../views/employees/index.vue'),
    meta: {
      title: 'Сотрудники'
    }
  },
  {
    path: '/employees/:id',
    name: 'EmployeeDetail',
    component: () => import('../views/employees/index.vue'),
    meta: {
      title: 'Детали сотрудника'
    }
  },
  {
    path: '/documents',
    name: 'Documents',
    component: () => import('../views/documents/index.vue'),
    meta: {
      title: 'Документы'
    }
  },
  {
    path: '/documents/:id',
    name: 'DocumentDetail',
    component: () => import('../views/documents/index.vue'),
    meta: {
      title: 'Детали документа'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = (to.meta?.title as string) || 'Корпоративная Система'
  next()
})

export default router