<template>
  <v-container fluid fill-height>
  <v-card flat>
    <v-toolbar color="black" dark>
      <v-toolbar-title class="mr-4">Facturas</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleForm">
        <v-icon>{{ showForm ? 'mdi-close' : 'mdi-pencil' }}</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- Contenido de la tarjeta -->
    <v-card-text>
      <!--Inicio Modal Formulario-->
      <v-template v-if="showForm">
        <v-form ref="form" @submit.prevent="submitForm">
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="codigoOrdenCompra" label="Código orden de compra"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="rucProveedor" label="RUC Proveedor"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="razonSocial" label="Razón Social"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="codigoFactura" label="Código de Factura"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="descripcionCompra" label="Descripción de la compra"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-menu v-model="fechaRegistroMenu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="fechaRegistro" label="Fecha de Registro" readonly v-bind="attrs" v-on="on"></v-text-field>
                  </template>
                  <v-date-picker v-model="fechaRegistro" scrollable></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="montoAntesImpuestos" label="Monto antes de impuestos"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-btn color="dark" @click="submitForm">Registrar</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-template>
      <!--Cierre Modal Formulario-->

      <v-template v-else>
        <template v-slot:text>
          <v-text-field
            v-model="search"
            label="Buscar"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            single-line
          ></v-text-field>
        </template>

        <v-data-table
          :headers="headers"
          :items="facturas"
          :search="search"
          ref="dataTable"
        >
          <template v-slot:item.Accion="{ item }">
            <v-icon @click="verFactura(item)">mdi-eye</v-icon>
          </template>
        </v-data-table>
      </v-template>
    </v-card-text>
  </v-card>
</v-container>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      search: '',
      showForm: false,
      codigoOrdenCompra: '',
      rucProveedor: '',
      razonSocial: '',
      codigoFactura: '',
      descripcionCompra: '',
      fechaRegistro: '',
      fechaRegistroMenu: false,
      montoAntesImpuestos: '',
      headers: [
        {
          align: 'center',
          key: 'name',
          sortable: false,
          title: 'Orden de Compra',
        },
        { align: 'center', key: 'RUC', title: 'RUC' },
        { align: 'center', key: 'Razon_Social', title: 'Razon Social' },
        { align: 'center', key: 'Codigo_Factura', title: 'Codigo Factura' },
        { align: 'center', key: 'Fecha', title: 'Fecha' },
        { align: 'center', key: 'Accion', title: 'Accion' },
      ],
      facturas: [
      ],
    }
  },
  methods: {
    async verFactura(item) {
      const response = await axios.get('http://localhost:3000/api/facturas');
      console.log('Facturas', response.data)
      this.facturas = response.data;
    },
    toggleForm() {
      this.showForm = !this.showForm;
    },
    submitForm() {
      console.log('Formulario enviado');
      // Aquí puedes enviar los datos del formulario a tu backend
      // y realizar cualquier otra acción necesaria
      // luego de enviar el formulario
    },
  },
}
</script>
<style>
  .v-main {
  align-items: flex-start !important;
}
</style>
