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
          <v-btn color="green darken-2" @click="dialogExportarPedidos = true">
            Exportar
          </v-btn>
          <v-btn color="blue darken-2" @click="nuevoPedidoDialog = true">
            Nuevo Pedido
          </v-btn>
        </div>
      </template>
      <v-data-table :headers="headers" :items="pedidos" :search="search">
        <template v-slot:item.actions="{ item }">
          <v-icon @click="editarPedido(item)" class="mr-2">mdi-pencil</v-icon>
          <v-icon @click="eliminarPedido(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>
    <!-- Diálogo para nuevo pedido -->
    <v-dialog v-model="nuevoPedidoDialog" max-width="500px">
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
    </v-dialog>
    <!-- Diálogo para exportar pedidos -->
    <v-dialog v-model="dialogExportarPedidos" max-width="500px">
      <v-card>
        <v-card-title>Exportar Pedidos</v-card-title>
        <v-card-text>
          <v-btn color="blue darken-2" text @click="exportarPedidosExcel">Exportar a Excel</v-btn>
          <v-btn color="blue darken-2" text @click="exportarPedidosPDF">Exportar a PDF</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red darken-2" text @click="dialogExportarPedidos = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Otros diálogos -->
  </div>
</template>

<script>
import axios from "axios";

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
      dialogExportarPedidos: false,
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
    async editarPedido() {
      try {
        await axios.put(`http://localhost:3000/api/pedidos/${this.pedidoSeleccionado.id}`, this.pedidoSeleccionado);
        // Lógica adicional si es necesaria
      } catch (error) {
        console.error("Error updating pedido:", error);
      }
    },
    async eliminarPedido(pedido) {
      try {
        await axios.delete(`http://localhost:3000/api/pedidos/${pedido.id}`);
        this.fetchPedidos();
      } catch (error) {
        console.error("Error deleting pedido:", error);
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
