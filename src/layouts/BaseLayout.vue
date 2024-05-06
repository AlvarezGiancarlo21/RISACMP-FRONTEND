<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app>
    <v-layout>
      <!--Drawer 1-->
      <v-navigation-drawer
        permanent
        v-model="drawer1"
        class="navigation-drawer"
      >
      <v-list >
          <v-list-item>
            <v-img
  :width="300"
  aspect-ratio="4/3"
  cover
  src="/src//assets/Imagenes/logo5.png"
></v-img>
          </v-list-item>
          <v-list-item class="item"
            prepend-avatar="/src/assets/user.png"
            :title="nombres"
            :subtitle="apellidos"
            style="background-color: #fff; color: #000; padding: 15px;"
            to="/dashboard/account"
          >
          <!-- <v-list-item>
            <p style="color: black;">{{ user }}</p>
          </v-list-item> -->
          <v-list-item>
            <p style="color: black">{{ role }}</p>
          </v-list-item>
        </v-list-item>


      </v-list>

        <v-divider></v-divider>

        <v-divider></v-divider>

        <v-list
          density="compact"
          nav
        >
          <v-list-item  class="item" title="Dashboard" prepend-icon="mdi-view-dashboard" value="dashboard" to="/dashboard/home"></v-list-item>
          <v-list-item v-if="role === 'Jefe de Planta' || role === 'Jefe de Produccion' || role === 'Encargado de Produccion'" class="item" prepend-icon="mdi-factory" title="Produccion" @mouseover="showDrawerProduccion()" @mouseleave="hideDrawerProduccion()"></v-list-item>
          <v-list-item class="item" title="Productos" prepend-icon="mdi-star-circle-outline" value="products" @mouseover="showDrawer2()" @mouseleave="hideDrawer2()"></v-list-item>
          <v-list-item v-if="role === 'Calidad'" class="item" prepend-icon="mdi-gavel" title="Validar Prductos" to="/dashboard/validar-productos"></v-list-item>
          <!-- <v-list-item class="item" title="Mensajes" prepend-icon="mdi-forum" value="messages"></v-list-item> -->
          <!-- <v-list-item v-if="role === 'Jefe de Planta'"  class="item" prepend-icon="mdi-home-city" title="Funcionalidad Jefe" value="home" ></v-list-item> -->
          <!-- <v-list-item class="item" prepend-icon="mdi-folder-multiple" title="Servicios" value="services"  ></v-list-item> -->
          <!-- <v-list-item class="item" prepend-icon="mdi-account-group-outline" title="Users" value="users" to="/dashboard/users"></v-list-item> -->
          <!-- <v-list-item class="item" prepend-icon="mdi-logout" title="Salir" value="signout"  ></v-list-item> -->
          <!-- <v-list-item class="item" prepend-icon="mdi-home-city" title="Inicio" value="home" ></v-list-item> -->
          <!-- <v-list-item class="item" prepend-icon="mdi-account" title="Mi cuenta" value="account" to="/dashboard/account" ></v-list-item> -->
          <v-list-item v-if="role === 'Jefe de Planta'" class="item" prepend-icon="mdi-account-group-outline" title="Usuarios" value="users" to="/dashboard/gestionar-usuarios"></v-list-item>
          <v-list-item v-if="role === 'Jefe de Planta'" class="item" prepend-icon="mdi-gavel" title="Admin"></v-list-item>

          <v-list-item v-if="role === 'Calidad'" class="item" prepend-icon="mdi-gavel" title="Funcionalidad Calidad"></v-list-item>
          <v-list-item v-if="role === 'Chef'" class="item" prepend-icon="mdi-chef-hat" title="Gestionar Recetas" to="/dashboard/gestionar-recetas"></v-list-item>
        </v-list>
        <template v-slot:append>
          <div class="pa-2" >
            <v-btn block style="background-color: aliceblue;color: black;" @click="logout">
              Cerrar Sesion
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>

      <!--Drawer expandido Productos-->
      <v-navigation-drawer permanent v-model="drawer2" style="background-color:aliceblue;" @mouseenter="cancelHideTimer()" @mouseleave="startHideTimer()">
        <v-list  density="compact" nav>
          <v-list-item title="Gestionar Productos" value="home" prepend-icon="mdi-home" ></v-list-item>

          <v-list-item title="Materia Prima" value="contacts" prepend-icon="mdi-contacts"></v-list-item>

          <v-list-item title="Inventario" value="settings" prepend-icon="mdi-cog"></v-list-item>
        </v-list>
      </v-navigation-drawer>

        <!--Drawer expandido Produccion-->
      <v-navigation-drawer permanent v-model="drawerProduccion" style="background-color:aliceblue;" @mouseenter="cancelHideTimerDrawerProduccion()" @mouseleave="startHideTimerDrawerProduccion()">
        <v-list  density="compact" nav>
          <!--Jefe de Planta-->
          <v-list-item v-if="role === 'Jefe de Planta'" title="Autorizar Produccion" value="autorizarProd" prepend-icon="mdi-package-variant-closed-check" to="/dashboard/autorizar-produccion"></v-list-item>

          <v-list-item v-if="role === 'Jefe de Planta'" title="Consultar Lista Produccion" value="consultarProd" prepend-icon="mdi-format-list-group" to="/dashboard/consultar-list-produccion" ></v-list-item>

          <!--Jefe de Produccion-->
          <v-list-item v-if="role === 'Jefe de Produccion'" to="/dashboard/visualizar-receta" title="Visualizar Recetas" value="vRecetas" prepend-icon="mdi-chef-hat" ></v-list-item>
          <v-list-item v-if="role === 'Jefe de Produccion'" to="/dashboard/visualizar-historico" title="Visualizar Historico" value="vHistorico" prepend-icon="mdi-history" ></v-list-item>
          <v-list-item v-if="role === 'Jefe de Produccion'" to="/dashboard/gestionar-planta" title="Gestionar Planta" value="gestionarPlanta" prepend-icon="mdi-factory" ></v-list-item>
          <v-list-item v-if="role === 'Jefe de Produccion'" to="/dashboard/consultar-stock" title="Consultar Stock" value="cStock" prepend-icon="mdi-list-status" ></v-list-item>
          <v-list-item v-if="role === 'Jefe de Produccion'" to="/dashboard/consultar-reporte-merma" title="Consultar Reporte de Merma" value="cReporteMerma" prepend-icon="mdi-format-indent-decrease" ></v-list-item>

          <!--Encargado de Produccion-->
          <v-list-item v-if="role === 'Encargado de Produccion'" to="/dashboard/materia-prima" title="Materia Prima" value="mPrima" prepend-icon="mdi-food-steak" ></v-list-item>
          <v-list-item v-if="role === 'Encargado de Produccion'" to="/dashboard/productos-terminados" title="Productos Terminados" value="pTerminados" prepend-icon="mdi-package-variant-closed-check" ></v-list-item>
          <v-list-item v-if="role === 'Encargado de Produccion'" to="/dashboard/registrar-merma" title="Registrar Merma" value="rMerma" prepend-icon="mdi-format-indent-decrease" ></v-list-item>
        </v-list>
      </v-navigation-drawer>



    <!--------------------------->
    <!--------------------------->
    <!----Barra de navegcion----->
    <!--------------------------->
    <!--------------------------->
    <v-app-bar  >
      <template v-slot:prepend>
        <v-btn style="background-color:black;color: white"
              class="mr-3"
              elevation="1"
              fab
              small
              variant="text"
              icon="mdi-dots-vertical"
              :rail="rail"
              @click.stop="drawer1 = !drawer1"
        >
      </v-btn>
      </template>

      <template v-slot:append>

        <v-btn icon="mdi-view-quilt"></v-btn>


        <v-btn
            class="ml-2"
            min-width="0"
            text
        >
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
    </v-app-bar>
      <v-main class="d-flex align-center justify-center" style="max-height: auto;" >
        <router-view/>
      </v-main>
    </v-layout>
  </v-app>
