<template>
    <v-card class="card" style="margin: 240px auto 0; width: auto;height:120%;">
      <v-card title="Todos los Productos en Almacenes" flat></v-card>
      <template v-slot:text>
        <v-toolbar flat>
          <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details single-line></v-text-field>
  
          <!-- Registrar Almacén -->
          <div class="pa-4 text-center">
          </div>
        </v-toolbar>
      </template>
  
      <v-alert v-model="isAlertVisible" closable icon="$error" title="Error" :text="errorMessage" type="error" variant="tonal"></v-alert>
  
      <v-data-table :headers="headers" :items="almacenesProductoTabla" :search="search"></v-data-table>
    </v-card>
  </template>
  <script>
  import * as servicios from '../../services/s_almacenes_productos';
  
  export default {
    data() {
      return {
        search: '',
        dialogPostAlmacenProducto: false,
        nuevoAlmacenProducto: {
          nombre: '',
          ubicacion: ''
        },
        headers: [
          { title: 'N° Serie', value: 'numero_serie' },
          { title: 'Lote', value: 'lote' },
          { title: 'Nombre de Producto', value: 'producto.nombre' },
          { title: 'Almacén', value: 'almacen.nombre' },
          { title: 'Estado', value: 'estado' },
          { title: 'Tipo de Origen', value: 'tipo_origen' },
        ],
        almacenesProductoTabla: [],
        errorMessage: '',
        isAlertVisible: false,
      }
    },
    methods: {
      async registrar() {
        try {
          await servicios.crearAlmacenProducto(this.nuevoAlmacen);
          this.dialogPostAlmacenProducto = false;
          await this.obtenerDatos();
        } catch (error) {
          this.errorMessage = error.message;
          this.isAlertVisible = true;
        } finally {
          this.dialogPostAlmacenProducto = false;
        }
      },
      async obtenerDatos() {
        try {
          this.almacenesProductoTabla = await servicios.obtenerAlmacenesProductos();
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