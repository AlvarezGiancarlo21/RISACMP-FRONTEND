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
          <v-list-item class="item"
            prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
            subtitle="sandra_a88@gmailcom"
            title="Sandra Adams"
          ></v-list-item>
      </v-list>

        <v-divider></v-divider>

        <v-divider></v-divider>

        <v-list
          density="compact"
          nav
        >
          <v-list-item class="item" title="Dashboard" prepend-icon="mdi-view-dashboard" value="dashboard" @mouseover="showDrawer2()" @mouseleave="hideDrawer2()"></v-list-item>

          <v-list-item class="item" title="Mensajes" prepend-icon="mdi-forum" value="messages"></v-list-item>
          <v-list-item class="item" prepend-icon="mdi-home-city" title="Principal" value="home" ></v-list-item>
          <v-list-item class="item" prepend-icon="mdi-folder-multiple" title="Servicios" value="services"  ></v-list-item>
          <v-list-item class="item" prepend-icon="mdi-account-group-outline" title="Users" value="users" ></v-list-item>
          <v-list-item class="item" prepend-icon="mdi-logout" title="Salir" value="signout"  ></v-list-item>
          <v-list-item class="item" prepend-icon="mdi-home-city" title="Inicio" value="home" ></v-list-item>
          <v-list-item class="item" prepend-icon="mdi-account" title="Mi cuenta" value="account" ></v-list-item>
          <v-list-item class="item" prepend-icon="mdi-account-group-outline" title="Usuarios" value="users"></v-list-item>
          <v-list-item class="item" prepend-icon="mdi-gavel" title="Admin"></v-list-item>
        </v-list>
        <template v-slot:append>
          <div class="pa-2" >
            <v-btn block style="background-color: aliceblue;color: black;" to="/">
              Cerrar Sesion
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>

      <!--Drawer 2-->
      <v-navigation-drawer permanent v-model="drawer2" style="background-color:aliceblue;" @mouseenter="cancelHideTimer()" @mouseleave="startHideTimer()">
        <v-list  density="compact" nav>
          <v-list-item title="Opcion 1" value="home" prepend-icon="mdi-home" ></v-list-item>

          <v-list-item title="Opcion 2" value="contacts" prepend-icon="mdi-contacts"></v-list-item>

          <v-list-item title="Opcion 3" value="settings" prepend-icon="mdi-cog"></v-list-item>
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
      <v-main class="d-flex align-center justify-center" style="max-height: auto;">
        <router-view />
      </v-main>
    </v-layout>
  </v-app>
</template>


<script setup>
import { ref } from 'vue';

// Variables reactivas

let hideTimer;
const drawer1=ref(true);
const drawer2=ref(false);


// Funciones
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
