<template>
  <v-container>
    <v-row>
      <v-col class="mb-4 text-left">
        <h2 class="display-2 mb-3">Registrar Requerimientos</h2>
      </v-col>

      <v-col class="text-right">
        <!-- Boton que abre el dialog para registrar nuevo Requerimientos -->
        <v-dialog v-model="dialog" max-width="1200">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              color="success"
              class="text-none font-weight-regular"
              prepend-icon="mdi-plus"
              v-bind="activatorProps"
              @click="
                () => {
                  obtenerRequerimientos();
                  dialog = true;
                  modoModal = 'Agregar';
                }
              "
            >
              REGISTRAR
            </v-btn>
          </template>

          <v-card
            :title="
              modoModal === 'Agregar'
                ? 'Registrar Requerimiento Materia Prima'
                : modoModal === 'Editar'
                ? 'Editar Estado'
                : 'Hoal'
            "
            class="text-center"
          >
            <v-card-text>
             <v-row dense v-if="modoModal === 'Agregar'">
                <!-- nro -->
                <v-col cols="12">
                  <p class="text-left font-weight-bold">Nro:</p>
                  <v-text-field v-model="nuevoRequerimiento.nro" cleareable disabled>
                  </v-text-field>
                </v-col>

                <v-col cols="12">
                  <p class="text-left font-weight-bold">Estado:</p>
                  <v-combobox
                    v-model="nuevoRequerimiento.estado"
                    label="Seleccionar estado"
                    :items="['En espera', 'Procesandose', 'Finalizado']"
                  >
                  </v-combobox>
                </v-col>

                <v-col cols="12" style="padding-bottom: 30px">
                  <h1 style="text-align: left; font-size: 20px">Producto:</h1>
                </v-col>
                <v-row>
                  <v-col cols="3">
                    <p class="text-left font-weight-bold">producto_id</p>
                    <v-combobox
                      v-model="nuevoRequerimiento.producto"
                      :items="producto_id"
                      @update:modelValue="actualizarDetallesProducto"
                      @input ="actualizarDetallesProducto"
                    ></v-combobox>
                  </v-col>
                  <v-col cols="3">
                    <p class="text-left font-weight-bold">Cantidad</p>
                    <v-text-field
                      v-model="detallesProducto.cantidad"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <p class="text-left font-weight-bold">Unidad de Medida</p>
                    <v-text-field
                      v-model="detallesProducto.unidad_medida_id"
                      readonly
                    ></v-text-field>
                  </v-col>
                </v-row>

              </v-row>
              <v-row v-if="modoModal === 'Agregar'">
                <v-col cols="8"> </v-col>
                <v-col cols="2">
                  <v-btn
                    width="300"
                    color="blue"
                    class="text-none font-weight-regular"
                    prepend-icon="mdi-check"
                    text="GUARDAR"
                    v-bind="activatorProps"
                    @click="agregarRequerimiento"
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
                  >
                  </v-btn>
                </v-col>
              </v-row>

              <v-row dense v-if="modoModal === 'Editar'">
                <v-col cols="12">
                  <p class="text-left font-weight-bold">Estado:</p>
                  <v-combobox
                    v-model="requerimientoSeleccionado.estado"
                    label="Seleccionar Estado"
                    :items="['En espera', 'Procesandose', 'Finalizado']"
                    required
                  >
                  </v-combobox>
                </v-col>
              </v-row>
              <v-row v-if="modoModal === 'Editar'">
                <v-col cols="8"> </v-col>
                <v-col cols="2">
                  <v-btn
                    width="300"
                    color="blue"
                    class="text-none font-weight-regular"
                    prepend-icon="mdi-check"
                    text="GUARDAR"
                    v-bind="activatorProps"
                    @click="editarEstado(requerimientoSeleccionado)"
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
                  >
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
        <v-data-table :headers="headers" :items="requerimiento" :search="search">
          <template v-slot:[`item.actions`]="{ item }">
            <div class="botones-iconos">
              <v-icon
                size="small"
                align-items="center"
                @click="
                  () => {
                    estadoRequerimiento(item);
                    modoModal = 'Editar';
                    dialog = true;
                  }
                "
              >
                mdi-pencil
              </v-icon>
              <v-spacer></v-spacer>
              <v-icon
                size="small"
                align-items="center"
                @click="
                  () => {
                    verArchivo(item);
                  }
                "
              >
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
import axios from "axios";
import { useUserStore } from "@/stores/User";
import { computed } from "vue";
import { onMounted } from "vue";
import jwt_decode from "jwt-decode";

