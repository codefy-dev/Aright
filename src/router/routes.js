
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'book/:bookId?',
        component: () => import('pages/Book.vue'),
        name: 'Book',
        meta: {
          requiresAuth: true
        },
        alias: '' // alias until we have a default dashboard or something
      },
      {
        path: 'auth',
        component: () => import('pages/Auth.vue'),
        name: 'Auth',
        meta: {
          requiresAuth: false
        }
      }
    ]
  },
  // Always leave this as last one
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
