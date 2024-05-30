<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
    <div class="text-center">
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        
        transition="scale-transition"
      >
        <template v-slot:activator="{ props }">

          <v-chip
        pill
        class="transparent rounded-pill py-6"
        color="indigo"
            v-bind="props"
      >
        Hola, {{ nombres }}
        <v-avatar class="ml-2">
          <v-img src="../assets/user.png"></v-img>
          
        </v-avatar>
        
        
      </v-chip>
        </template>
  
        <v-card min-width="200">
          <v-list>
            <v-list-item
              prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg">
                <template v-slot:title>
                    {{ nombres}} 
                </template>
                <template v-slot:subtitle>
                    {{ apellidos }} 
                </template>

            </v-list-item>
          </v-list>
  
          <v-divider></v-divider>
  
          <v-list
          :lines="false"
          density="compact"
          nav
        >
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :value="item"
            color="primary"
            @click="item.onClick && item.onClick()"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>

            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item>
        </v-list>
  

          
        </v-card>
      </v-menu>
    </div>
  </template>
  <script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/User';
import { computed } from 'vue';
import { onMounted } from 'vue';
import jwt_decode from 'jwt-decode'; // Importa la librería para decodificar el token JWT
const userStore = useUserStore();

const nombres=computed(()=> userStore.user.nombres);
const apellidos=computed(()=>userStore.user.apellidos);
import { useRouter } from 'vue-router';

const router = useRouter();
// Recuperar la información de sesión del usuario cuando el componente se monta


    const menu=ref(false);

onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    // Decodificar el token para obtener la información del usuario
    const decodedToken = jwt_decode(token);
    const role = decodedToken.user.role;
    const username = decodedToken.user.username;
    const nombres =decodedToken.user.nombres;
    const apellidos=decodedToken.user.apellidos;
    // Establecer la información del usuario en el store
    userStore.setUserRole(role, username,nombres,apellidos);
  }
});
// Función para cerrar sesión
const logout = () => {
  // Eliminar el token del localStorage
  localStorage.removeItem('token');
  // Restablecer el estado del usuario en el store de Pinia
  userStore.clearUser();
  // Redirigir al usuario a la página de inicio de sesión u otra página deseada
  router.push('/');
};
const items = ref([
  { text: 'My Files', icon: 'mdi-folder' },
  { text: 'Shared with me', icon: 'mdi-account-multiple' },
  { text: 'Starred', icon: 'mdi-star' },
  { text: 'Recent', icon: 'mdi-history' },
  { text: 'Offline', icon: 'mdi-check-circle' },
  { text: 'Mi perfil', icon: 'mdi-account-circle-outline' },
  { text: 'Cerrar Sesión', icon: 'mdi-logout-variant',onClick: logout},
]);

</script>