export default {
  data() {
    const userStore = useUserStore();
    const nombres = computed(() => userStore.user.nombres);
    const apellidos = computed(() => userStore.user.apellidos);

    return {
      requerimientoSeleccionado: {
        nro: "",
        estado: "",
        producto: "",
      },
      dialog: false,
      search: "",
      headers: [
        {
          align: "start",
          key: "nro",
          sortable: false,
          title: "Nro Orden de Compra",
        },
        { key: "estado", title: "Estado" },
        { key: "producto_id", title: "Id Producto" },
        { key: "cantidad", title: "Cantidad" },
        { key: "unidad_medida_id", title: "Unidad de Medida" },
        { key: "actions", title: "Acciones", sortable: false, align: "center" },
      ],
      requerimiento: [],
      ids: [],
      productos: [],
      producto_id: [],
      detallesProducto: {
        cantidad: "",
        unidad_medida_id: "",
      },
      nuevoRequerimiento: {},
      modoModal: "",
      productosNombre: [],
    };
  },
  computed: {
    nombres() {
      return useUserStore().user.nombres;
    },
    apellidos() {
      return useUserStore().user.apellidos;
    },
  },
  methods: {
    initializeNuevoRequerimiento() {
      return {
        nro: this.getNextId(),
        estado: "",
        producto: "",
      };
    },
    getNextId() {
      return this.ids[this.ids.length - 1] + 1;
    },
    async fetchData() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/orden-compra/get/all"
        );
        console.log("Data:", response.data);
        this.ordenes = response.data.map((orden) => {
          return {
            ...orden,
            fecha_subida: this.formatDate(orden.fecha_subida),
          };
        });

        this.ids = response.data.map((orden) => orden.nro);
        this.nuevaOrden = this.initializeNuevaOrden(); // Actualizar nuevaOrden después de obtener los ids
        console.log(this.ids);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async obtenerProducto() {
      try {
        const response = await axios.get("http://localhost:3000/api/producto");
        console.log("Response data:", response.data); // Verifica que los datos se están recibiendo
        this.productos = response.data;
        this.producto_id = response.data.map(
          (producto) => producto.producto
        );
        console.log("Razones Sociales:", this.razonesSociales); // Verifica que las razones sociales se están poblando
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    actualizarDetallesProducto() {
      console.log("Selected Id Producto:", this.nuevoRequerimiento.producto); // Verifica que se seleccionó una razón social
      const producto = this.productos.find(
        (p) => p.producto_id === this.nuevoRequerimiento.producto
      );
      if (producto) {
        this.detallesProducto.cantidad = producto.cantidad;
        this.detallesProducto.unidad_medida_id = producto.unidad_medida_id;

      } else {
        this.detallesProducto.cantidad = "";
        this.detallesProducto.unidad_medida_id = "";
      }
    },
    async fetchProductos() {
      try {
        const response = await axios.get("http://localhost:3000/api/producto");
        console.log("Data:", response.data);
        this.productosNombre = response.data.map(
          (producto) => producto.nombreProducto
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async agregarRequerimiento() {
      try {
        // Actualiza el ID de la nueva orden antes de enviarla
        //this.nuevoRequerimiento.nro = this.getNextId();

        const formData = new FormData();
        for (const key in this.nuevoRequerimiento) {
          formData.append(key, this.nuevoRequerimiento[key]);
        }

        const response = await axios.post(
          "http://localhost:3000/api/requerimiento/post",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Orden de compra agregada:", response.data);
        this.ordenes.push(response.data);
        await this.fetchData();
        this.limpiarFormulario();
      } catch (error) {
        console.error("Error al agregar orden:", error);
        this.modoModal = "Agregar";
      }
    },
    async estadoRequerimiento(i) {
      const response = await axios.get(
        "http://localhost:3000/api/requerimiento/get/" + i._id
      );
      console.log("Orden selecionada:", response.data);
      this.requerimientoSeleccionado = response.data;
    },
    async editarEstado(i) {
      console.log("identificado" + i);
      try {
        const response = await axios.put(
          "http://localhost:3000/api/requerimiento/" + i._id,
          this.requerimientoSeleccionado
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

      const url = this.OrdenSeleccianada.archivo;

      window.open(url, "_blank");
    },
    limpiarFormulario() {
      this.nuevoRequerimiento = this.initializeNuevoRequerimiento();
      if (this.$refs.formRef) {
        this.$refs.formRef.reset(); // Resetea validación si es necesaria
      }
      this.dialog = false;
      this.modoModal = "";
      this.detallesProveedor = {};
    },
    handleFileChange(event) {
      this.nuevaOrden.archivo = event.target.files[0] || null;
    },
    currentDate() {
      const current = new Date();
      const date = `${current.getFullYear()}-${
        current.getMonth() + 1
      }-${current.getDate()}`;
      return date;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const day = String(date.getUTCDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    validatePositiveNumber(value, model) {
      const regex = /^\d*\.?\d*$/; // Permite solo números y punto decimal
      if (!regex.test(value)) {
        model = value.slice(0, -1);
        return model;
      }
      return value;
    },
    updateTotal(producto) {
      producto.total = (parseFloat(producto.cantidad) * parseFloat(producto.precio_unidad)).toFixed(2);
    },
  },
  mounted() {
    this.fetchData(), this.fetchProductos();
  }
};
</script>
<style>
.v-main {
  align-items: flex-start !important;
}

.botones-iconos {
  display: flex;
  flex-direction: row;
}

.container-productos {
  max-height: 300px; /* Altura máxima del contenedor */
  overflow-y: auto; /* Habilitar scroll vertical */
  overflow-x: hidden; /* Deshabilitar scroll horizontal */
  margin: 10px;
  padding: 20px;
  border: 1px solid #ccc; /* Opcional: añadir borde */
  border-radius: 4px; /* Opcional: añadir borde redondeado */
  background-color: #f9f9f9; /* Opcional: añadir color de fondo */
}

@media (min-width: 1280px) {
  .v-container {
    max-width: 100%;
  }
}
</style>