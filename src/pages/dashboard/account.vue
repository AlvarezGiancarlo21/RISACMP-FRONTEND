<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container-config-user">
    <h2>Configuración de usuario</h2>
    <div class="fields-config-user">
      <div class="input-foto">
        <div>
          <img src="../../assets/user.png" alt="foto_perfil">
        </div>
        <!-- <button class="container-input-foto-icono" id="attachment" onclick="abrirArchivo">
          <div class="input-foto-icono">
          <img  src="../../assets/camara.png" alt="">
        </div>
        <v-file-input></v-file-input>
        </button> -->
        <v-file-input :rules="rules" accept="image/png, image/jpeg, image/bmp" label="Perfil"
          placeholder="Rol" prepend-icon="mdi-camera" style="width: 200px;"></v-file-input>
      </div>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field v-model="role" hide-details="auto" label="Rol en el Sistema" clearable></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="nombres" hide-details="auto" label="Nombres" clearable></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="apellidos" hide-details="auto" label="Apellidos" clearable></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field v-model="tipoDocumento" hide-details="auto" label="Tipo de documento" clearable></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="numeroDocumento" hide-details="auto" label="Numero de documento" clearable></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="telefono" hide-details="auto" label="Telefono" clearable></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="sexo" hide-details="auto" label="Sexo" clearable></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-btn color="success" size="large" variant="elevated" type="submit" width="200" style="margin-left: auto;">
      Guardar
    </v-btn>
        </v-col>
      </v-row>
    </div>

  </div>
</template>
<style>
.container-config-user {
  display: flex;
  flex-direction: column;
  background-color: gainsboro;
  width: 80em;
  padding: 2em;
  border-radius: 20px;
}

.container-config-user h2 {
  margin-bottom: 20px;
  text-align: center;
}

/* .container-input-foto-icono {

  display: flex;
  justify-content: center;
  width: 50px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 160px;
  left: 53%;
  padding-top: 5px;
  border: black solid 0.5px;
} */

.input-foto {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 20px;
}

.input-foto img {
  width: 200px;
  border-radius: 50%;
}

/* .input-foto-icono img {
  width: 30px;
  border-radius: 0;
} */
</style>

<script setup>
// function abrirArchivo() {
//   document.getElementById("file-input").click();
// }


import { useUserStore } from '@/stores/User';
import { computed } from 'vue';
import { onMounted } from 'vue';
import jwt_decode from 'jwt-decode'; // Importa la librería para decodificar el token JWT
const userStore = useUserStore();
const role = computed(() => userStore.user.role);
const nombres=computed(()=> userStore.user.nombres);
const apellidos=computed(()=>userStore.user.apellidos);
const tipoDocumento=computed(()=>userStore.user.tipoDocumento);
const numeroDocumento=computed(()=>userStore.user.numeroDocumento);
const telefono=computed(()=>userStore.user.telefono);
const sexo =computed(()=>userStore.user.sexo);

onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    // Decodificar el token para obtener la información del usuario
    const decodedToken = jwt_decode(token);
    const role = decodedToken.user.role;
    const username = decodedToken.user.username;
    const nombres =decodedToken.user.nombres;
    const apellidos=decodedToken.user.apellidos;
    const tipoDocumento=decodedToken.user.tipoDocumento;
    const numeroDocumento=decodedToken.user.numeroDocumento;
    const telefono=decodedToken.user.telefono;
    const sexo=decodedToken.user.sexo;
    // Establecer la información del usuario en el store
    userStore.setUserRole(role, username,nombres,apellidos,tipoDocumento,numeroDocumento,telefono,sexo);
  }
});


</script>
