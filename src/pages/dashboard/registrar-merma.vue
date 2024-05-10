<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-card class="card" style="margin: 240px auto 0; width: auto;height:120%;">
    <v-card title="Lista de mermas" flat></v-card>
    <template v-slot:text>
      <v-toolbar flat>
        <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details
          single-line></v-text-field>

        <!-- Registrar Merma -->
        <div class="pa-4 text-center">
          <v-dialog v-model="dialog" max-width="600">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn class="text-none font-weight-regular" prepend-icon="mdi-account" text="Registrar Merma"
                variant="tonal" v-bind="activatorProps"></v-btn>
            </template>

            <v-card prepend-icon="mdi-account" title="Creación de merma">
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="nuevaMerma.nombre" label="Nombre del producto*" required></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="nuevaMerma.cantidad" label="Cantidad*"></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="nuevaMerma.fecha_conteo" label="Fecha de conteo*" hint="YYYY-MM-DD"
                      persistent-hint required></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field v-model="nuevaMerma.responsable_encargado" label="Encargado responsable*"
                      required></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field v-model="nuevaMerma.motivo" label="Motivo*" required></v-text-field>
                  </v-col>

                </v-row>

                <small class="text-caption text-medium-emphasis">*indica campo requerido</small>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text="Cancelar" variant="plain" @click="dialog = false"></v-btn>

                <v-btn color="primary" text="Registrar" variant="tonal" @click="registrar"></v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
        <!-- Registrar Merma -->

      </v-toolbar>
    </template>

    <v-data-table :headers="headers" :items="mermas" :search="search"></v-data-table>
  </v-card>
</template>
<script>
import * as servicios from '../../services/mermaService';

export default {
  data() {
    return {
      search: '',
      dialog: false,
      headers: [
        { title: 'Nombre', value: 'nombre' },
        { title: 'Cantidad', value: 'cantidad' },
        { title: 'Fecha de conteo', value: 'fecha_conteo' },
        { title: 'Responsable', value: 'responsable_encargado' },
        { title: 'Motivo', value: 'motivo' },
      ],
      mermas: [],
      nuevaMerma: {
        nombre: '',
        cantidad: '',
        fecha_conteo: '',
        responsable_encargado: '',
        motivo: ''
      },
    }
  },
  methods: {
    async registrar() {
      try {
        // Llamar al método de servicio para registrar la merma
        await servicios.registrarMerma(this.nuevaMerma);

        // Cerrar el diálogo después de registrar
        this.dialog = false;

        // Podrías querer recargar los datos después de registrar la merma
        await this.obtenerDatos();
      } catch (error) {
        console.error('Error al registrar la merma:', error);
      } finally {
        // Cerrar el diálogo después de registrar
        this.dialog = false;
      }
    },
    async obtenerDatos() {
      // Llamar al método de servicio para obtener los datos actualizados
      const datos = await servicios.obtenerMermas();
      this.mermas = datos;
    }
  },
  async created() {
    const datos = await servicios.obtenerMermas()
    console.log('Datos obtenidos de obtenerMermas:', datos)
    this.mermas = datos
  }

}
</script>
