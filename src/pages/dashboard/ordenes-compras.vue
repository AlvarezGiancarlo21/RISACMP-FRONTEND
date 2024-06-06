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
            <v-btn color="success" class="text-none font-weight-regular" prepend-icon="mdi-plus" v-bind="activatorProps"
              @click="() => {
                obtenerRazonSocialProveedores();
                dialog = true;
                modoModal = 'Agregar';
              }">
              REGISTRAR
            </v-btn>
          </template>

          <v-card
            :title="modoModal === 'Agregar' ? 'Registro Orden de Compra' : modoModal === 'Editar' ? 'Editar Estado' : 'X'"
            class="text-center">
            <v-card-text>
              <v-row dense v-if="modoModal === 'Agregar'">
                <!-- nro -->
                <v-col cols="12">
                  <p class="text-left font-weight-bold">Nro: </p>
                  <v-text-field v-model="nuevaOrden.nro" cleareable disabled>
                  </v-text-field>
                </v-col>

                <v-col cols="12">
                  <p class="text-left font-weight-bold">Nombre de orden de compra: </p>
                  <v-text-field v-model="nuevaOrden.nombre" cleareable placeholder="Nombre de orden de compra">
                  </v-text-field>
                </v-col>

                <v-col cols="12">
                  <p class="text-left font-weight-bold">Buscar archivo: </p>
                  <v-file-input v-model="nuevaOrden.archivo" cleareable>
                  </v-file-input>
                </v-col>

                <v-col cols="12">
                  <p class="text-left font-weight-bold">Usuario: </p>
                  <v-text-field v-model="nuevaOrden.user" cleareable disabled>
                  </v-text-field>
                </v-col>

                <v-col cols="12">
                  <p class="text-left font-weight-bold">Proveedor: </p>
                  <v-combobox v-model="nuevaOrden.proveedor" cleareable :items="proveedores">
                  </v-combobox>
                </v-col>

                <v-col cols="12">
                  <p class="text-left font-weight-bold">Estado: </p>
                  <v-combobox v-model="nuevaOrden.estado" label="Seleccionar estado"
                    :items="['En proceso', 'Entregado', 'Factura', 'Denegado']">
                  </v-combobox>
                </v-col>


                <v-col cols="12">
                  <p class="text-left font-weight-bold">Fecha de subida: </p>
                  <v-text-field class="font-weight-bold" v-model="nuevaOrden.fecha_subida" disabled>
                  </v-text-field>
                </v-col>

              </v-row>
              <v-row v-if="modoModal === 'Agregar'">
                <v-col cols="8">
                </v-col>
                <v-col cols="2">
                  <v-btn width="300" color="blue" class="text-none font-weight-regular" prepend-icon="mdi-check"
                    text="GUARDAR" v-bind="activatorProps" @click="agregarOrdenCompra">
                  </v-btn>
                </v-col>
                <v-col cols="2">
                  <v-btn width="300" color="red" class="text-none font-weight-regular" prepend-icon="mdi-close"
                    text="CANCELAR" v-bind="activatorProps" @click="limpiarFormulario">
                  </v-btn>
                </v-col>
              </v-row>


              <v-row dense v-if="modoModal === 'Editar'">
                <v-col cols="12">
                  <p class="text-left font-weight-bold">Estado: </p>
                  <v-combobox v-model="OrdenSeleccianada.estado" label="Seleccionar Estado"
                    :items="['En proceso', 'Entregado', 'Factura', 'Denegado']" required>
                  </v-combobox>
                </v-col>
              </v-row>
              <v-row v-if="modoModal === 'Editar'">
                <v-col cols="8">
                </v-col>
                <v-col cols="2">
                  <v-btn width="300" color="blue" class="text-none font-weight-regular" prepend-icon="mdi-check"
                    text="GUARDAR" v-bind="activatorProps" @click="editarEstado(OrdenSeleccianada)">
                  </v-btn>
                </v-col>
                <v-col cols="2">
                  <v-btn width="300" color="red" class="text-none font-weight-regular" prepend-icon="mdi-close"
                    text="CANCELAR" v-bind="activatorProps" @click="limpiarFormulario">
                  </v-btn>
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
          <template v-slot:[`item.actions`]="{ item }">

            <div class="botones-iconos">
              <v-icon size="small" align-items="center"
                @click="() => { estadoOrdenCompra(item); modoModal = 'Editar'; dialog = true; }">
                mdi-pencil
              </v-icon>
              <v-spacer></v-spacer>
              <v-icon size="small" align-items="center" @click="() => { verArchivo(item) }">
                mdi-eye
              </v-icon>
            </div>

          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '@/stores/User';
import { computed } from 'vue';
import { onMounted } from 'vue';
import jwt_decode from 'jwt-decode';

