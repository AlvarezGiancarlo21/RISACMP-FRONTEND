<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container-config-user">
    <h2>Configuración de usuario</h2>
    <div class="fields-config-user">
      <div class="input-foto">
        <div>
          <img src="../../assets/user.png" alt="foto_perfil">
        </div>
        <button class="container-input-foto-icono" id="attachment" onclick="abrirArchivo">
          <div class="input-foto-icono">
          <img  src="../../assets/camara.png" alt="">
        </div>
        <!-- <v-file-input></v-file-input> -->
        </button>
      </div>
      <v-row>
        <v-col cols="12"
        sm="6">
        <v-text-field
            hint="Por ejemplo, Piero Alonso Flores Munarriz"
            label="Nombre completo"
          ></v-text-field>
        </v-col>
        <v-col cols="12"
        sm="6">
        <v-text-field
            hint="Por ejemplo, piero2310@gmail.com"
            label="Correo electrónico"
          ></v-text-field>
        </v-col>
        <v-col cols="12"
        sm="6">
        <v-text-field
            hint="Por ejemplo, 3790397"
            label="Teléfono"
          ></v-text-field>
        </v-col>
        <v-col cols="12"
        sm="6">
        <v-text-field
            hint="Por ejemplo, 912060265"
            label="Celular"
          ></v-text-field>
        </v-col>
        <v-col cols="12"
        sm="6">
        <v-text-field
            hint="Por ejemplo, Masculino"
            label="Género"
          ></v-text-field>
        </v-col>
        <v-col cols="12"
        sm="6">
        <v-text-field
            hint="Por ejemplo, Masculino"
            label="Género"
          ></v-text-field>
        </v-col>
      </v-row>
    </div>
    <v-btn
          color="success"
          size="large"
          variant="elevated"
          type="submit"
          width="200"
          style="margin-left: auto;"
        >
          Guardar
        </v-btn>
  </div>
  </template>
<style>
  .container-config-user{
    display: flex;
    flex-direction: column;
    background-color: gainsboro;
    width: 80em;
    padding: 2em;
    border-radius: 20px;
  }
  .container-config-user h2{
    margin-bottom: 20px;
    text-align: center;
  }
  .container-input-foto-icono {

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
  }
  .input-foto{
    display: flex;
    justify-content: center;
    position: relative;
    margin-bottom: 20px;
    margin-top: 20px;
  }
  .input-foto img{
    width: 200px;
    border-radius: 50%;
  }
  .input-foto-icono img{
    width: 30px;
    border-radius: 0;
  }
</style>

<script>
    function abrirArchivo() {
      document.getElementById("file-input").click();
    }
</script>
