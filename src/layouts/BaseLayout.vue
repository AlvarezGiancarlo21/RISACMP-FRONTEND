<!-- eslint-disable vue/multi-word-component-names -->
<template>

  <v-app>
    <v-layout>
      <!--Drawer 1-->

      <v-navigation-drawer
        permanent
        v-model="drawer1"
        class="navigation-drawer"
        floating
        fixed
      right
      >
      <vue-perfect-scrollbar
      :settings="{ suppressScrollX: true, wheelPropagation: false }"
      class="ps"
      style="height: 100%">
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
            style="background-color:#990000; color:#fff; padding: 10px; text-align:justify;"
            to="/dashboard/account"
          >
          <v-divider></v-divider>
          <!-- <v-list-item>
            <p style="color: black;">{{ user }}</p>
          </v-list-item> -->

            <p style="color: white">{{ role }}</p>

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

          <!--Rol Logistico-->
          <v-list-item v-if="role === 'Logistico'" class="item" prepend-icon="mdi-account-tie" title="Provedores" to="/dashboard/gestionar-provedores" ></v-list-item>
          <v-list-item v-if="role === 'Logistico'" class="item" prepend-icon="mdi-list-box" title="Facturas" to="/dashboard/gestion-facturas" ></v-list-item>
          <v-list-item v-if="role === 'Logistico'" class="item" prepend-icon="mdi-credit-card-edit" title="Nota de Credito" to="/dashboard/nota-de-credito" ></v-list-item>
          <v-list-item v-if="role === 'Logistico'" class="item" prepend-icon="mdi-shopping" title="Ordenes de Compra" to="/dashboard/ordenes-compras" ></v-list-item>
          <v-list-item v-if="role === 'Calidad'" class="item" prepend-icon="mdi-gavel" title="Validar Prductos" to="/dashboard/validar-productos"></v-list-item>
          <v-list-item v-if="role === 'Jefe de Planta'" class="item" prepend-icon="mdi-account-group-outline" title="Usuarios" value="users" to="/dashboard/gestionar-usuarios"></v-list-item>
          <v-list-item v-if="role === 'Jefe de Planta'" class="item" prepend-icon="mdi-gavel" title="Admin"></v-list-item>

          <v-list-item v-if="role === 'Calidad'" class="item" prepend-icon="mdi-gavel" title="Funcionalidad Calidad"></v-list-item>
          <v-list-item v-if="role === 'Chef'" class="item" prepend-icon="mdi-chef-hat" title="Gestionar Recetas" to="/dashboard/gestionar-recetas"></v-list-item>
        </v-list>

        <v-divider></v-divider>
      <div class="px-6 mb-6 mt-6">
        <v-btn block class="text-capitalize" color="white" @click="logout()">
          Cerrar Sesión
        </v-btn>
      </div>
      </vue-perfect-scrollbar>
      </v-navigation-drawer>



      <!--Drawer expandido Productos-->
      <v-navigation-drawer floating permanent v-model="drawer2" style="background-color:aliceblue;" @mouseenter="cancelHideTimer()" @mouseleave="startHideTimer()">
        <v-list  density="compact" nav>
          <v-list-item title="Gestionar Productos" value="home" prepend-icon="mdi-home" to="/dashboard/gestionar-producto"></v-list-item>

          <v-list-item to="/dashboard/reque-materia-prima" title="Materia Prima" value="contacts" prepend-icon="mdi-contacts"></v-list-item>

          <v-list-item title="Inventario" value="settings" prepend-icon="mdi-cog"></v-list-item>
        </v-list>
      </v-navigation-drawer>

        <!--Drawer expandido Produccion-->
      <v-navigation-drawer permanent v-model="drawerProduccion" style="background-color:aliceblue;" @mouseenter="cancelHideTimerDrawerProduccion()" @mouseleave="startHideTimerDrawerProduccion()">
        <v-list  density="compact" nav>
          <!--Jefe de Planta-->
          <v-list-item v-if="role === 'Jefe de Planta'" title="Autorizar Produccion" value="autorizarProd" prepend-icon="mdi-package-variant-closed-check" to="/dashboard/autorizar-produccion"></v-list-item>

          <v-list-item v-if="role === 'Jefe de Planta'" title="Consultar Lista Produccion" value="consultarProd" prepend-icon="mdi-format-list-group" to="/dashboard/consultar-list-produccion" ></v-list-item>
          <v-list-item v-if="role === 'Jefe de Planta'" title="Gestionar Clientes" value="gestionarCliente" prepend-icon="mdi-format-list-group" to="/dashboard/gestionar-clientes" ></v-list-item>
          <!--Jefe de Produccion-->
          <v-list-item v-if="role === 'Jefe de Produccion'" to="/dashboard/gestionar-pedidos" title="Pedidos" value="vPedidos" prepend-icon="mdi-notebook-check" ></v-list-item>
          <v-list-item v-if="role === 'Jefe de Planta'" to="/dashboard/ver-pedidos" title="Ver Pedidos" value="verPedidos" prepend-icon="mdi-notebook-check" ></v-list-item>
          <v-list-item v-if="role === 'Jefe de Produccion'" to="/dashboard/gestionar-plan-produccion" title="Planificar Produccion" value="pProduccion" prepend-icon="mdi-calendar"></v-list-item>
          <v-list-item v-if="role === 'Jefe de Produccion'" to="/dashboard/gestionar-orden-trabajo" title="Gestionar Orden de Trabajo" value="gOrdenTrabajo" prepend-icon="mdi-network-pos"></v-list-item>
          <v-list-item v-if="role === 'Jefe de Produccion'" to="/dashboard/visualizar-receta" title="Visualizar Recetas" value="vRecetas" prepend-icon="mdi-chef-hat" ></v-list-item>
          <v-list-item v-if="role === 'Jefe de Produccion'" to="/dashboard/visualizar-historico" title="Visualizar Historico" value="vHistorico" prepend-icon="mdi-history" ></v-list-item>
          <v-list-item v-if="role === 'Jefe de Produccion'" to="/dashboard/gestionar-planta" title="Gestionar Planta" value="gestionarPlanta" prepend-icon="mdi-factory" ></v-list-item>
          <v-list-item v-if="role === 'Jefe de Produccion'" to="/dashboard/consultar-stock" title="Consultar Stock" value="cStock" prepend-icon="mdi-list-status" ></v-list-item>
          <v-list-item v-if="role === 'Jefe de Produccion'" to="/dashboard/consultar-reporte-merma" title="Consultar Reporte de Merma" value="cReporteMerma" prepend-icon="mdi-format-indent-decrease" ></v-list-item>
          <v-list-item v-if="role === 'Jefe de Produccion'" to="/dashboard/gestionar-almacenes" title="Gestionar Almacenes" value="gAlmacenes" prepend-icon="mdi-format-indent-decrease" ></v-list-item>
          <v-list-item v-if="role === 'Jefe de Produccion'" to="/dashboard/gestionar-almacenes-productos" title="Productos en Almacenes" value="gAlmacenes" prepend-icon="mdi-format-indent-decrease" ></v-list-item>

          <!--Encargado de Produccion-->
          <!-- <v-list-item v-if="role === 'Encargado de Produccion'" to="/dashboard/gestionar-orden-trabajo" title="Ordenes de Trabajo" value="oTrabajo" prepend-icon="mdi-format-indent-decrease" ></v-list-item> -->
          <v-list-item v-if="role === 'Encargado de Produccion'" to="/dashboard/reque-materia-prima" title="Materia Prima" value="mPrima" prepend-icon="mdi-food-steak" ></v-list-item>
          <v-list-item v-if="role === 'Encargado de Produccion'" to="/dashboard/productos-terminados" title="Productos Terminados" value="pTerminados" prepend-icon="mdi-package-variant-closed-check" ></v-list-item>
        </v-list>
      </v-navigation-drawer>



    <!--------------------------->
    <!--------------------------->
    <!----Barra de navegcion----->
    <!--------------------------->
    <!--------------------------->


    <v-app-bar :elevation="2" rounded dense
      floating>
      <v-app-bar-nav-icon
          v-ripple="{ class: 'primary--text' }"
          @click.stop="drawer1 = !drawer1"
      />
      <v-toolbar-title style="font-weight:400; color: #757575">RISACMP</v-toolbar-title>
      <v-spacer />



      <v-btn icon @click="searchDrawer = !searchDrawer">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <!---->
      <MenuNotificacion/>
      <MenuUser/>


    </v-app-bar>



      <v-main class="d-flex align-center justify-center" style="min-height: 300px;min-height: 600px;">

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
const role = computed(() => userStore.user.role);
const nombres=computed(()=> userStore.user.nombres);
const apellidos=computed(()=>userStore.user.apellidos);

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
// import AppFooter from '@/components/AppFooter.vue';

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
<style lang="scss" scoped>
  .navigation-drawer{
    background-color:black;
  }
  .item{
    color: aliceblue;
  }
  .item:hover{
    background-color: #3d5252;
  }


  .v-app-bar {
  border: 1px solid #ccc;
}


