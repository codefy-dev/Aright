
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: to => {
          // the function receives the target route as the argument
          // we return a redirect path/location here.
          return { path: '/Auth', query: { q: to.params.searchText } }
        },
      },
      {
        path: 'book/:bookId?',
        component: () => import('pages/Book.vue'),
        name: 'Book',
        meta: {
          requiresAuth: true
        }
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
