<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-template-root -->
<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-centerfill-height mx-auto"
      max-width="auto"
      max-height="auto"
    >
      <v-img
        class="mb-4"
        height="150"
        src="@/assets/Imagenes/logo4.jpeg"
      />

      <div class="text-center">
        <div class="text-body-2 font-weight-light mb-n1">Bienvenido a </div>

        <h1 class="text-h2 font-weight-bold">RISACMP SYSTEM</h1>
      </div>

      <div class="py-4" />

      <v-row>
        <v-col cols="12">
          <v-card
            class="py-4"
            color="surface-variant"
            image="https://cdn.vuetifyjs.com/docs/images/one/create/feature.png"
            prepend-icon="mdi-rocket-launch-outline"
            rounded="lg"
            variant="outlined"
          >
            <template src="@/assets/Imagenes/logo4.jpeg" >
              <v-img position="top right"  />
            </template>

            <template #title>
              <h2 class="text-h5 font-weight-bold">EMPECEMOS</h2>
            </template>

            <template #subtitle>
              <div class="text-subtitle-1">
                Navegue por el sistema.
              </div>
            </template>

            <v-overlay
              opacity=".12"
              scrim="primary"
              contained
              model-value
              persistent
            />
          </v-card>
        </v-col>


      </v-row>
    </v-responsive>
  </v-container>
</template>
<script setup>

</script>
