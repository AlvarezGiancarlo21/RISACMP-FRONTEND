<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-card title="Lista de mermas" flat>
    <template v-slot:text>
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>
    </template>

    <v-data-table
      :headers="headers"
      :items="desserts"
      :search="search"
    ></v-data-table>
  </v-card>
</template>
<script>
  import * as servicios from '../../services/mermaService';
  export default {
    data () {
      return {
        search: '',
        headers: [
          { title: 'Nombre', value: 'nombre' },
          { title: 'Cantidad', value: 'cantidad' },
          { title: 'Fecha de conteo', value: 'fecha_conteo' },
          { title: 'Responsable', value: 'responsable_encargado' },
          { title: 'Motivo', value: 'motivo' },
          { title: 'Creado en', value: 'createdAt' },
          { title: 'Actualizado en', value: 'updatedAt' }
        ],
        desserts: [],
      }
    },
    async created(){
      const datos = await servicios.obtenerMermas()
      console.log('Datos obtenidos de obtenerMermas:', datos)
      this.desserts = datos
    }
    
  }
</script>


