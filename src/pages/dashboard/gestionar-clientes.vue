<template>
    <div class="container-tabla-proveedores">
        <v-card flat>
            <template v-slot:text>
                <div class="container-header-table">
                    <!-- Cuadro de busqueda para buscar un proveedor -->
                    <v-text-field v-model="search" label="Buscar" prepend-inner-icon="mdi-magnify" variant="outlined"
                        hide-details></v-text-field>
                    <v-btn color="green-darken-2" @click="dialogExportarUsuarios = true">
                        Exportar
                    </v-btn>
                    <v-btn color="blue-darken-2" @click="() => {
                        dialogAgregar = true;
                        modoModal = 'Agregar';
                    }
                        ">
                        Agregar
                    </v-btn>
                </div>
            </template>
            <!-- Tabla de datos principal para mostrar todos los clientes -->
            <v-data-table :headers="headers" :items="clientes" :search="search">
                <template v-slot:item.actions="{ item }">
                    <v-icon class="me-2" size="small" @click="() => {
                        console.log(item)
                        detalleCliente(item);
                        modoModal = 'Detalle';
                        dialogAgregar = true;
                    }
                        ">
                        mdi-menu
                    </v-icon>
                    <v-icon class="me-2" size="small" @click="() => {
                        detalleCliente(item);
                        modoModal = 'Modificar';
                        dialogAgregar = true;
                    }
                        ">
                        mdi-pencil
                    </v-icon>
                    <v-icon size="small" @click="deshabilitarCliente(item)">
                        mdi-cancel
                    </v-icon>
                </template>
            </v-data-table>
        </v-card>
        <div class="pa-4 text-center">
            <!-- Dialog para Agregar, Detalles y Editar -->
            <v-dialog v-model="dialogAgregar" max-width="1000" persistent transition="dialog-top-transition">
                <v-card :title="modoModal === 'Detalle'
                    ? 'Detalle de Cliente'
                    : modoModal === 'Modificar'
                        ? 'Modificar Cliente'
                        : 'Agregar Cliente'
                    " style="text-align: center">
                    <v-card-text>
                        <!-- Inputs de Agregar Proveedor -->
                        <v-row dense v-if="modoModal === 'Agregar'">
                            <v-col cols="12" md="4" sm="6">
                                <v-text-field label="Nombres" v-model="nuevoCliente.nombres" required></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4" sm="6">
                                <v-text-field label="Apellidos" v-model="nuevoCliente.apellidos" required></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4" sm="6">
                                <v-text-field label="RUC" v-model="nuevoCliente.ruc" required></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4" sm="6">
                                <v-text-field label="Dirección" v-model="nuevoCliente.direccion" required></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4" sm="6">
                                <v-text-field label="Teléfono" v-model="nuevoCliente.telefono" required></v-text-field>
                            </v-col>
                        </v-row>
                        <!-- Inputs de Detalle Proveedor -->
                        <v-row dense v-if="modoModal === 'Detalle'">
                            <v-col cols="12" md="4" sm="6">
                                <v-text-field label="Codigo de cliente" v-model="clienteSeleccionado.codigoCliente" required
                                    readonly></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4" sm="6">
                                <v-text-field label="Nombres" v-model="clienteSeleccionado.nombres" required
                                    readonly></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4" sm="6">
                                <v-text-field label="Apellidos" v-model="clienteSeleccionado.apellidos" required
                                    readonly></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4" sm="6">
                                <v-text-field label="RUC" v-model="clienteSeleccionado.ruc" required
                                    readonly></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4" sm="6">
                                <v-text-field label="Dirección" v-model="clienteSeleccionado.direccion" required
                                    readonly></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4" sm="6">
                                <v-text-field label="Teléfono" v-model="clienteSeleccionado.telefono" required
                                    readonly></v-text-field>
                            </v-col>
                        </v-row>
                        <!-- Inputs de Modificar Proveedor -->
                        <v-row dense v-if="modoModal === 'Modificar'">
                            <v-col cols="12" md="4" sm="6">
                                <v-text-field label="Nombres" v-model="clienteSeleccionado.nombres" required></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4" sm="6">
                                <v-text-field label="Apellidos" v-model="clienteSeleccionado.apellidos"
                                    required></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4" sm="6">
                                <v-text-field label="RUC" v-model="clienteSeleccionado.ruc" required></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4" sm="6">
                                <v-text-field label="Dirección" v-model="clienteSeleccionado.direccion"
                                    required></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4" sm="6">
                                <v-text-field label="Teléfono" v-model="clienteSeleccionado.telefono"
                                    required></v-text-field>
                            </v-col>
                        </v-row>
                        <!-- Tabla de datos de todos los clientes -->
                        <v-data-table :headers="headersTablaModal" :items="clientes" :search="search"></v-data-table>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions v-if="modoModal === 'Agregar'">
                        <v-spacer></v-spacer>

                        <v-btn color="success" text="Agregar" variant="tonal" @click="agregarCliente"></v-btn>

                        <v-btn color="red" text="Cancelar" variant="tonal" @click="() => {
                            dialogAgregar = false;
                            this.modoModal = '';
                        }
                            "></v-btn>
                    </v-card-actions>
                    <v-card-actions v-if="modoModal === 'Detalle'">
                        <v-spacer></v-spacer>
                        <v-btn color="red" text="Salir" variant="tonal" @click="() => {
                            dialogAgregar = false;
                            this.modoModal = '';
                        }
                            "></v-btn>
                    </v-card-actions>
                    <v-card-actions v-if="modoModal === 'Modificar'">
                        <v-spacer></v-spacer>
                        <v-btn color="success" text="Modificar" variant="tonal"
                            @click="modificarCliente(clienteSeleccionado)"></v-btn>

                        <v-btn color="red" text="Cancelar" variant="tonal" @click="() => {
                            dialogAgregar = false;
                            this.modoModal = '';
                        }
                            "></v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialogAgregarConfirmacion" width="auto">
                <v-card max-width="400" prepend-icon="mdi-google-downasaur"
                    text="Ha ocurrido un error al agregar usuario. Verifique que todos los campos esten completos."
                    title="Error al agregar Usuario">
                    <template v-slot:actions>
                        <v-btn class="ms-auto" text="Ok" @click="dialogAgregarConfirmacion = false"></v-btn>
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
                                    <v-img :aspect-ratio="1" class="bg-white" src="/src/assets/Gestionar Usuarios/pdf.png"
                                        style="height: 100px; width: 100px"></v-img>
                                    <v-btn class="my-2" text="Exportar en PDF" @click="exportToPDF()"></v-btn>
                                </v-col>

                                <v-col style="display: flex; align-items: center; flex-direction: column;">
                                    <v-img :aspect-ratio="1" class="bg-white" src="/src/assets/Gestionar Usuarios/excel.png"
                                        style="height: 100px; width: 100px"></v-img>
                                    <v-btn class="my-2" text="Exportar en EXCEL" @click="exportToExcel()"></v-btn>
                                </v-col>
                            </v-row>
                        </div>
                    </template>
                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn text="Cerrar" variant="tonal" color="red" @click="dialogExportarUsuarios = false"></v-btn>
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
                    key: "codigoCliente",
                    sortable: false,
                    title: "Codigo de cliente",
                },
                { key: "nombres", title: "Nombres" },
                { key: "apellidos", title: "Apellidos" },
                { key: "ruc", title: "RUC" },
                { key: "telefono", title: "Telefono" },
                { key: "direccion", title: "Direccion" },
                { key: "actions", title: "Acciones", sortable: false },
            ],
            headersTablaModal: [
                {
                    align: "start",
                    key: "codigoCliente",
                    sortable: false,
                    title: "Codigo de cliente",
                },
                { key: "nombres", title: "Nombres" },
                { key: "apellidos", title: "Apellidos" },
                { key: "ruc", title: "RUC" },
                { key: "telefono", title: "Telefono" },
                { key: "direccion", title: "Direccion" },
            ],
            clientes: [],
            dialogAgregar: false,
            dialogExportarUsuarios: false,
            dialogAgregarConfirmacion: false,
            nuevoCliente: {
                nombres: "",
                apellidos: "",
                ruc: "",
                direccion: "",
                telefono: "",
            },
            proveedorSeleccionado: {
                codigoCliente: "",
                nombres: "",
                apellidos: "",
                ruc: "",
                direccion: "",
                telefono: "",
            },
            modoModal: "",
        };
    },
    methods: {
        async fetchData() {
            try {
                const response = await axios.get("http://localhost:3000/api/clientes");
                console.log("Data:", response.data);
                this.clientes = response.data;
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        },
        async agregarCliente() {
            try {
                const response = await axios.post(
                    "http://localhost:3000/api/clientes/register",
                    this.nuevoCliente
                );
                console.log("Cliente agregado:", response.data);
                // Actualiza la lista de clientes
                this.clientes.push(response.data);
                // Actualiza la lista de clientes
                await this.fetchData();
                // Limpia los campos del formulario después de agregar
                // this.headers.push({ key: 'actions', title: 'Acciones', sortable: false})
                this.nuevoCliente = {
                    nombres: "",
                    apellidos: "",
                    ruc: "",
                    direccion: "",
                    telefono: "",
                };
                // Cierra el diálogo
                this.modoModal = "";
                this.dialogAgregar = false;
            } catch (error) {
                this.modoModal = "Agregar";
                this.dialogAgregarConfirmacion = true;
                console.error("Error al agregar el cliente:", error);
            }
        },
        async detalleCliente(i) {
            const response = await axios.get(
                "http://localhost:3000/api/clientes/" + i._id
            );
            console.log("Cliente:", response.data);
            this.clienteSeleccionado = response.data;
        },
        async modificarCliente(i) {
            try {
                const response = await axios.put(
                    "http://localhost:3000/api/clientes/" + i._id,
                    this.clienteSeleccionado
                );
                console.log("Cliente modificado:", response.data);
                await this.fetchData();
                this.modoModal = "";
                this.dialogAgregar = false;
            } catch (error) {
                this.modoModal = "Modificar";
                this.dialogAgregarConfirmacion = true;
                console.error("Error al agregar cliente:", error);
            }
        },
        async exportToExcel() {
            axios
                .get("http://localhost:3000/api/clientes/export-excel", {
                    responseType: "blob",
                }) // Indicar que esperamos una respuesta de tipo blob
                .then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data])); // Crear una URL para el blob
                    const link = document.createElement("a"); // Crear un enlace
                    link.href = url;
                    link.setAttribute("download", "clientes.xlsx"); // Establecer el nombre del archivo
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
                .get("http://localhost:3000/api/clientes/export-pdf", {
                    responseType: "blob",
                })
                .then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "clientes.pdf");
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