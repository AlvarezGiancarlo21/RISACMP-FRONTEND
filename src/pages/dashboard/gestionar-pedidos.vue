<template>
  <v-card>
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
            <v-btn prepend-icon="mdi-plus" color="blue darken-2" @click="nuevoPedidoDialog = true">
              Registrar Pedido
            </v-btn>
          </div>
        </template>
        <v-data-table :headers="headers" :items="pedidos" :search="search">
          <template v-slot:item.actions="{ item }">
            <v-icon @click="abrirDialogoEditarPedido(item)" class="mr-2">mdi-pencil</v-icon>
            <v-icon @click="verDetallePedido(item)" class="mr-2">mdi-eye</v-icon>
          </template>
        </v-data-table>
      </v-card>

      <!-- Diálogo para nuevo pedido -->
      <v-dialog v-model="nuevoPedidoDialog" max-width="800px">
        <v-card>
          <v-card-title>Nuevo Pedido</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field v-model="nuevoPedido.codigoPedido" label="Código de Pedido"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="nuevoPedido.nombreCliente" label="Nombre del Cliente"></v-text-field>
              </v-col>
              <v-col>
                <v-select clearable v-model="nuevoPedido.estadoPedido" label="Estado del pedido" :items="['Pendiente', 'En proceso', 'Terminado']"></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn @click="addProducto" color="blue darken-2">Añadir Producto</v-btn>
              </v-col>
            </v-row>
            <v-row v-for="(producto, index) in nuevoPedido.productos" :key="index">
              <v-col>
                <v-text-field v-model="producto.producto_id" label="ID del Producto"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="producto.cantidad" label="Cantidad"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="producto.unidad_medida_id" label="Unidad de Medida"></v-text-field>
              </v-col>
              <v-col>
                <v-btn icon="mdi-delete" color="red darken-2" @click="removeProducto(index)"></v-btn>
              </v-col>
            </v-row>
            <v-textarea v-model="nuevoPedido.observacion" label="Observación"></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-2" text @click="crearPedido">Guardar</v-btn>
            <v-btn color="red darken-2" text @click="cancelarNuevoPedido">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Diálogo para editar pedido -->
      <v-dialog v-model="editarPedidoDialog" max-width="700px">
        <v-card>
          <v-card-title>Editar Pedido</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field v-model="pedidoSeleccionado.codigoPedido" label="Código de Pedido"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="pedidoSeleccionado.nombreCliente" label="Nombre del Cliente"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-select clearable v-model="pedidoSeleccionado.estadoPedido" label="Estado del pedido" :items="['Pendiente', 'En proceso', 'Terminado']"></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn @click="addProductoEdicion" color="blue darken-2">Añadir Producto</v-btn>
              </v-col>
            </v-row>
            <v-row v-for="(producto, index) in pedidoSeleccionado.productos" :key="index">
              <v-col>
                <v-text-field v-model="producto.producto_id" label="ID del Producto"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="producto.cantidad" label="Cantidad"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="producto.unidad_medida_id" label="Unidad de Medida"></v-text-field>
              </v-col>
              <v-col>
                <v-btn icon="mdi-delete" color="red darken-2" @click="removeProductoEdicion(index)"></v-btn>
              </v-col>
            </v-row>
            <v-textarea v-model="pedidoSeleccionado.observacion" label="Observación"></v-textarea>
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
                  <v-list-item-title>Observación:</v-list-item-title>
                  <v-list-item-subtitle>{{ detallePedido.observacion }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-2" text @click="cerrarVerPedido">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-card>
</template>

<script>
import axios from "axios";
import { defineComponent } from 'vue';

export default defineComponent({
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
        productos: [],
        observacion: "",
      },
      pedidoSeleccionado: {
        codigoPedido: "",
        nombreCliente: "",
        estadoPedido: "",
        codigoProducto: "",
        productos: [],
        observacion: "",
      },
      detallePedido: null,
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
        console.log("Creating Pedido:", this.nuevoPedido);
        await axios.post("http://localhost:3000/api/pedidos/register", this.nuevoPedido);
        this.nuevoPedidoDialog = false;
        this.fetchPedidos();
        this.nuevoPedido = {
          codigoPedido: "",
          nombreCliente: "",
          estadoPedido: "",
          codigoProducto: "",
          productos: [],
          observacion: "",
        };
      } catch (error) {
        console.error("Error creating pedido:", error);
      }
    },
    async abrirDialogoEditarPedido(pedido) {
      this.pedidoSeleccionado = { ...pedido };
      this.editarPedidoDialog = true;
      console.log("Editing Pedido:", this.pedidoSeleccionado);
    },
    async verDetallePedido(pedido) {
      try {
        const response = await axios.get(`http://localhost:3000/api/pedidos/${pedido._id}`);
        this.detallePedido = response.data;
        this.detallePedidoDialog = true;
        console.log("Pedido Detail:", this.detallePedido);
      } catch (error) {
        console.error("Error fetching pedido detail:", error);
      }
    },
    async actualizarPedido() {
      try {
        console.log("Updating Pedido:", this.pedidoSeleccionado);
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
        const blob = new Blob([response.data], { type: response.headers["content-type"] });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "pedidos.xlsx");
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error("Error exporting pedidos to Excel:", error);
      }
    },
    async exportarPedidosPDF() {
      try {
        const response = await axios.get("http://localhost:3000/api/pedidos/export-pdf", { responseType: "blob" });
        const blob = new Blob([response.data], { type: response.headers["content-type"] });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "pedidos.pdf");
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error("Error exporting pedidos to PDF:", error);
      }
    },
    cancelarNuevoPedido() {
      this.nuevoPedido = {
        codigoPedido: "",
        nombreCliente: "",
        estadoPedido: "",
        codigoProducto: "",
        productos: [],
        observacion: "",
      };
      this.nuevoPedidoDialog = false;
    },
    cancelarEditarPedido() {
      this.editarPedidoDialog = false;
    },
    cerrarVerPedido() {
      this.detallePedidoDialog = false;
    },
    addProducto() {
      this.nuevoPedido.productos.push({ producto_id: "", cantidad: "", unidad_medida_id: "" });
      console.log("Added product to new order:", this.nuevoPedido.productos);
    },
    removeProducto(index) {
      this.nuevoPedido.productos.splice(index, 1);
      console.log("Removed product from new order:", this.nuevoPedido.productos);
    },
    addProductoEdicion() {
      if (!this.pedidoSeleccionado.productos) {
        this.pedidoSeleccionado.productos = [];
      }
      this.pedidoSeleccionado.productos.push({ producto_id: "", cantidad: "", unidad_medida_id: "" });
      console.log("Added product to existing order:", this.pedidoSeleccionado.productos);
    },
    removeProductoEdicion(index) {
      this.pedidoSeleccionado.productos.splice(index, 1);
      console.log("Removed product from existing order:", this.pedidoSeleccionado.productos);
    }
  },
  mounted() {
    this.fetchPedidos();
  },
});
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