</template>


<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/User';
import { computed } from 'vue';
import { onMounted } from 'vue';
import jwt_decode from 'jwt-decode'; // Importa la librería para decodificar el token JWT
const userStore = useUserStore();

// Define referencias reactivas para username y role
// const user = computed(() => userStore.user.username);
const role = computed(() => userStore.user.role);
const nombres=computed(()=> userStore.user.nombres);
const apellidos=computed(()=>userStore.user.apellidos);
// Variables reactivas

// Define referencias reactivas para username y role


// // Recuperar la información de sesión del usuario cuando el componente se monta
// onMounted(() => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     // Decodificar el token para obtener la información del usuario
//     const decodedToken = jwt_decode(token);
//     role.value = decodedToken.user.role;
//   }
// });



// Recuperar la información de sesión del usuario cuando el componente se monta
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






let hideTimer;
const drawer1=ref(true);
const drawer2=ref(false);
const drawerProduccion=ref(false)

import { useRouter } from 'vue-router';

const router = useRouter();



// Función para cerrar sesión
const logout = () => {
  // Eliminar el token del localStorage
  localStorage.removeItem('token');
  // Restablecer el estado del usuario en el store de Pinia
  userStore.clearUser();
  // Redirigir al usuario a la página de inicio de sesión u otra página deseada
  router.push('/');
};


// Funciones drawer Produccion
const showDrawerProduccion = () => {
  drawerProduccion.value = true;
};

const hideDrawerProduccion = () => {
  hideTimer = setTimeout(() => {
    drawerProduccion.value = false;
  }, 50); // 500ms de retraso
};

const startHideTimerDrawerProduccion = () => {
  hideTimer = setTimeout(() => {
    drawerProduccion.value = false;
  }, 50); // 500ms de retraso
};

const cancelHideTimerDrawerProduccion = () => {
  clearTimeout(hideTimer);
};



// Funciones drawer 2 ==>Productos
const showDrawer2 = () => {
  drawer2.value = true;
};

const hideDrawer2 = () => {
  hideTimer = setTimeout(() => {
    drawer2.value = false;
  }, 50); // 500ms de retraso
};

const startHideTimer = () => {
  hideTimer = setTimeout(() => {
    drawer2.value = false;
  }, 50); // 500ms de retraso
};

const cancelHideTimer = () => {
  clearTimeout(hideTimer);
};

</script>
<style scoped>
  .navigation-drawer{
    background-color:black;
  }
  .item{
    color: aliceblue;
  }
  .item:hover{
    background-color: #3d5252;
  }
</style>
