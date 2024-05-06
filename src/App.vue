<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// Verificar la sesión al cargar la aplicación
const token = localStorage.getItem('token');
if (token) {
  // El token existe, redirige al dashboard
  router.replace('/dashboard');
}
</script>