//Navigation drawer principal
.bg-sidebar-six {
  background-color: #292f3d;
}
.theme--dark .v-navigation-drawer {
  .bg-sidebar-six {
    background-color: #3a3939;
  }
}
.sidebar-six {
  .v-list-item__icon {
    margin-right: 8px !important;
    // margin-bottom: 0;
    // margin-top: 0;
  }

  .v-list-item--link:before {
    border-radius: 8px;
  }
}



/**CSS EJEMPLO */
.header-backup {
  display: block;
  width: 100%;
  height: 102px;
  position: fixed;
  top: 0;
  z-index: 5;
  background: linear-gradient(
    180deg,
    hsla(0, 0%, 97.3%, 0.95) 44%,
    hsla(0, 0%, 97.3%, 0.46) 73%,
    hsla(0, 0%, 100%, 0)
  ) !important;
  left: 0;
  &.theme--dark {
    background: linear-gradient(
      180deg,
      rgba(5, 5, 5, 0.95) 44%,
      rgba(0, 0, 0, 0.46) 3%,
      hsla(0, 0%, 100%, 0)
    ) !important;
  }
}
.tippy-box[data-theme~="light"] {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
.vnb {
  background: transparent !important;
  &__menu-options {
    margin-top: 3px !important;
    &__option {
      &__link {
        &:focus {
          outline: none;
          border: 1px solid none;
        }
        &:hover {
          color: #0081ff;
          .vnb__menu-options__option__arrow {
            fill: #0081ff;
          }
        }

        // &__icon {
        //   svg {
        //     fill: #0081ff !important;
        //     font-size: larger;
        //   }
        // }
      }
    }
  }

  &__sub-menu-options {
    &__option {
      &__link {
        &:focus {
          outline: none;
          border: 1px solid none;
        }
        color: #000 !important;
        &:hover {
          color: #0081ff !important;
        }
      }
    }
  }
}

.vnb__collapse-button {
  &:focus {
    border: 1px solid none;
    outline: none;
  }
  &:after {
    content: "\F035C";
    font-size: 25px;
    font-weight: 600;
    font-family: "Material Design Icons";
  }
  svg {
    display: none !important;
  }
}

.vnb__popup {
  max-height: 80vh;
  overflow-x: hidden;
  overflow-y: scroll !important;
  .vnb__popup__top__close-button {
    &:focus {
      border: 1px solid none;
      outline: none;
    }
    top: 20px;
    right: -33px;
    svg {
      fill: #000 !important;
    }
  }
}


</style>
