/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

import { createRouter, createWebHistory } from 'vue-router/auto';
import { setupLayouts } from 'virtual:generated-layouts';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  extendRoutes: setupLayouts,
});

// Agregar lógica para redirigir desde la ruta principal
router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    const token = localStorage.getItem('token');
    if (token) {
      // El usuario está autenticado, redirige al dashboard
      next('/dashboard');
    } else {
      // El usuario no está autenticado, redirige al login
      next('/login');
    }
  } else {
    next(); // Continuar navegando a la ruta solicitada
  }
});

export default router;
