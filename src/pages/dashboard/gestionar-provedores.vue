<template>
  <div class="container-tabla-proveedores">
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
              }
            "
          >
            Agregar
          </v-btn>
        </div>
      </template>
      <!-- Tabla de datos principal para mostrar todos los proveedores -->
      <v-data-table :headers="headers" :items="proveedores" :search="search">
        <template v-slot:item.actions="{ item }">
          <v-icon
            class="me-2"
            size="small"
            @click="
              () => {
                detalleProveedor(item);
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
              ? 'Detalle de Proveedor'
              : modoModal === 'Modificar'
              ? 'Modificar Proveedor'
              : 'Agregar Proveedor'
          "
          style="text-align: center"
        >
          <v-card-text>
            <!-- Inputs de Agregar Proveedor -->
            <v-row dense v-if="modoModal === 'Agregar'">
              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Razón social"
                  v-model="nuevoProveedor.razonSocial"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="RUC"
                  v-model="nuevoProveedor.ruc"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Lugar de Procedencia"
                  v-model="nuevoProveedor.lugarProcedencia"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Dirección"
                  v-model="nuevoProveedor.direccion"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Teléfono"
                  v-model="nuevoProveedor.telefono"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- Inputs de Detalle Proveedor -->
            <v-row dense v-if="modoModal === 'Detalle'">
              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Razón social"
                  v-model="proveedorSeleccionado.razonSocial"
                  required
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="RUC"
                  v-model="proveedorSeleccionado.ruc"
                  required
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Lugar de Procedencia"
                  v-model="proveedorSeleccionado.lugarProcedencia"
                  required
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Dirección"
                  v-model="proveedorSeleccionado.direccion"
                  required
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Teléfono"
                  v-model="proveedorSeleccionado.telefono"
                  required
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- Inputs de Modificar Proveedor -->
            <v-row dense v-if="modoModal === 'Modificar'">
              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Razón social"
                  v-model="proveedorSeleccionado.razonSocial"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="RUC"
                  v-model="proveedorSeleccionado.ruc"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Lugar de Procedencia"
                  v-model="proveedorSeleccionado.lugarProcedencia"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Dirección"
                  v-model="proveedorSeleccionado.direccion"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  label="Teléfono"
                  v-model="proveedorSeleccionado.telefono"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- Tabla de datos de todos los proveedores -->
            <v-data-table
              :headers="headersTablaModal"
              :items="proveedores"
              :search="search"
            ></v-data-table>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions v-if="modoModal === 'Agregar'">
            <v-spacer></v-spacer>

            <v-btn
              color="success"
              text="Agregar"
              variant="tonal"
              @click="agregarProveedor"
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
          text="Ha ocurrido un error al agregar usuario. Verifique que todos los campos esten completos."
          title="Error al agregar Usuario"
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
                <v-col style="display: flex; align-items: center; flex-direction: column;">
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

                <v-col style="display: flex; align-items: center; flex-direction: column;">
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
export default {
  data() {
    return {
      search: "",
      headers: [
        {
          align: "start",
          key: "ruc",
          sortable: false,
          title: "RUC",
        },
        { key: "razonSocial", title: "Razón social" },
        { key: "direccion", title: "Dirección" },
        { key: "telefono", title: "Teléfono" },
        { key: "lugarProcedencia", title: "Lugar procedencia" },
        { key: "actions", title: "Acciones", sortable: false },
      ],
      headersTablaModal: [
        {
          align: "start",
          key: "ruc",
          sortable: false,
          title: "RUC",
        },
        { key: "razonSocial", title: "Razón social" },
        { key: "direccion", title: "Dirección" },
        { key: "telefono", title: "Teléfono" },
        { key: "lugarProcedencia", title: "Lugar procedencia" },
      ],
      proveedores: [],
      dialogAgregar: false,
      dialogExportarUsuarios: false,
      dialogAgregarConfirmacion: false,
      nuevoProveedor: {
        razonSocial: "",
        ruc: "",
        lugarProcedencia: "",
        direccion: "",
        telefono: "",
      },
      proveedorSeleccionado: {
        _id: "",
        razonSocial: "",
        ruc: "",
        lugarProcedencia: "",
        direccion: "",
        telefono: "",
      },
      modoModal: "",
    };
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get("http://localhost:3000/api/provider");
        console.log("Data:", response.data);
        this.proveedores = response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async agregarProveedor() {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/provider/register",
          this.nuevoProveedor
        );
        console.log("Proveedor agregado:", response.data);
        // Actualiza la lista de proveedores
        this.proveedores.push(response.data);
        // Actualiza la lista de proveedores
        await this.fetchData();
        // Limpia los campos del formulario después de agregar
        // this.headers.push({ key: 'actions', title: 'Acciones', sortable: false})
        this.nuevoProveedor = {
          razonSocial: "",
          ruc: "",
          lugarProcedencia: "",
          direccion: "",
          telefono: "",
        };
        // Cierra el diálogo
        this.modoModal = "";
        this.dialogAgregar = false;
      } catch (error) {
        this.modoModal = "Agregar";
        this.dialogAgregarConfirmacion = true;
        console.error("Error al agregar proveedor:", error);
      }
    },
    async detalleProveedor(i) {
      const response = await axios.get(
        "http://localhost:3000/api/provider/" + i._id
      );
      console.log("Proveedor:", response.data);
      this.proveedorSeleccionado = response.data;
    },
    async modificarProveedor(i) {
      try {
        const response = await axios.put(
          "http://localhost:3000/api/provider/" + i._id,
          this.proveedorSeleccionado
        );
        console.log("Proveedor modificado:", response.data);
        await this.fetchData();
        this.modoModal = "";
        this.dialogAgregar = false;
      } catch (error) {
        this.modoModal = "Modificar";
        this.dialogAgregarConfirmacion = true;
        console.error("Error al agregar proveedor:", error);
      }
    },
    async exportToExcel() {
      axios
        .get("http://localhost:3000/api/provider/export-excel", {
          responseType: "blob",
        }) // Indicar que esperamos una respuesta de tipo blob
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data])); // Crear una URL para el blob
          const link = document.createElement("a"); // Crear un enlace
          link.href = url;
          link.setAttribute("download", "proveedores.xlsx"); // Establecer el nombre del archivo
          document.body.appendChild(link); // Agregar el enlace al DOM
          link.click(); // Simular clic en el enlace para iniciar la descarga
          window.URL.revokeObjectURL(url); // Liberar la URL del objeto
        })
        .catch((error) => {
          console.error("Error al exportar a Excel:", error);
        });
    },
    async exportToPDF() {
      axios
        .get("http://localhost:3000/api/provider/export-pdf", {
          responseType: "blob",
        })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "proveedores.pdf");
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          console.error("Error al exportar a PDF:", error);
        });
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style>
.container-tabla-proveedores {
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
</style>