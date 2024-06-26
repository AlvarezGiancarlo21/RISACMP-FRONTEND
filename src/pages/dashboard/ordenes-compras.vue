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
              v-bind="activatorProps"
              @click="
                () => {
                  obtenerProveedores();
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
                ? 'Registro Orden de Compra'
                : modoModal === 'Editar'
                ? 'Editar Estado'
                : 'X'
            "
            class="text-center"
          >
            <v-card-text>
              <v-row dense v-if="modoModal === 'Agregar'">
                <!-- nro -->
                <v-col cols="12">
                  <p class="text-left font-weight-bold">Nro:</p>
                  <v-text-field v-model="nuevaOrden.nro" cleareable disabled>
                  </v-text-field>
                </v-col>

                <v-col cols="12">
                  <p class="text-left font-weight-bold">
                    Observacion:
                  </p>
                  <v-text-field
                    v-model="nuevaOrden.nombre"
                    cleareable
                    placeholder="Observacion"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12">
                  <p class="text-left font-weight-bold">Usuario:</p>
                  <v-text-field v-model="nuevaOrden.user" cleareable disabled>
                  </v-text-field>
                </v-col>
                <v-col cols="12" style="padding-bottom: 30px">
                  <h1 style="text-align: left; font-size: 20px">Proveedor:</h1>
                </v-col>
                <v-row>
                  <v-col cols="3">
                    <p class="text-left font-weight-bold">Razon Social</p>
                    <v-combobox
                      v-model="nuevaOrden.proveedor"
                      :items="razonesSociales"
                      @update:modelValue="actualizarDetallesProveedor"
                      @input ="actualizarDetallesProveedor"
                    ></v-combobox>
                  </v-col>
                  <v-col cols="3">
                    <p class="text-left font-weight-bold">Ruc</p>
                    <v-text-field
                      v-model="detallesProveedor.ruc"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <p class="text-left font-weight-bold">Dirección</p>
                    <v-text-field
                      v-model="detallesProveedor.direccion"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <p class="text-left font-weight-bold">Telefono</p>
                    <v-text-field
                      v-model="detallesProveedor.telefono"
                      readonly
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-col cols="12" md="12" sm="12">
                  <h2 style="text-align: start; margin-bottom: 15px">
                    Productos:
                  </h2>
                  <div class="container-productos">
                    <div
                      class="elemento-producto"
                      v-for="(producto, index) in nuevaOrden.productos"
                      :key="index"
                    >
                      <v-row>
                        <v-col
                          cols="1"
                          style="
                            height: 50px;
                            margin-top: 15px;
                            border-radius: 20px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            background-color: #ededed;
                          "
                        >
                          <span>{{ index + 1 }}</span>
                        </v-col>
                        <v-col cols="3.5">
                          <v-autocomplete
                            :items="productosNombre"
                            v-model="producto.nombre"
                            label="Buscar producto"
                            required
                            hide-no-data
                            hide-details
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="3.5">
                          <v-text-field
                            label="Cantidad"
                            v-model="producto.cantidad"
                            required
                            :rules="[
                              (value) =>
                                /^\d*\.?\d+$/.test(value) ||
                                'Debe ser un valor numérico positivo',
                            ]"
                            @input="
                              updateTotal(producto)
                            "
                            @update:modelValue="
                              updateTotal(producto)
                            "
                          ></v-text-field>
                        </v-col>
                        <v-col cols="3.5">
                          <v-select
                            label="Unidad"
                            v-model="producto.unidad"
                            :items="['kg', 'g', 'l', 'ml']"
                            required
                          ></v-select>
                        </v-col>
                        <v-col cols="3.5">
                          <v-text-field
                            label="Precio Unidad"
                            v-model="producto.precio_unidad"
                            required
                            :rules="[
                              (value) =>
                                /^\d*\.?\d+$/.test(value) ||
                                'Debe ser un valor numérico positivo',
                            ]"
                            @input="
                              updateTotal(producto)
                            "
                            @update:modelValue="
                              updateTotal(producto)
                            "
                          ></v-text-field>
                        </v-col>
                        <v-col cols="3.5">
                          <v-text-field
                          label="Total"
                          v-model="producto.total"
                          required
                          :rules="[
                            (value) =>
                              /^\d*\.?\d+$/.test(value) ||
                              'Debe ser un valor numérico positivo',
                          ]"
                          readonly
                        ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          md="2"
                          sm="3"
                          class="remove-ingredient"
                        >
                          <v-btn @click="removeProducto(index)">Quitar</v-btn>
                        </v-col>
                      </v-row>
                    </div>
                  </div>
                  <v-btn @click="addProducto">Agregar producto</v-btn>
                </v-col>

                <v-col cols="12">
                  <p class="text-left font-weight-bold">Estado:</p>
                  <v-combobox
                    v-model="nuevaOrden.estado"
                    label="Seleccionar estado"
                    :items="['En proceso', 'Entregado', 'Factura', 'Denegado']"
                  >
                  </v-combobox>
                </v-col>

                <v-col cols="12">
                  <p class="text-left font-weight-bold">Fecha de subida:</p>
                  <v-text-field
                    class="font-weight-bold"
                    v-model="nuevaOrden.fecha_subida"
                    disabled
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <p class="text-left font-weight-bold">Subir archivo:</p>
                  <v-file-input v-model="nuevaOrden.archivo" cleareable>
                  </v-file-input>
                </v-col>
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
                  >
                  </v-btn>
                </v-col>
              </v-row>

              <v-row dense v-if="modoModal === 'Editar'">
                <v-col cols="12">
                  <p class="text-left font-weight-bold">Estado:</p>
                  <v-combobox
                    v-model="OrdenSeleccianada.estado"
                    label="Seleccionar Estado"
                    :items="['En proceso', 'Entregado', 'Factura', 'Denegado']"
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
                    @click="editarEstado(OrdenSeleccianada)"
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
        <v-data-table :headers="headers" :items="ordenes" :search="search">
          <template v-slot:[`item.actions`]="{ item }">
            <div class="botones-iconos">
              <v-icon
                size="small"
                align-items="center"
                @click="
                  () => {
                    estadoOrdenCompra(item);
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
      OrdenSeleccianada: {
        nro: "",
        nombre: "",
        archivo: "",
        user: "",
        fecha_subida: "",
        proveedor: "",
        productos: [],
        estado: "",
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
        { key: "proveedor", title: "Proveedor" },
        { key: "fecha_subida", title: "Fecha de subida" },
        { key: "user", title: "Usuario" },
        { key: "nombre", title: "Observacion" },
        // { key: "archivo", title: "Archivo" },
        { key: "estado", title: "Estado" },
        { key: "actions", title: "Acciones", sortable: false, align: "center" },
      ],
      ordenes: [],
      ids: [],
      proveedores: [],
      razonesSociales: [],
      detallesProveedor: {
        ruc: "",
        direccion: "",
        telefono: "",
      },
      nuevaOrden: {},
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
    initializeNuevaOrden() {
      return {
        nro: this.getNextId(),
        nombre: "",
        archivo: null,
        user: `${this.nombres} ${this.apellidos}`,
        fecha_subida: this.currentDate(),
        proveedor: "",
        productos: [],
        estado: "",
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
    async obtenerProveedores() {
      try {
        const response = await axios.get("http://localhost:3000/api/provider");
        console.log("Response data:", response.data); // Verifica que los datos se están recibiendo
        this.proveedores = response.data;
        this.razonesSociales = response.data.map(
          (proveedor) => proveedor.razonSocial
        );
        console.log("Razones Sociales:", this.razonesSociales); // Verifica que las razones sociales se están poblando
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    actualizarDetallesProveedor() {
      console.log("Selected Razon Social:", this.nuevaOrden.proveedor); // Verifica que se seleccionó una razón social
      const proveedor = this.proveedores.find(
        (p) => p.razonSocial === this.nuevaOrden.proveedor
      );
      if (proveedor) {
        this.detallesProveedor.ruc = proveedor.ruc;
        this.detallesProveedor.direccion = proveedor.direccion;
        this.detallesProveedor.telefono = proveedor.telefono;
      } else {
        this.detallesProveedor.ruc = "";
        this.detallesProveedor.direccion = "";
        this.detallesProveedor.telefono = "";
      }
    },
    addProducto() {
      this.nuevaOrden.productos.push({
        nombre: "",
        cantidad: "",
        unidad: "",
        precio_unidad: "",
        total: "",
      });
    },
    removeProducto(index) {
      this.nuevaOrden.productos.splice(index, 1);
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
    async agregarOrdenCompra() {
      try {
        // Actualiza el ID de la nueva orden antes de enviarla
        this.nuevaOrden.nro = this.getNextId();

        const formData = new FormData();
        for (const key in this.nuevaOrden) {
          formData.append(key, this.nuevaOrden[key]);
        }

        const response = await axios.post(
          "http://localhost:3000/api/orden-compra/post",
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
    async estadoOrdenCompra(i) {
      const response = await axios.get(
        "http://localhost:3000/api/orden-compra/get/" + i._id
      );
      console.log("Orden selecionada:", response.data);
      this.OrdenSeleccianada = response.data;
    },
    async editarEstado(i) {
      console.log("identificado" + i);
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

      const url = this.OrdenSeleccianada.archivo;

      window.open(url, "_blank");
    },
    limpiarFormulario() {
      this.nuevaOrden = this.initializeNuevaOrden();
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