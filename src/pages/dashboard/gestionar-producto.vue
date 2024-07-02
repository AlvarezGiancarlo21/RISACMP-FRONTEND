<template>
  <v-card class="card" style="width: 100%;height:120%;padding: 20px;margin-top: 80px;">
    <v-card title="Productos" flat></v-card>
    <template v-slot:text>
      <v-toolbar flat>
        <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details
          single-line></v-text-field>

        <!-- Registrar Almacén -->
        <div class="pa-4 text-center">
          <v-dialog v-model="dialogPostAlmacen" max-width="600">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn class="text-none font-weight-regular" prepend-icon="mdi-account" text="Crear Producto"
                variant="tonal" v-bind="activatorProps"></v-btn>
            </template>

            <v-card prepend-icon="mdi-account" title="Crear Producto">
              <v-card-text>
                <v-row dense>
                  <v-col>
                    <v-text-field v-model="nuevoProducto.nombre" label="Nombre de Producto*" required></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field v-model="nuevoProducto.ubicacion" label="Ubicación*" required></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-select v-model="nuevoProducto.unidad_medida_id" :items="unidadesDeMedida" item-title="nombre"
                      item-value="id" label="Unidad de Medida" required></v-select>
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

    <v-alert v-model="isAlertVisible" closable icon="$error" title="Error" :text="errorMessage" type="error"
      variant="tonal"></v-alert>

    <v-data-table :headers="headers" :items="almacenesTabla" :search="search"></v-data-table>
  </v-card>
</template>
<script>
import * as serviciosUnidad from '../../services/unidadMedidaService';
import * as serviciosProducto from '../../services/s_productos';

export default {
  data() {
    return {
      search: '',
      dialogPostAlmacen: false,
      nuevoProducto: {
        nombre: '',
        tipo: '',
        unidad_medida_id: '',
      },
      headers: [
        { title: 'Nombre', value: 'nombre' },
        { title: 'Tipo', value: 'tipo' },
        { title: 'Cantidad', value: 'cantidad_total' },
        { title: 'Unidad de Medida', value: 'unidad_medida.nombre' },
        { title: '¿Tiene receta?', value: 'hasReceta' },
      ],
      almacenesTabla: [],
      errorMessage: '',
      isAlertVisible: false,
      unidadesDeMedida: [{}],
    }
  },
  methods: {
    async registrar() {
      try {
        await serviciosProducto.registrarProducto(this.nuevoProducto);
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
        let datos = await serviciosProducto.obtenerProductos();
        this.almacenesTabla = datos.map(producto => {
          return {
            ...producto,
            hasReceta: producto.hasReceta ? "Si" : "No"
          };
        });
      }
      catch (error) {
        this.errorMessage = error.message;
        this.isAlertVisible = true;
      }
    },
    async obtenerUnidades() {
      try {
        const unidades = await serviciosUnidad.obtenerUnidadesDeMedida();
        let i = 0;

        this.unidadesDeMedida = unidades.map(unidad => ({
          id: unidad._id,
          nombre: unidad.nombre
        }));
      } catch (error) {
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
    await this.obtenerUnidades();
  }
}
</script>