export default {
  data() {
    const userStore = useUserStore();
    const nombres = computed(() => userStore.user.nombres);
    const apellidos = computed(() => userStore.user.apellidos);

    return {
      OrdenSeleccianada: {
        nro: '',
        nombre: '',
        archivo: '',
        user: '',
        fecha_subida: '',
        proveedor: '',
        estado: ''
      },
      dialog: false,
      search: '',
      headers: [
        {
          align: 'start',
          key: 'nro',
          sortable: false,
          title: 'Nro Orden de Compra',
        },
        { key: 'nombre', title: 'Nombre de orden de compra' },
        { key: 'archivo', title: 'Archivo' },
        { key: 'user', title: 'Usuario' },
        { key: 'fecha_subida', title: 'Fecha de subida' },
        { key: 'proveedor', title: 'Proveedor' },
        { key: 'estado', title: 'Estado' },
        { key: 'actions', title: 'Acciones', sortable: false, align: 'center' }
      ],
      ordenes: [],
      ids: [],
      proveedores: [],
      nuevaOrden: {},
      modoModal: ''
    };
  },
  computed: {
    nombres() {
      return useUserStore().user.nombres;
    },
    apellidos() {
      return useUserStore().user.apellidos;
    }
  },
  methods: {
    initializeNuevaOrden() {
      return {
        nro: this.getNextId(),
        nombre: '',
        archivo: null,
        user: `${this.nombres} ${this.apellidos}`,
        fecha_subida: this.currentDate(),
        proveedor: '',
        estado: ''
      };
    },
    getNextId() {
      return this.ids[this.ids.length - 1] + 1
    },
    async fetchData() {
      try {
        const response = await axios.get("http://localhost:3000/api/orden-compra/get/all");
        console.log("Data:", response.data);
        this.ordenes = response.data.map((orden) => {
          return {
            ...orden,
            fecha_subida: this.formatDate(orden.fecha_subida),
          };
        });

        this.ids = response.data.map(orden => orden.nro);
        this.nuevaOrden = this.initializeNuevaOrden();  // Actualizar nuevaOrden después de obtener los ids
        console.log(this.ids);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async obtenerRazonSocialProveedores() {
      try {
        const response = await axios.get("http://localhost:3000/api/provider");
        this.proveedores = response.data.map(proveedor => proveedor.razonSocial);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },


    async agregarOrdenCompra() {
      try {
        // Actualiza el ID de la nueva orden antes de enviarla
        this.nuevaOrden.nro = this.getNextId();

        const formData = new FormData();
        for (const key in this.nuevaOrden) {
          formData.append(key, this.nuevaOrden[key]);
        }

        const response = await axios.post('http://localhost:3000/api/orden-compra/post', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });

        console.log('Orden de compra agregada:', response.data);
        this.ordenes.push(response.data);
        await this.fetchData();
        this.limpiarFormulario();
      } catch (error) {
        console.error('Error al agregar orden:', error);
        this.modoModal = 'Agregar';
      }
    },
    async estadoOrdenCompra(i) {
      const response = await axios.get(
        "http://localhost:3000/api/orden-compra/get/" + i._id
      );
      console.log("Orden selecionada:", response.data);
      this.OrdenSeleccianada = response.data;
    },
    async editarEstado(i) {
      console.log('identificado'+i);
      try {
        const response = await axios.put(
          "http://localhost:3000/api/orden-compra/" + i._id,
          this.OrdenSeleccianada
        );
        console.log("Proveedor modificado:", response.data);
        await this.fetchData();
        this.dialog = false;
        this.modoModal = "";
      } catch (error) {
        this.modoModal = "Editar";
        this.dialogAgregarConfirmacion = true;
        console.error("Error al agregar proveedor:", error);
      }
    },

    async verArchivo(i) {
      const response = await axios.get(
        "http://localhost:3000/api/orden-compra/get/" + i._id
      );
      console.log("Orden selecionada:", response.data);
      this.OrdenSeleccianada = response.data;

      const url = this.OrdenSeleccianada.archivo

      window.open(url, '_blank');
    },
    limpiarFormulario() {
      this.nuevaOrden = this.initializeNuevaOrden();
      if (this.$refs.formRef) {
        this.$refs.formRef.reset(); // Resetea validación si es necesaria
      }
      this.dialog = false;
      this.modoModal = '';
    },
    handleFileChange(event) {
      this.nuevaOrden.archivo = event.target.files[0] || null;
    },
    currentDate() {
      const current = new Date();
      const date = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`;
      return date;
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      const year = date.getUTCFullYear()
      const month = String(date.getUTCMonth() + 1).padStart(2, "0")
      const day = String(date.getUTCDate()).padStart(2, "0")
      return `${year}-${month}-${day}`
    },
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

.botones-iconos{
  display: flex;
  flex-direction: row;
}
;
</style>