<template>
  <div class="container-tabla-facturas">
    <v-card flat>
      <template v-slot:text>
        <div class="container-header-table">
          <!-- Cuadro de busqueda para buscar un proveedor -->
          <v-text-field
            v-model="search"
            label="Buscar"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
          ></v-text-field>
          <v-btn color="green-darken-2" @click="dialogExportarUsuarios = true">
            Exportar
          </v-btn>
          <v-btn
            color="blue-darken-2"
            @click="
              () => {
                dialogAgregar = true;
                modoModal = 'Agregar';
                console.log(modoModal);
              }
            "
          >
            Agregar
          </v-btn>
        </div>
      </template>
      <!-- Tabla de datos principal para mostrar todos los proveedores -->
      <v-data-table :headers="headers" :items="facturas" :search="search">
        <template v-slot:item.actions="{ item }">
          <v-icon
            class="me-2"
            size="small"
            @click="
              () => {
                detalleFactura(item);
                modoModal = 'Detalle';
                dialogAgregar = true;
              }
            "
          >
            mdi-menu
          </v-icon>
          <v-icon
            class="me-2"
            size="small"
            @click="
              () => {
                detalleProveedor(item);
                modoModal = 'Modificar';
                dialogAgregar = true;
              }
            "
          >
            mdi-pencil
          </v-icon>
          <v-icon size="small" @click="deshabilitarProveedor(item)">
            mdi-cancel
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <div class="pa-4 text-center">
      <!-- Dialog para Agregar, Detalles y Editar -->
      <v-dialog
        v-model="dialogAgregar"
        max-width="1000"
        persistent
        transition="dialog-top-transition"
      >
        <v-card
          :title="
            modoModal === 'Detalle'
              ? 'Detalle Factura'
              : modoModal === 'Modificar'
              ? 'Modificar Factura'
              : 'Agregar Factura'
          "
          style="text-align: center"
        >
          <v-card-text>
            <!-- Inputs de Agregar Proveedor -->
            <v-row dense v-if="modoModal === 'Agregar'">
              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Código de Factura"
                  v-model="nuevaFactura.codigoFactura"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-combobox
                  label="Código de Orden de Compra"
                  v-model="nuevaFactura.codigoOrdenCompra"
                  :items="codigosOrdenCompra"
                  @update:modelValue="actualizarDetallesOrdenCompra"
                  @input="actualizarDetallesOrdenCompra"
                  required
                ></v-combobox>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Razón Social"
                  v-model="detallesProveedor.razonSocial"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="RUC del Proveedor"
                  v-model="detallesProveedor.ruc"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Dirección"
                  v-model="detallesProveedor.direccion"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Telefono"
                  v-model="detallesProveedor.telefono"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <h2>Productos:</h2>
                <div class="container-productos">
                  <div
                    class="elemento-producto"
                    v-for="(producto, index) in productosOrdenCompra"
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
                        <v-text-field
                          label="Nombre"
                          v-model="producto.nombre"
                          readonly
                        ></v-text-field>
                      </v-col>
                      <v-col cols="3.5">
                        <v-text-field
                          label="Cantidad"
                          v-model="producto.cantidad"
                          readonly
                        ></v-text-field>
                      </v-col>
                      <v-col cols="3.5">
                        <v-select
                          :items="['kg', 'g', 'l', 'ml']"
                          label="Unidad"
                          v-model="producto.unidad"
                          readonly
                        ></v-select>
                      </v-col>
                      <v-col cols="3.5">
                        <v-text-field
                          label="Precio Unidad"
                          v-model="producto.precio_unidad"
                          readonly
                        ></v-text-field>
                      </v-col>
                      <v-col cols="3.5">
                        <v-text-field
                          label="Precio Total"
                          v-model="producto.total"
                          readonly
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2" sm="3" class="remove-ingredient">
                        <v-btn @click="removeProducto(index)">Quitar</v-btn>
                      </v-col>
                    </v-row>
                  </div>
                </div>
                <v-btn @click="addProducto">Agregar producto</v-btn>
              </v-col>

              <v-col cols="12" md="6" sm="6">
                <v-text-field
                  label="Monto Antes de Impuestos"
                  v-model="nuevaFactura.montoAntesImpuestos"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" sm="6">
                <v-combobox
                  v-model="nuevaFactura.estado"
                  label="Seleccionar estado"
                  :items="['En proceso', 'Entregado', 'Factura', 'Denegado']"
                >
                </v-combobox>
              </v-col>

              <v-col cols="12">
                <v-file-input
                  v-model="nuevaFactura.archivo"
                  label="Foto de factura"
                  cleareable
                >
                </v-file-input>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Usuario"
                  v-model="nuevaFactura.user"
                  required
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" sm="6">
                <v-text-field
                  label="Fecha de Ingreso"
                  v-model="nuevaFactura.fechaIngreso"
                  type="date"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" sm="6">
                <v-text-field
                  label="Fecha de Emision"
                  v-model="nuevaFactura.fechaEmision"
                  required
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- Inputs de Detalle Proveedor -->
            <v-row dense v-if="modoModal === 'Detalle'">
              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Código de Factura"
                  v-model="facturaSeleccionada.codigoFactura"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Código de Orden de Compra"
                  v-model="facturaSeleccionada.codigoOrdenCompra"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Razón Social"
                  v-model="facturaSeleccionada.razonSocial"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="RUC del Proveedor"
                  v-model="facturaSeleccionada.rucProveedor"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <h2>Productos:</h2>
                <div class="container-productos">
                  <div
                    class="elemento-producto"
                    v-for="(
                      producto, index
                    ) in facturaSeleccionada.productos"
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
                        <v-text-field
                          label="Nombre"
                          v-model="producto.nombre"
                          readonly
                        ></v-text-field>
                      </v-col>
                      <v-col cols="3.5">
                        <v-text-field
                          label="Cantidad"
                          v-model="producto.cantidad"
                          readonly
                        ></v-text-field>
                      </v-col>
                      <v-col cols="3.5">
                        <v-text-field
                          label="Unidad"
                          v-model="producto.unidad"
                          readonly
                        ></v-text-field>
                      </v-col>
                      <v-col cols="3.5">
                        <v-text-field
                          label="Precio Unidad"
                          v-model="producto.precio_unidad"
                          readonly
                        ></v-text-field>
                      </v-col>
                      <v-col cols="3.5">
                        <v-text-field
                          label="Precio Total"
                          v-model="producto.total"
                          readonly
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" md="6" sm="6">
                <v-text-field
                  label="Monto Antes de Impuestos"
                  v-model="facturaSeleccionada.montoAntesImpuestos"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" sm="6">
                <v-text-field
                  label="Estado"
                  v-model="facturaSeleccionada.estado"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-file-input
                  v-model="facturaSeleccionada.archivo"
                  label="Foto de factura"
                  readonly
                ></v-file-input>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Usuario"
                  v-model="facturaSeleccionada.user"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" sm="6">
                <v-text-field
                  label="Fecha de Ingreso"
                  v-model="facturaSeleccionada.fechaIngreso"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" sm="6">
                <v-text-field
                  label="Fecha de Emisión"
                  v-model="facturaSeleccionada.fechaEmision"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- Tabla de datos de todos los proveedores -->
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions v-if="modoModal === 'Agregar'">
            <v-spacer></v-spacer>

            <v-btn
              color="success"
              text="Agregar"
              variant="tonal"
              @click="agregarFactura"
            ></v-btn>

            <v-btn
              color="red"
              text="Cancelar"
              variant="tonal"
              @click="
                () => {
                  dialogAgregar = false;
                  this.modoModal = '';
                }
              "
            ></v-btn>
          </v-card-actions>
          <v-card-actions v-if="modoModal === 'Detalle'">
            <v-spacer></v-spacer>
            <v-btn
              color="red"
              text="Salir"
              variant="tonal"
              @click="
                () => {
                  dialogAgregar = false;
                  this.modoModal = '';
                }
              "
            ></v-btn>
          </v-card-actions>
          <v-card-actions v-if="modoModal === 'Modificar'">
            <v-spacer></v-spacer>
            <v-btn
              color="success"
              text="Modificar"
              variant="tonal"
              @click="modificarProveedor(proveedorSeleccionado)"
            ></v-btn>

            <v-btn
              color="red"
              text="Cancelar"
              variant="tonal"
              @click="
                () => {
                  dialogAgregar = false;
                  this.modoModal = '';
                }
              "
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogAgregarConfirmacion" width="auto">
        <v-card
          max-width="400"
          prepend-icon="mdi-google-downasaur"
          text="Ha ocurrido un error al agregar factura. Verifique que todos los campos esten completos."
          title="Error al agregar la factura"
        >
          <template v-slot:actions>
            <v-btn
              class="ms-auto"
              text="Ok"
              @click="dialogAgregarConfirmacion = false"
            ></v-btn>
          </template>
        </v-card>
      </v-dialog>
      <!-- Dialog para Exportar Usuarios a PDF O XLSX -->
      <v-dialog v-model="dialogExportarUsuarios" max-width="480">
        <v-card v-card title="Exportar Usuario es formato EXCEL o PDF">
          <template v-slot:text>
            <div class="ma-4">
              <v-row>
                <v-col
                  style="
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                  "
                >
                  <v-img
                    :aspect-ratio="1"
                    class="bg-white"
                    src="/src/assets/Gestionar Usuarios/pdf.png"
                    style="height: 100px; width: 100px"
                  ></v-img>
                  <v-btn
                    class="my-2"
                    text="Exportar en PDF"
                    @click="exportToPDF()"
                  ></v-btn>
                </v-col>

                <v-col
                  style="
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                  "
                >
                  <v-img
                    :aspect-ratio="1"
                    class="bg-white"
                    src="/src/assets/Gestionar Usuarios/excel.png"
                    style="height: 100px; width: 100px"
                  ></v-img>
                  <v-btn
                    class="my-2"
                    text="Exportar en EXCEL"
                    @click="exportToExcel()"
                  ></v-btn>
                </v-col>
              </v-row>
            </div>
          </template>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text="Cerrar"
              variant="tonal"
              color="red"
              @click="dialogExportarUsuarios = false"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useUserStore } from "@/stores/User";
