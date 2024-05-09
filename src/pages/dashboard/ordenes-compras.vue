<template>
  <v-container>
          
          <v-row>
              <v-col class="mb-4 text-left">
                  <h2 class="display-2 mb-3">Registrar Órdenes de Compra</h2>
              </v-col>
  
              <v-col class="text-right">
                <!-- Boton que abre el dialog para registrar nueva orden de compra -->
                  <v-dialog v-model="dialog" max-width="1200">
                    <template v-slot:activator="{ props: activatorProps }">
                      <v-btn
                        color="success"
                        class="text-none font-weight-regular"
                        prepend-icon="mdi-plus"
                        text="REGISTRAR"
                        v-bind="activatorProps"
                      ></v-btn>
                    </template>
                
                    <v-card class="text-center" title="Orden De Compra">
                      <v-card-text>
                        <v-row dense>
                          <v-col  cols="12">
                            <p class="text-left font-weight-bold">Nombre de orden de compra: </p>
                            <v-text-field 
                            v-model="nuevaOrden.nombre"
                            cleareable
                            placeholder="Nombre de orden de compra">
                            </v-text-field>
                          </v-col>
                          
                          <v-col  cols="12">
                            <p class="text-left font-weight-bold">Buscar archivo: </p>
                            <v-text-field
                            v-model="nuevaOrden.archivo"
                            cleareable>
                            </v-text-field>
                          </v-col>
  
                          <v-col  cols="12">
                            <p class="text-left font-weight-bold">Fecha de subida: </p>
                            <v-text-field 
                            class="font-weight-bold"
                            v-model="nuevaOrden.fecha_subida"
                            disabled
                            >
                            </v-text-field>
                          </v-col>
                          
                        </v-row>
                        <v-row>
                          <v-col cols="8">
                          </v-col>
                          <v-col cols="2">
                            <v-btn 
                              width="300"
                              color="blue"
                              class="text-none font-weight-regular"
                              prepend-icon="mdi-check"
                              text="GUARDAR"
                              v-bind="activatorProps"
                              @click="agregarOrdenCompra"
                            > 
                            </v-btn>
                          </v-col>
                          <v-col cols="2">
                            <v-btn 
                              width="300"
                              color="red"
                              class="text-none font-weight-regular"
                              prepend-icon="mdi-close"
                              text="CANCELAR"
                              v-bind="activatorProps"
                              @click="limpiarFormulario"
                            ></v-btn>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                
       
              </v-col>
          </v-row>
  
          <v-row>
              <v-col>
                <v-data-table :headers="headers" :items="ordenes" :search="search">
                  <template v-slot:[`item.actions`] ="{ item }">
                    <v-icon
                    class="me-2"
                    size="small"
                    @click="() => {detalleProveedor(item); modoModal='Detalle'; dialogAgregar = true;}"
                    >
                  mdi-eye
                  </v-icon>
                  
                  </template>
                </v-data-table>
              </v-col>
          </v-row>
      </v-container>
  
  </template>
  
  <script>
  import axios from 'axios';
  
  
  export default {
    data() {
      
  
      return {
        dialog: false,
  
        search: '',
        headers: [
          { align: 'start',
            key: '_id',
            sortable: false,
            title: 'Nro Orden de Compra',
          },
          { key: 'nombre', title: 'Nombre de orden de compra' },
          { key: 'archivo', title: 'Archivo' },
          { key: 'fecha_subida', title: 'Fecha de subida' },
          { key: 'actions', title: 'Acciones', sortable: false}
        ],
        ordenes: [],
        
        nuevaOrden: {
          nombre: '',
          archivo: '',
          fecha_subida: this.currentDate(),
        },
        modoModal: ''
      }
    },
    methods: {
      async fetchData() {
        try {
          const response = await axios.get('http://localhost:3000/api/orden-compra/get/all');
          console.log('Data:', response.data);
          this.ordenes = response.data;
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      },
      async agregarOrdenCompra() {
        try {
          const response = await axios.post('http://localhost:3000/api/orden-compra/post', this.nuevaOrden);
          console.log('Orden de compra agregada:', response.data);
          this.ordenes.push(response.data);
          await this.fetchData();
          this.nuevaOrden = {
            nombre: '',
            archivo: '',
            fecha_subida: this.currentDate(),
          };
          
        } catch (error) {
          console.error('Error al agregar orden:', error);
        }
        await this.fetchData();
        this.limpiarFormulario();
      },
      limpiarFormulario() {
  
        this.nuevaOrden.nombre = '';
        this.nuevaOrden.fecha_subida = this.currentDate();
        this.nuevaOrden.archivo = '';
        if (this.$refs.formRef) {
          this.$refs.formRef.reset(); // Resetea validación si es necesaria
        }
        this.dialog=false;
      },
      handleFileChange(event) {
        this.nuevaOrden.archivo = event.target.files[0] || null;
      },
  
      currentDate() {
        const current = new Date();
        const date = `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}`;
        return date;
      }
    },
    mounted() {
      this.fetchData();
    }
  };
  </script>
  
  <style>
  .v-main {
    align-items: flex-start !important;
  }
  </style>
  