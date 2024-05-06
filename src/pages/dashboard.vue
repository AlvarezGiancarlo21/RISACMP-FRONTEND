<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <component :is="layoutComponent"></component>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/User'; // Importa el store de usuario desde Pinia
import CalidadLayout from '@/layouts/CalidadLayout.vue';
import JefePlantaLayout from '@/layouts/JefePlantaLayout.vue';
import UsuarioLayout from '@/layouts/UserLayout.vue';

const userStore = useUserStore(); // Usa el hook useUserStore para obtener acceso al store de usuario

const layoutComponent = computed(() => {
  const role = userStore.user?.role; // Obtiene el rol del usuario desde el store de usuario
  switch (role) {
    case "Calidad":
      return CalidadLayout; // Componente para usuario de calidad
    case "Jefe de Planta":
      return JefePlantaLayout; // Componente para jefe de planta (administrador)

    default:
      return UsuarioLayout; // Componente para usuarios comunes
  }
});
</script>