export default {
  data() {
    return {
      search: "",
      headers: [
        {
          align: "start",
          key: "codigoFactura",
          sortable: false,
          title: "Codigo Factura",
        },
        { key: "codigoOrdenCompra", title: "Codigo Orden Compra" },
        { key: "rucProveedor", title: "RUC Proveedor" },
        { key: "razonSocial", title: "Razón Social" },
        { key: "montoAntesImpuestos", title: "Monto" },
        { key: "user", title: "Usuario" },
        { key: "estado", title: "Estado" },
        { key: "actions", title: "Acciones", sortable: false },
      ],
      headersTablaModal: [
        {
          align: "start",
          key: "codigoFactura",
          sortable: false,
          title: "Codigo Factura",
        },
        { key: "codigoOrdenCompra", title: "Codigo Orden Compra" },
        { key: "rucProveedor", title: "RUC Proveedor" },
        { key: "razonSocial", title: "Razón Social" },
        { key: "montoAntesImpuestos", title: "Monto" },
        { key: "user", title: "Usuario" },
        { key: "estado", title: "Estado" },
        { key: "actions", title: "Acciones", sortable: false },
      ],
      facturas: [],
      dialogAgregar: false,
      dialogExportarFacturas: false,
      dialogAgregarConfirmacion: false,
      nuevaFactura: {},
      facturaSeleccionada: {
        _id: "",
        codigoOrdenCompra: 0,
        rucProveedor: "",
        razonSocial: "",
        archivo: "",
        user: "",
        codigoFactura: "",
        productos: [],
        fechaIngreso: "",
        fechaEmision: "",
        montoAntesImpuestos: 0,
        estado: "",
      },
      ids: [],
      detallesProveedor: {
        ruc: "",
        razonSocial: "",
        direccion: "",
        telefono: "",
      },
      ordenesCompra: [],
      codigosOrdenCompra: [],
      productosOrdenCompra: [],
      modoModal: "",
      detallesOrdenCompra: {
        rucProveedor: "",
        razonSocial: "",
        archivo: "",
        user: "",
        fechaRegistro: "",
      },
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
    initializeNuevaFactura() {
      return {
        codigoOrdenCompra: null,
        rucProveedor: "",
        razonSocial: null,
        archivo: null,
        user: `${this.nombres} ${this.apellidos}`,
        codigoFactura: "",
        productos: [],
        fechaEmision: this.formatDate(this.currentDate()),
        fechaIngreso: "",
        montoAntesImpuestos: null,
        estado: "",
      };
    },
    async fetchData() {
      try {
        const response = await axios.get("http://localhost:3000/api/factura");
        console.log("Data:", response.data);
        this.facturas = response.data.map((factura) => {
          return {
            ...factura,
            fechaEmision: this.formatDate(factura.fechaEmision),
          };
        });

        this.ids = response.data.map((factura) => factura.codigoFactura);
        this.nuevaFactura = this.initializeNuevaFactura();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async obtenerProveedorPorRazonSocial(razonSocial) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/provider/razon-social/${razonSocial}`
        );
        console.log("Proveedor encontrado:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        return null;
      }
    },
    async obtenerOrdenesDeCompra() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/orden-compra/get/all"
        );
        this.ordenesCompra = response.data;
        this.codigosOrdenCompra = response.data.map((orden) => orden.nro);
        console.log("Ordenes Compra:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async agregarFactura() {
      try {
        console.log("Nueva Factura:", this.nuevaFactura);
        const formData = new FormData();

        // Añadir todos los campos de nuevaFactura al formData
        for (const key in this.nuevaFactura) {
          if (key === "productos") {
            // Convertir productos a JSON antes de agregarlo a formData
            formData.append(key, JSON.stringify(this.nuevaFactura[key]));
          } else {
            formData.append(key, this.nuevaFactura[key]);
          }
        }

        // Verificar el contenido de formData
        formData.forEach((value, key) => {
          console.log(key, value);
        });

        const response = await axios.post(
          "http://localhost:3000/api/factura/register",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Factura agregada:", response.data);
        this.facturas.push(response.data);
        await this.fetchData();
        this.limpiarFormulario();
        this.modoModal = "";
        this.dialogAgregar = false;
      } catch (error) {
        this.modoModal = "Agregar";
        this.dialogAgregarConfirmacion = true;
        console.error("Error al agregar factura:", error);
      }
    },
    async detalleFactura(i) {
      const response = await axios.get(
        "http://localhost:3000/api/factura/" + i._id
      );
      console.log("Factura:", response.data);
      this.facturaSeleccionada = response.data;
      this.facturaSeleccionada.fechaIngreso = this.formatDate(this.facturaSeleccionada.fechaIngreso)
      this.facturaSeleccionada.fechaEmision = this.formatDate(this.facturaSeleccionada.fechaEmision)
    },
    addProducto() {
      if (this.modoModal === "Agregar") {
        this.nuevaFactura.productos.push({
          nombre: "",
          cantidad: 0,
          unidad: "",
          precio_unidad: 0,
          total: 0,
        });
      } else if (this.modoModal === "Modificar") {
        this.facturaSeleccionada.productos.push({
          nombre: "",
          cantidad: 0,
          unidad: "",
          precio_unidad: 0,
          total: 0,
        });
      }
    },
    removeProducto(index) {
      if (this.modoModal === "Agregar") {
        this.nuevaFactura.productos.splice(index, 1);
      } else if (this.modoModal === "Modificar") {
        this.facturaSeleccionada.productos.splice(index, 1);
      }
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
    limpiarFormulario() {
      this.nuevaFactura = this.initializeNuevaFactura();
      if (this.$refs.formRef) {
        this.$refs.formRef.reset(); // Resetea validación si es necesaria
      }
    },
    async actualizarDetallesOrdenCompra() {
      console.log(
        "Selected Código Orden de Compra:",
        this.nuevaFactura.codigoOrdenCompra
      );
      const orden = this.ordenesCompra.find(
        (o) => o.nro === this.nuevaFactura.codigoOrdenCompra
      );
      if (orden) {
        this.detallesProveedor.razonSocial = orden.proveedor;

        const proveedor = await this.obtenerProveedorPorRazonSocial(
          orden.proveedor
        );

        if (proveedor) {
          this.detallesProveedor.ruc = proveedor.ruc;
          this.detallesProveedor.direccion = proveedor.direccion;
          this.detallesProveedor.telefono = proveedor.telefono;

          this.nuevaFactura.rucProveedor = proveedor.ruc;
          this.nuevaFactura.razonSocial = proveedor.razonSocial;
        } else {
          this.detallesProveedor.ruc = "";
          this.detallesProveedor.direccion = "";
          this.detallesProveedor.telefono = "";

          this.nuevaFactura.rucProveedor = "";
          this.nuevaFactura.razonSocial = "";
        }

        this.productosOrdenCompra = orden.productos;
        this.nuevaFactura.productos = orden.productos; // Actualizar productos en nuevaFactura
        this.calcularMontoAntesDeImpuestos();
      } else {
        this.detallesProveedor.ruc = "";
        this.detallesProveedor.razonSocial = "";
        this.detallesProveedor.direccion = "";
        this.detallesProveedor.telefono = "";

        this.nuevaFactura.rucProveedor = "";
        this.nuevaFactura.razonSocial = "";
        this.nuevaFactura.archivo = "";
        this.nuevaFactura.user = "";
        this.nuevaFactura.fechaEmision = "";
        this.nuevaFactura.fechaIngreso = "";
        this.productosOrdenCompra = [];
        this.nuevaFactura.productos = []; // Limpiar productos en nuevaFactura
      }
    },
    calcularMontoAntesDeImpuestos() {
      this.nuevaFactura.montoAntesImpuestos =
        this.nuevaFactura.productos.reduce((total, producto) => {
          return total + producto.total;
        }, 0);
    },
    // async modificarProveedor(i) {
    //   try {
    //     const response = await axios.put(
    //       "http://localhost:3000/api/provider/" + i._id,
    //       this.proveedorSeleccionado
    //     );
    //     console.log("Proveedor modificado:", response.data);
    //     await this.fetchData();
    //     this.modoModal = "";
    //     this.dialogAgregar = false;
    //   } catch (error) {
    //     this.modoModal = "Modificar";
    //     this.dialogAgregarConfirmacion = true;
    //     console.error("Error al agregar proveedor:", error);
    //   }
    // },
    // async exportToExcel() {
    //   axios
    //     .get("http://localhost:3000/api/provider/export-excel", {
    //       responseType: "blob",
    //     }) // Indicar que esperamos una respuesta de tipo blob
    //     .then((response) => {
    //       const url = window.URL.createObjectURL(new Blob([response.data])); // Crear una URL para el blob
    //       const link = document.createElement("a"); // Crear un enlace
    //       link.href = url;
    //       link.setAttribute("download", "proveedores.xlsx"); // Establecer el nombre del archivo
    //       document.body.appendChild(link); // Agregar el enlace al DOM
    //       link.click(); // Simular clic en el enlace para iniciar la descarga
    //       window.URL.revokeObjectURL(url); // Liberar la URL del objeto
    //     })
    //     .catch((error) => {
    //       console.error("Error al exportar a Excel:", error);
    //     });
    // },
    // async exportToPDF() {
    //   axios
    //     .get("http://localhost:3000/api/provider/export-pdf", {
    //       responseType: "blob",
    //     })
    //     .then((response) => {
    //       const url = window.URL.createObjectURL(new Blob([response.data]));
    //       const link = document.createElement("a");
    //       link.href = url;
    //       link.setAttribute("download", "proveedores.pdf");
    //       document.body.appendChild(link);
    //       link.click();
    //     })
    //     .catch((error) => {
    //       console.error("Error al exportar a PDF:", error);
    //     });
    // },
  },
  mounted() {
    this.fetchData();
    this.obtenerOrdenesDeCompra();
  },
};
</script>

<style>
.container-tabla-facturas {
  width: 100%;
  padding: 20px;
}

.container-header-table {
  display: flex;
  align-items: center;
  gap: 30px;
}

.v-main {
  align-items: flex-start !important;
}

.v-card-item {
  background-color: #000;
  color: #fff;
  padding-bottom: 10px !important;
}

.container-productos {
  max-height: 200px; /* Altura máxima del contenedor */
  overflow-y: auto; /* Habilitar scroll vertical */
  overflow-x: hidden; /* Deshabilitar scroll horizontal */
  margin: 10px;
  padding: 20px;
  border: 1px solid #ccc; /* Opcional: añadir borde */
  border-radius: 4px; /* Opcional: añadir borde redondeado */
  background-color: #f9f9f9; /* Opcional: añadir color de fondo */
}
</style>
