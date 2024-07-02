<template>
  <div class="container-tabla-nota-creditos">
    <v-card flat>
      <template v-slot:text>
        <div class="container-header-table">
          <v-text-field
            v-model="search"
            label="Buscar"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
          ></v-text-field>
          <v-btn
            color="green-darken-2"
            @click="dialogExportarNotasCredito = true"
          >
            Exportar
          </v-btn>
          <v-btn
            color="blue-darken-2"
            @click="
              () => {
                dialogAgregar = true;
                modoModal = 'Agregar';
                limpiarFormulario();
              }
            "
          >
            Agregar
          </v-btn>
        </div>
      </template>
      <v-data-table :headers="headers" :items="notasCredito" :search="search">
        <template v-slot:item.actions="{ item }">
          <v-icon
            class="me-2"
            size="small"
            @click="
              () => {
                detalleNotaCredito(item);
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
                detalleNotaCredito(item);
                modoModal = 'Modificar';
                dialogAgregar = true;
              }
            "
          >
            mdi-pencil
          </v-icon>
          <v-icon size="small" @click="deshabilitarNotaCredito(item)">
            mdi-cancel
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <div class="pa-4 text-center">
      <v-dialog
        v-model="dialogAgregar"
        max-width="1000"
        persistent
        transition="dialog-top-transition"
      >
        <v-card
          :title="
            modoModal === 'Detalle'
              ? 'Detalle Nota de Crédito'
              : modoModal === 'Modificar'
              ? 'Modificar Nota de Crédito'
              : 'Agregar Nota de Crédito'
          "
          style="text-align: center"
        >
          <v-card-text>
            <!-- Inputs para Agregar Nota de Crédito -->
            <v-row dense v-if="modoModal == 'Agregar'">
              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Código de Nota de Crédito"
                  v-model="nuevaNotaCredito.codigo"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-combobox
                  label="Código de Factura"
                  v-model="nuevaNotaCredito.codigoFactura"
                  :items="codigosFacturas"
                  @update:modelValue="actualizarDetallesFactura"
                  @input="actualizarDetallesFactura"
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
              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Descripción"
                  v-model="nuevaNotaCredito.descipcion"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <h2>Productos:</h2>
                <div class="container-productos">
                  <div
                    class="elemento-producto"
                    v-for="(producto, index) in nuevaNotaCredito.productos"
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
                          label="Cantidad NC"
                          v-model="producto.cantidad_nc"
                          @input="calcularMontos()"
                          @update:modelValue="calcularMontos()"
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

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Monto"
                  v-model="nuevaNotaCredito.monto"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Monto Nota de Credito"
                  v-model="nuevaNotaCredito.monto_nc"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Monto Diferencia"
                  v-model="nuevaNotaCredito.monto_diferencia"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" sm="6">
                <v-text-field
                  label="Fecha de Registro"
                  v-model="nuevaNotaCredito.fechaEmision"
                  type="date"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-text-field
                  label="Fecha de Registro"
                  v-model="nuevaNotaCredito.fechaIngreso"
                  required
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- Inputs para Detalles de Nota de Credito -->
            <v-row dense v-if="modoModal === 'Detalle'">
              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Código de Nota de Crédito"
                  v-model="notaCreditoSeleccionada.codigo"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Código de Factura"
                  v-model="notaCreditoSeleccionada.codigoFactura"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Razón Social"
                  v-model="notaCreditoSeleccionada.razonSocial"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="RUC del Proveedor"
                  v-model="notaCreditoSeleccionada.rucProveedor"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Descripción"
                  v-model="notaCreditoSeleccionada.descipcion"
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
                    ) in notaCreditoSeleccionada.productos"
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
                          label="Cantidad NC"
                          v-model="producto.cantidad_nc"
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

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Monto"
                  v-model="notaCreditoSeleccionada.monto"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Monto Nota de Crédito"
                  v-model="notaCreditoSeleccionada.monto_nc"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Monto Diferencia"
                  v-model="notaCreditoSeleccionada.monto_diferencia"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" sm="6">
                <v-text-field
                  label="Fecha de Emisión"
                  v-model="notaCreditoSeleccionada.fechaEmision"
                  type="date"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" sm="6">
                <v-text-field
                  label="Fecha de Ingreso"
                  v-model="notaCreditoSeleccionada.fechaIngreso"
                  type="date"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions v-if="modoModal === 'Agregar'">
            <v-spacer></v-spacer>

            <v-btn
              color="success"
              text="Agregar"
              variant="tonal"
              @click="agregarNotaCredito"
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
              @click="modificarNotaCredito"
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
          text="Ha ocurrido un error al agregar la nota de crédito. Verifique que todos los campos estén completos."
          title="Error al agregar la nota de crédito"
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

      <v-dialog v-model="dialogExportarNotasCredito" max-width="480">
        <v-card title="Exportar Notas de Crédito en formato EXCEL o PDF">
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
              @click="dialogExportarNotasCredito = false"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      search: "",
      headers: [
        {
          align: "start",
          title: "Código de Nota Crédito",
          key: "codigo",
          sortable: false,
        },
        { title: "Fecha", key: "fechaIngreso" },
        { title: "Código de Factura", key: "codigoFactura" },
        { title: "Razón Social", key: "razonSocial" },
        { title: "RUC del Proveedor", key: "rucProveedor" },
        { title: "Descripción", key: "descipcion" },
        { title: "Monto Diferencia", key: "monto_diferencia" },
        { title: "Acciones", key: "actions" },
      ],
      productHeaders: [
        {
          align: "center",
          text: "Código de Producto",
          value: "codigoProducto",
        },
        { align: "center", text: "Descripción", value: "descripcion" },
        { align: "center", text: "Cantidad", value: "cantidad" },
        { align: "center", text: "Seleccionar", value: "seleccionado" },
      ],
      notasCredito: [],
      facturas: [],
      codigosFacturas: [],
      detallesProveedor: {
        ruc: "",
        razonSocial: "",
        direccion: "",
        telefono: "",
      },
      productosFactura: [],
      dialogAgregar: false,
      dialogAgregarConfirmacion: false,
      dialogExportarNotasCredito: false,
      nuevaNotaCredito: {},
      modoModal: "",
      notaCreditoSeleccionada: {
        codigo: "",
        codigoFactura: "",
        razonSocial: "",
        rucProveedor: "",
        descipcion: "",
        productos: [],
        monto: 0,
        monto_nc: 0,
        monto_diferencia: 0,
        fechaEmision: "",
        fechaIngreso: "",
      },
    };
  },
  methods: {
    initializeNuevaNotaCredito() {
      return {
        codigo: "",
        codigoFactura: "",
        rucProveedor: "",
        razonSocial: "",
        tipo: "articulos",
        descipcion: "",
        productos: [],
        fechaEmision: "",
        fechaIngreso: this.formatDate(this.currentDate()),
        monto: 0,
        monto_nc: 0,
        monto_diferencia: 0,
      };
    },
    async fetchNotasCredito() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/nota-credito"
        );
        this.notasCredito = response.data.map((notaCredito) => {
          return {
            ...notaCredito,
            fechaIngreso: this.formatDate(notaCredito.fechaIngreso),
          };
        });

        this.nuevaNotaCredito = this.initializeNuevaNotaCredito();
      } catch (error) {
        console.error(error);
      }
    },
    async fetchFacturas() {
      try {
        const response = await axios.get("http://localhost:3000/api/factura");
        this.facturas = response.data;
        this.codigosFacturas = response.data.map(
          (facturas) => facturas.codigoFactura
        );
      } catch (error) {
        console.error(error);
      }
    },
    // async cargarProductos(codigoFactura) {
    //   try {
    //     const response = await axios.get(`http://localhost:3000/api/facturas/${codigoFactura}/productos`);
    //     this.productosFactura = response.data.map(producto => ({ ...producto, seleccionado: false }));

    //     // Obtener detalles de la factura para llenar la razón social y RUC
    //     const factura = this.facturas.find(f => f.codigoFactura === codigoFactura);
    //     if (factura) {
    //       this.nuevaNotaCredito.razonSocial = factura.razonSocial;
    //       this.nuevaNotaCredito.rucProveedor = factura.rucProveedor;
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // },
    async agregarNotaCredito() {
      try {
        this.nuevaNotaCredito.productos.forEach((producto) => {
          producto.cantidad_nc = parseFloat(producto.cantidad_nc);
        });

        console.log(this.nuevaNotaCredito);

        const response = await axios.post(
          "http://localhost:3000/api/nota-credito/create",
          this.nuevaNotaCredito
        );
        this.notasCredito.push(response.data);
        await this.fetchData();
        this.dialogAgregar = false;
        this.limpiarFormulario();
      } catch (error) {
        console.error(error);
        this.dialogAgregarConfirmacion = true;
      }
    },
    async detalleNotaCredito(i) {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/nota-credito/" + i._id
        );
        this.notaCreditoSeleccionada = response.data;
        this.notaCreditoSeleccionada.fechaIngreso = this.formatDate(
          this.notaCreditoSeleccionada.fechaIngreso
        );
        this.notaCreditoSeleccionada.fechaEmision = this.formatDate(
          this.notaCreditoSeleccionada.fechaEmision
        );
      } catch (error) {
        console.error(error);
      }
    },
    async modificarNotaCredito() {
      try {
        this.nuevaNotaCredito.productos = this.productosFactura.filter(
          (producto) => producto.seleccionado
        );

        const response = await axios.put(
          `http://localhost:3000/api/nota-credito/${this.nuevaNotaCredito.codigoNotaCredito}`,
          this.nuevaNotaCredito
        );
        const index = this.notasCredito.findIndex(
          (nc) =>
            nc.codigoNotaCredito === this.nuevaNotaCredito.codigoNotaCredito
        );
        this.$set(this.notasCredito, index, response.data);
        this.dialogAgregar = false;
        this.limpiarFormulario();
      } catch (error) {
        console.error(error);
      }
    },
    async deshabilitarNotaCredito(notaCredito) {
      try {
        await axios.delete(
          `http://localhost:3000/api/nota-credito/${notaCredito.codigoNotaCredito}`
        );
        this.notasCredito = this.notasCredito.filter(
          (nc) => nc.codigoNotaCredito !== notaCredito.codigoNotaCredito
        );
      } catch (error) {
        console.error(error);
      }
    },
    currentDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const day = now.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const day = String(date.getUTCDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    limpiarFormulario() {
      this.nuevaNotaCredito = this.initializeNuevaNotaCredito();
      if (this.$refs.formRef) {
        this.$refs.formRef.reset(); // Resetea validación si es necesaria
      }
    },
    async exportToExcel() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/nota-credito/export-excel",
          {
            responseType: "blob",
          }
        );
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "notas_credito.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error(error);
      }
    },
    async exportToPDF() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/nota-credito/export-pdf",
          {
            responseType: "blob",
          }
        );
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "notas_credito.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error(error);
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
    async actualizarDetallesFactura() {
      console.log(
        "Selected Código Factura:",
        this.nuevaNotaCredito.codigoFactura
      );
      const factura = this.facturas.find(
        (f) => f.codigoFactura === this.nuevaNotaCredito.codigoFactura
      );
      if (factura) {
        this.detallesProveedor.razonSocial = factura.razonSocial;

        const proveedor = await this.obtenerProveedorPorRazonSocial(
          factura.razonSocial
        );

        if (proveedor) {
          this.detallesProveedor.ruc = proveedor.ruc;
          this.detallesProveedor.direccion = proveedor.direccion;
          this.detallesProveedor.telefono = proveedor.telefono;

          this.nuevaNotaCredito.rucProveedor = proveedor.ruc;
          this.nuevaNotaCredito.razonSocial = proveedor.razonSocial;
        } else {
          this.detallesProveedor.ruc = "";
          this.detallesProveedor.direccion = "";
          this.detallesProveedor.telefono = "";

          this.nuevaNotaCredito.rucProveedor = "";
          this.nuevaNotaCredito.razonSocial = "";
        }

        this.productosFactura = factura.productos;
        this.nuevaNotaCredito.monto = factura.montoAntesImpuestos;
        this.nuevaNotaCredito.productos = factura.productos; // Actualizar productos en nuevaFactura
        // this.calcularMontoAntesDeImpuestos();
      } else {
        this.detallesProveedor.ruc = "";
        this.detallesProveedor.razonSocial = "";
        this.detallesProveedor.direccion = "";
        this.detallesProveedor.telefono = "";

        this.nuevaNotaCredito.rucProveedor = "";
        this.nuevaFanuevaNotaCreditoctura.razonSocial = "";
        this.nuevaNotaCredito.fechaEmision = "";
        this.nuevaNotaCredito.fechaIngreso = "";
        this.productosFactura = [];
        this.nuevaNotaCredito.productos = []; // Limpiar productos en nuevaFactura
      }
    },
    calcularMontos() {
      let montoTotal = 0;
      let montoNC = 0;

      this.nuevaNotaCredito.productos.forEach((producto) => {
        const cantidad = parseFloat(producto.cantidad) || 0;
        const cantidad_nc = parseFloat(producto.cantidad_nc) || 0;
        const precio_unidad = parseFloat(producto.precio_unidad) || 0;

        // Calcular el total original para cada producto
        const totalProducto = cantidad * precio_unidad;
        montoTotal += totalProducto;

        // Calcular el total para la nota de crédito para cada producto
        const totalProductoNC = cantidad_nc * precio_unidad;
        montoNC += totalProductoNC;
      });

      this.nuevaNotaCredito.monto_nc = montoNC;
      this.nuevaNotaCredito.monto_diferencia = montoTotal - montoNC;
    },
  },
  async mounted() {
    await this.fetchNotasCredito();
    await this.fetchFacturas();
  },
};
</script>

<style>
.container-tabla-nota-creditos {
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
