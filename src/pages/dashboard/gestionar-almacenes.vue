<template>
  <v-card class="card" style="margin: 240px auto 0; width: auto;height:120%;">
    <v-card title="Almacenes" flat></v-card>
    <template v-slot:text>
      <v-toolbar flat>
        <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details single-line></v-text-field>

        <!-- Registrar Almacén -->
        <div class="pa-4 text-center">
          <v-dialog v-model="dialogPostAlmacen" max-width="600">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn class="text-none font-weight-regular" prepend-icon="mdi-account" text="Crear Almacén" variant="tonal" v-bind="activatorProps"></v-btn>
            </template>

            <v-card prepend-icon="mdi-account" title="Crear Almacén">
              <v-card-text>
                <v-row dense>
                  <v-col>
                    <v-text-field v-model="nuevoAlmacen.nombre" label="Nombre de Almacén*" required></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field v-model="nuevoAlmacen.ubicacion" label="Ubicación*" required></v-text-field>
                  </v-col>
                </v-row>
                <small class="text-caption text-medium-emphasis">*indica campo requerido</small>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="Cerrar" variant="plain" @click="dialogPostAlmacen = false"></v-btn>
                <v-btn color="primary" text="Crear" variant="tonal" @click="registrar"></v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-toolbar>
    </template>

    <v-alert v-model="isAlertVisible" closable icon="$error" title="Error" :text="errorMessage" type="error" variant="tonal"></v-alert>

    <v-data-table :headers="headers" :items="almacenesTabla" :search="search"></v-data-table>
  </v-card>
</template>
<script>
import * as servicios from '../../services/s_almacenes';

export default {
  data() {
    return {
      search: '',
      dialogPostAlmacen: false,
      nuevoAlmacen: {
        nombre: '',
        ubicacion: ''
      },
      headers: [
        { title: 'Nombre', value: 'nombre' },
        { title: 'Ubicación', value: 'ubicacion' },
      ],
      almacenesTabla: [],
      errorMessage: '',
      isAlertVisible: false,
    }
  },
  methods: {
    async registrar() {
      try {
        await servicios.crearAlmacen(this.nuevoAlmacen);
        this.dialogPostAlmacen = false;
        await this.obtenerDatos();
      } catch (error) {
        this.errorMessage = error.message;
        this.isAlertVisible = true;
      } finally {
        this.dialogPostAlmacen = false;
      }
    },
    async obtenerDatos() {
      try {
        this.almacenesTabla = await servicios.obtenerAlmacenes();
      }
      catch (error) {
        this.errorMessage = error.message;
        this.isAlertVisible = true;
      }
    },
    handleCloseErrorAlert() {
      this.errorMessage = '';
      this.isAlertVisible = false;
    },
  },
  async created() {
    await this.obtenerDatos(() => { });
  }
}
</script>