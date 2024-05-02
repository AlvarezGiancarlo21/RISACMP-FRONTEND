<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-parallax src="../assets/Imagenes/fondocarne.png" style="position: absolute;">
    <div class="container">
      <div class="login-container">
        <!--Parte izquierda del login-->
        <div class="left-part">
          <h1>BIENVENIDO A RISACMP</h1>
          <img src="../assets/Imagenes/logo.png" alt="logo">
          <p style="text-align: center;font-size: medium"><b>Mejora de procesos de planta de producción
            Mediante un Sistema Web en Rudani inversiones
            S.A.C. 2024</b></p>
        </div>
        <!--Parte derecha del login-->
        <div class="right-part">
          <h1>Ingrese su cuenta</h1>
          <v-card class="mx-auto px-14" width="450" flat>
            <v-form @submit.prevent="onSubmit">
              <div class="text-subtitle-1 text-medium-emphasis">Account</div>
              <!--Text field usuario-->
              <v-text-field
                v-model="username"
                :rules="[required]"
                class="mb-2"
                density="compact"
                placeholder="Ingrese su usuario"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                clearable
              ></v-text-field>

              <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                Password
                <a
                  class="text-caption text-decoration-none text-blue"
                  href="#"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Forgot login password?</a>
              </div>
              <!--Text field contraseña-->
              <v-text-field
                v-model="password"
                :rules="[required]"
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                density="compact"
                placeholder="Ingrese su contraseña"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                @click:append-inner="visible = !visible"
                clearable
              ></v-text-field>
              <v-card
                class="mb-5"
                color="surface-variant"
                variant="tonal"
              >
                <v-card-text class="text-medium-emphasis text-caption">
                  Advertencia: Luego de tres intentos se bloqueará la cuenta.
                </v-card-text>
              </v-card>
              <v-btn
                style="background-color: #990000;color: white;"
                size="large"
                variant="elevated"
                block
                type="submit"
              >
                Ingresar
              </v-btn>
            </v-form>
          </v-card>
        </div>
      </div>
    </div>
  </v-parallax>
</template>

<script>
import axios from 'axios';
import jwt_decode from 'jwt-decode'; // Importa la librería para decodificar el token JWT
import { useUserStore } from '@/stores/User'; // Importa el hook useUserStore para acceder al store de usuario Pinia
export default {
  data() {
    return {
      visible: false,
      username: '',
      password: '',
      dialogError: false,
      errorMessage: ''
    };
  },
  methods: {
    async onSubmit() {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', {
          username: this.username,
          password: this.password,
        });

        // Maneja la respuesta del inicio de sesión
        this.handleLoginResponse(response);
        console.log('Response from server:', response); // Imprime la respuesta completa del servidor
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        // Muestra un mensaje de error utilizando el diálogo
        this.errorMessage = 'Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.';
        this.dialogError = true;
      }
    },

    handleLoginResponse(response) {
      console.log('Response:', response); // Verifica la respuesta del backend
      if (response.status === 200) {
        const token = response.data.token;
        console.log('Token:', token); // Verifica el token recibido

        const decodedToken = jwt_decode(token);
        console.log('Decoded Token:', decodedToken); // Verifica el objeto decodificado

        // Verifica que el objeto decodificado esté definido y contenga la propiedad 'user'
        if (decodedToken && decodedToken.user) {
          const role = decodedToken.user.role;
          console.log('User Role:', role); // Verifica el rol del usuario extraído del token
          const userStore = useUserStore(); // Accede al store de usuario Pinia
          userStore.setUserRole(role); // Actualiza el estado del usuario con el rol
          this.$router.push('/dashboard');
        } else {
          console.error('Token JWT inválido: no se encontró la propiedad "user" en el token decodificado.');
          this.errorMessage = 'Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.';
          this.dialogError = true;
        }
      } else {
        this.errorMessage = response.data.msg || 'Credenciales incorrectas. Inténtalo de nuevo.';
        this.dialogError = true;
      }
    },



    required(v) {
      return !!v || 'Este campo es requerido';
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  width: 1000px;
  height: 500px;
  background-color: rgb(255, 255, 255);
}

.left-part {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 60px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  flex-direction: column;
  color: #ffffff;
  width: 500px;
  background-color: #990000;
}

.left-part img {
  width: 200px;
}

.right-part {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 500px;
}

.right-part h1 {
  color: #990000;
}
</style>
