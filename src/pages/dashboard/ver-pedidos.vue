<template>
    <div class="container-tabla-pedidos">
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
            <v-btn icon="mdi-export" color="green darken-2" @click="dialogExportarPedidos = true"></v-btn>
            <!-- <v-btn  prepend-icon="mdi-plus" color="blue darken-2" @click="nuevoPedidoDialog = true">
              Registrar Pedido
            </v-btn> -->
          </div> 
        </template>
        <v-data-table :headers="headers" :items="pedidos" :search="search">
          <template v-slot:item.actions="{ item }">
            <!-- <v-icon @click="abrirDialogoEditarPedido(item)" class="mr-2">mdi-pencil</v-icon> -->
            <v-icon  @click="verDetallePedido(item)" class="mr-2">mdi-eye</v-icon>
          </template>
        </v-data-table>
      </v-card>
      <!-- Diálogo para nuevo pedido -->
      <!-- <v-dialog v-model="nuevoPedidoDialog" max-width="500px">
        <v-card>
          <v-card-title>Nuevo Pedido</v-card-title>
          <v-card-text>
            <v-text-field v-model="nuevoPedido.codigoPedido" label="Código de Pedido"></v-text-field>
            <v-text-field v-model="nuevoPedido.nombreCliente" label="Nombre del Cliente"></v-text-field>
            <v-text-field v-model="nuevoPedido.estadoPedido" label="Estado del Pedido"></v-text-field>
            <v-text-field v-model="nuevoPedido.codigoProducto" label="Código del Producto"></v-text-field>
            <v-text-field v-model="nuevoPedido.cantidad.kilos" label="Cantidad en Kilos"></v-text-field>
            <v-text-field v-model="nuevoPedido.cantidad.unidades" label="Cantidad en Unidades"></v-text-field>
            <v-text-field v-model="nuevoPedido.observacion" label="Observación"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-2" text @click="crearPedido">Guardar</v-btn>
            <v-btn color="red darken-2" text @click="cancelarNuevoPedido">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog> -->
      <!-- Diálogo para editar pedido -->
      <v-dialog v-model="editarPedidoDialog" max-width="500px">
        <v-card>
          <v-card-title>Editar Pedido</v-card-title>
          <v-card-text>
            <v-text-field v-model="pedidoSeleccionado.codigoPedido" label="Código de Pedido"></v-text-field>
            <v-text-field v-model="pedidoSeleccionado.nombreCliente" label="Nombre del Cliente"></v-text-field>
            <v-text-field v-model="pedidoSeleccionado.estadoPedido" label="Estado del Pedido"></v-text-field>
            <v-text-field v-model="pedidoSeleccionado.codigoProducto" label="Código del Producto"></v-text-field>
            <v-text-field v-model="pedidoSeleccionado.cantidad.kilos" label="Cantidad en Kilos"></v-text-field>
            <v-text-field v-model="pedidoSeleccionado.cantidad.unidades" label="Cantidad en Unidades"></v-text-field>
            <v-text-field v-model="pedidoSeleccionado.observacion" label="Observación"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-2" text @click="actualizarPedido">Guardar</v-btn>
            <v-btn color="red darken-2" text @click="cancelarEditarPedido">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Diálogo para exportar pedidos -->
      <v-dialog v-model="dialogExportarPedidos" max-width="500px">
        <v-card>
          <v-card-title>Exportar Pedidos</v-card-title>
          <v-card-text>
            <v-radio-group v-model="exportFormat">
              <v-radio value="excel" label="Exportar a Excel"></v-radio>
              <v-radio value="pdf" label="Exportar a PDF"></v-radio>
            </v-radio-group>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-2" text @click="exportarPedidos">Exportar</v-btn>
            <v-btn color="red darken-2" text @click="dialogExportarPedidos = false">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Otros diálogos -->
           <!-- Diálogo para ver detalle del pedido -->
      <v-dialog v-model="detallePedidoDialog" max-width="500px">
        <v-card>
          <v-card-title>Detalle del Pedido</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Código de Pedido:</v-list-item-title>
                  <v-list-item-subtitle>{{ detallePedido.codigoPedido }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Nombre del Cliente:</v-list-item-title>
                  <v-list-item-subtitle>{{ detallePedido.nombreCliente }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Estado del Pedido:</v-list-item-title>
                  <v-list-item-subtitle>{{ detallePedido.estadoPedido }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Código del Producto:</v-list-item-title>
                  <v-list-item-subtitle>{{ detallePedido.codigoProducto }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Cantidad:</v-list-item-title>
                  <v-list-item-subtitle>Peso en Kilos : {{ detallePedido.cantidad.kilos }} kg</v-list-item-subtitle>
                  <v-list-item-subtitle>Unidades : {{ detallePedido.cantidad.unidades }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Observacion:</v-list-item-title>
                  <v-list-item-subtitle>{{ detallePedido.observacion }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <!-- Agregar más detalles del pedido aquí según sea necesario -->
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn color="red darken-2" text @click="cerrarVerPedido">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  import { ref } from 'vue';
  import { useUserStore } from '@/stores/User';
  import { computed } from 'vue';
  import { onMounted } from 'vue';
  import jwt_decode from 'jwt-decode'; // Importa la librería para decodificar el token JWT
  const userStore = useUserStore();
  const role = computed(() => userStore.user.role);
  const nombres=computed(()=> userStore.user.nombres);
  const apellidos=computed(()=>userStore.user.apellidos);
  import { useRouter } from 'vue-router';
  // import AppFooter from '@/components/AppFooter.vue';
  
  const router = useRouter();
  // Recuperar la información de sesión del usuario cuando el componente se monta
  onMounted(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decodificar el token para obtener la información del usuario
      const decodedToken = jwt_decode(token);
      const role = decodedToken.user.role;
      const username = decodedToken.user.username;
      const nombres =decodedToken.user.nombres;
      const apellidos=decodedToken.user.apellidos;
      // Establecer la información del usuario en el store
      userStore.setUserRole(role, username,nombres,apellidos);
    }
  });
  
  export default {
    data() {
      return {
        search: "",
        headers: [
          { title: "Codigo de pedido", value: "codigoPedido" },
          { title: "Cliente", value: "nombreCliente" },
          { title: "Estado de pedido", value: "estadoPedido" },
          { title: "Codigo de producto", value: "codigoProducto" },
          { title: "Acciones", value: "actions", sortable: false },
        ],
        pedidos: [],
        nuevoPedidoDialog: false,
        editarPedidoDialog: false,
        dialogExportarPedidos: false,
        exportFormat: "excel",
        detallePedidoDialog: false,
        nuevoPedido: {
          codigoPedido: "",
          nombreCliente: "",
          estadoPedido: "",
          codigoProducto: "",
          cantidad: {
            kilos: null,
            unidades: null,
          },
          observacion: "",
        },
        pedidoSeleccionado: null,
      };
    },
    methods: {
      async fetchPedidos() {
        try {
          const response = await axios.get("http://localhost:3000/api/pedidos");
          this.pedidos = response.data;
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      },
  
      async crearPedido() {
        try {
          await axios.post("http://localhost:3000/api/pedidos/register", this.nuevoPedido);
          this.nuevoPedidoDialog = false;
          this.fetchPedidos();
          // Limpiar los datos del nuevo pedido
          this.nuevoPedido = {
            codigoPedido: "",
            nombreCliente: "",
            estadoPedido: "",
            codigoProducto: "",
            cantidad: {
              kilos: null,
              unidades: null,
            },
            observacion: "",
          };
        } catch (error) {
          console.error("Error creating pedido:", error);
        }
      },
      async abrirDialogoEditarPedido(pedido) {
        this.pedidoSeleccionado = { ...pedido };
        this.editarPedidoDialog = true;
      },
      async verDetallePedido(pedido) {
        try {
          const response = await axios.get(`http://localhost:3000/api/pedidos/${pedido._id}`);
          this.detallePedido = response.data;
          this.detallePedidoDialog = true;
        } catch (error) {
          console.error("Error fetching pedido detail:", error);
        }
      },
      async actualizarPedido() {
        try {
          await axios.put(`http://localhost:3000/api/pedidos/${this.pedidoSeleccionado._id}`, this.pedidoSeleccionado);
          this.editarPedidoDialog = false;
          this.fetchPedidos();
        } catch (error) {
          console.error("Error updating pedido:", error);
        }
      },
      async eliminarPedido(pedido) {
        try {
          await axios.delete(`http://localhost:3000/api/pedidos/${pedido._id}`);
          this.fetchPedidos();
        } catch (error) {
          console.error("Error deleting pedido:", error);
        }
      },
      async exportarPedidos() {
        if (this.exportFormat === "excel") {
          this.exportarPedidosExcel();
        } else if (this.exportFormat === "pdf") {
          this.exportarPedidosPDF();
        }
      },
      async exportarPedidosExcel() {
        try {
          const response = await axios.get("http://localhost:3000/api/pedidos/export-excel", { responseType: "blob" });
  
          // Creamos un nuevo Blob con el contenido de la respuesta
          const blob = new Blob([response.data], { type: response.headers["content-type"] });
  
          // Creamos una URL para el Blob
          const url = window.URL.createObjectURL(blob);
  
          // Creamos un enlace temporal para descargar el archivo
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "pedidos.xlsx");
  
          // Añadimos el enlace al documento y lo hacemos click
          document.body.appendChild(link);
          link.click();
        } catch (error) {
          console.error("Error exporting pedidos to Excel:", error);
        }
      },
      async exportarPedidosPDF() {
        try {
          const response = await axios.get("http://localhost:3000/api/pedidos/export-pdf", { responseType: "blob" });
  
          // Creamos un nuevo Blob con el contenido de la respuesta
          const blob = new Blob([response.data], { type: response.headers["content-type"] });
  
          // Creamos una URL para el Blob
          const url = window.URL.createObjectURL(blob);
  
          // Creamos un enlace temporal para descargar el archivo
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "pedidos.pdf");
  
          // Añadimos el enlace al documento y lo hacemos click
          document.body.appendChild(link);
          link.click();
        } catch (error) {
          console.error("Error exporting pedidos to PDF:", error);
        }
      },
      cancelarNuevoPedido() {
        // Limpiar los datos del nuevo pedido al cancelar
        this.nuevoPedido = {
          codigoPedido: "",
          nombreCliente: "",
          estadoPedido: "",
          codigoProducto: "",
          cantidad: {
            kilos: null,
            unidades: null,
          },
          observacion: "",
        };
        this.nuevoPedidoDialog = false;
      },
      cancelarEditarPedido() {
        this.editarPedidoDialog = false;
      },
      cerrarVerPedido(){
        this.detallePedidoDialog=false;
      }
    },
    mounted() {
      this.fetchPedidos();
    },
  };
  </script>
  
  <style>
  .container-tabla-pedidos {
    width: 100%;
    padding: 20px;
  }
  
  .container-header-table {
    display: flex;
    align-items: center;
    gap: 30px;
  }
  </style>
  