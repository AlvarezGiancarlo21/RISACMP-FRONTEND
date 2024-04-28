<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-parallax src="../assets/Imagenes/fondocarne.png" style="position: absolute;">
    <div class="container">

      <div class="login-container" >
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
              Advertencia:Luego de tres intentos se bloqueara la cuenta.
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
        <!--==========================================-->
        <!--Dialogo de error de credenciales invalidas-->
        <!--==========================================-->
        <v-dialog v-model="dialogError" max-width="500px">
          <v-card
          max-width="400"
          prepend-icon="mdi-alert-circle"
          text="El correo o la contraseña ingresados son incorrectos.Porfavor vuelva a iniciar sesion."
          title="Error al iniciar sesión"

          >
          <template v-slot:actions>
            <v-btn
              class="ms-auto"
              text="Ok"
              @click="dialogError = false"
            ></v-btn>
          </template>
          </v-card>
        </v-dialog>





      </div>

    </div>
  </v-parallax>
  </template>

  <script>
  export default {
    data() {
      return {
        visible:false,
        username: '',
        password: '',
        // Agrega una propiedad para controlar la visibilidad del diálogo de error
        dialogError: false,
        // Agrega una propiedad para almacenar el mensaje de error
        errorMessage: ''
      };
    },
    methods: {
      async onSubmit() {
        try {
          const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: this.username,
              password: this.password,
            }),
          });

          const data = await response.json();

          if (response.ok) {
            // Si el inicio de sesión fue exitoso, redirige al usuario a la página de dashboard
            this.$router.push('/dashboard');
          } else {
            // Si el inicio de sesión falló, muestra un mensaje de error utilizando el diálogo
            this.errorMessage = data.msg || 'Credenciales incorrectas. Inténtalo de nuevo.';
            this.dialogError = true;
          }
        } catch (error) {
          console.error('Error al iniciar sesión:', error);
          // Si ocurre un error durante la solicitud, muestra un mensaje de error utilizando el diálogo
          this.errorMessage = 'Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.';
          this.dialogError = true;
        }
      },
      required(v) {
        return !!v || 'Este campo es requerido';
      },
    },
  };
  </script>




  <style>

  .container{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;

  }
  .login-container{
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    width: 1000px;
    height: 500px;
    background-color: rgb(255, 255, 255);
  }

  .left-part{
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

  .left-part img{
    width: 200px;
  }

  .right-part{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    width: 500px;
  }

  .right-part h1{
    color: #990000;
  }

  </style>
