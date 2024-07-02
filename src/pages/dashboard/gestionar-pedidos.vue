<template>
  <v-card>
    <div class="container-tabla-pedidos">
      <v-card flat>
        <template v-slot:text>
          <div class="container-header-table">
            <v-text-field v-model="search" label="Buscar" prepend-inner-icon="mdi-magnify" variant="outlined"
              hide-details></v-text-field>
              <v-divider :thickness="40" class="border-opacity-0" vertical></v-divider>
            <v-btn icon color="green darken-2" @click="dialogExportarPedidos = true">
              <v-icon>mdi-export</v-icon>
            </v-btn>
            <v-divider :thickness="40" class="border-opacity-0" vertical></v-divider>
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
                <v-text-field v-model="nuevoPedido.codigoPedido" label="Código de Pedido" disabled></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="nuevoPedido.nombreCliente" label="Nombre del Cliente"></v-text-field>
              </v-col>
              <v-col>
                <v-select v-model="nuevoPedido.estadoPedido" label="Estado del pedido"
                  :items="['Pendiente', 'En proceso', 'Terminado']"></v-select>
              </v-col>
            </v-row>
            <v-divider :thickness="12" class="border-opacity-0"></v-divider>
            <v-card>
              <v-divider :thickness="12" class="border-opacity-0"></v-divider>
              <v-row>
                <v-col>
                  <v-btn @click="addProducto" color="blue darken-2">Añadir Producto</v-btn>
                </v-col>
              </v-row>
              <v-divider :thickness="12" class="border-opacity-0"></v-divider>
              <v-row v-for="(producto, index) in nuevoPedido.productos" :key="index">
                <v-col cols="12" md="4" sm="6">
                  <v-select v-model="producto.producto_id" :items="productos" item-title="nombre" item-value="id"
                    label="Productos con receta" required></v-select>
                </v-col>
                <v-col>
                  <v-text-field v-model="producto.cantidad" label="Cantidad"></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-select v-model="producto.unidad_medida_id" :items="unidadesDeMedida" item-title="nombre"
                    item-value="id" label="Unidad de Medida" required></v-select>
                </v-col>
                <v-col>
                  <v-btn icon @click="removeProducto(index)" color="red darken-2"><v-icon>mdi-delete</v-icon></v-btn>
                </v-col>
              </v-row>
            </v-card>
            <v-divider :thickness="12" class="border-opacity-0"></v-divider>
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
                <v-select v-model="pedidoSeleccionado.estadoPedido" label="Estado del pedido"
                  :items="['Pendiente', 'En proceso', 'Terminado']"></v-select>
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
                <v-btn icon @click="removeProductoEdicion(index)"
                  color="red darken-2"><v-icon>mdi-delete</v-icon></v-btn>
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
import * as serviciosUnidad from '../../services/unidadMedidaService';
import * as serviciosProducto from '../../services/s_productos';
import * as serviciosPedido from '../../services/s_pedidos';
export default {
  data() {
    return {
      search: "",
      pedidos: [],
      headers: [
        { title: "Código de Pedido", value: "codigoPedido" },
        { title: "Nombre del Cliente", value: "nombreCliente" },
        { title: "Estado del Pedido", value: "estadoPedido" },
        { title: "Observacion", value: "observacion" },
        { title: "Acciones", value: "actions", sortable: false },
      ],
      nuevoPedidoDialog: false,
      editarPedidoDialog: false,
      dialogExportarPedidos: false,
      detallePedidoDialog: false,
      exportFormat: "",
      contadorPedidos: null, // Inicializar contador de pedidos como null para detectar si se ha cargado
      nuevoPedido: {
        codigoPedido: null, // Inicializamos como null para generarlo automáticamente
        nombreCliente: "",
        estadoPedido: "",
        productos: [],
        observacion: "",
      },
      pedidoSeleccionado: {
        id: "",
        codigoPedido: "",
        nombreCliente: "",
        estadoPedido: "",
        productos: [],
        observacion: "",
      },
      detallePedido: {
        codigoPedido: "",
        nombreCliente: "",
        estadoPedido: "",
        codigoProducto: "",
        cantidad: {
          kilos: "",
          unidades: "",
        },
        observacion: "",
      },
      unidadesDeMedida: [{}],
      productos: [{}],
    };
  },
  methods: {
    async obtenerPedidos() {
      try {
        const response = await axios.get("http://localhost:3000/api/pedidos");
        this.pedidos = response.data;
        // Actualizar el contador de pedidos basado en el número total de pedidos
        this.contadorPedidos = this.pedidos.length + 1;
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
      }
    },
    async obtenerUnidades() {
      try {
        const unidades = await serviciosUnidad.obtenerUnidadesDeMedida();
        let i = 0;

        this.unidadesDeMedida = unidades.map(unidad => ({
          id: unidad._id,
          nombre: unidad.nombre
        }));
      } catch (error) {
        this.errorMessage = error.message;
        this.isAlertVisible = true;
      }

    },
    async obtenerProductos() {
      try {
        const productos = await serviciosProducto.obtenerProductos();
        const productosConReceta = productos.filter(producto => producto.hasReceta);
        this.productos = productosConReceta.map(producto => ({
          id: producto.id,
          nombre: producto.nombre
        }));
      } catch (error) {
        this.errorMessage = error.message;
        this.isAlertVisible = true;
      }

    },
    async crearPedido() {
      try {
        // Generar código de pedido como PEDIDO-NUMERO
        this.nuevoPedido.codigoPedido = `PEDIDO-${this.contadorPedidos}`;
        const datos = {
          codigoPedido: this.nuevoPedido.codigoPedido,
          nombreCliente: this.nuevoPedido.nombreCliente,
          estadoPedido: this.nuevoPedido.estadoPedido,
          observacion: this.nuevoPedido.observacion,
          productos: this.nuevoPedido.productos,
        }
        console.log(datos);
        const response = await serviciosPedido.registrarPedido(datos);

        alert(response.msg);
        this.nuevoPedidoDialog = false;
        this.obtenerPedidos(); // Actualizar la lista de pedidos después de crear uno nuevo
        this.limpiarFormularioNuevoPedido();
      } catch (error) {
        console.error("Error al crear el pedido:", error);
      }
    },
    async actualizarPedido() {
      try {
        await axios.put(`http://localhost:3000/api/pedidos/${this.pedidoSeleccionado.id}`, {
          codigoPedido: this.pedidoSeleccionado.codigoPedido,
          nombreCliente: this.pedidoSeleccionado.nombreCliente,
          estadoPedido: this.pedidoSeleccionado.estadoPedido,
          observacion: this.pedidoSeleccionado.observacion,
          productos: this.pedidoSeleccionado.productos,
        });
        alert("Pedido actualizado correctamente");
        this.editarPedidoDialog = false;
        this.obtenerPedidos(); // Actualizar la lista de pedidos después de editar uno
      } catch (error) {
        console.error("Error al actualizar el pedido:", error);
      }
    },
    async eliminarPedido(id) {
      try {
        await axios.delete(`http://localhost:3000/api/pedidos/${id}`);
        alert("Pedido eliminado correctamente");
        this.obtenerPedidos(); // Actualizar la lista de pedidos después de eliminar uno
      } catch (error) {
        console.error("Error al eliminar el pedido:", error);
      }
    },
    async exportarPedidos() {
      try {
        // Lógica para exportar pedidos según el formato seleccionado (this.exportFormat)
        // Aquí deberías implementar la lógica para exportar a Excel o PDF, utilizando una librería adecuada
        alert(`Exportando pedidos en formato ${this.exportFormat}`);
        this.dialogExportarPedidos = false;
      } catch (error) {
        console.error("Error al exportar los pedidos:", error);
      }
    },
    addProducto() {
      this.nuevoPedido.productos.push({ producto_id: "", cantidad: "", unidad_medida_id: "" });
    },
    removeProducto(index) {
      this.nuevoPedido.productos.splice(index, 1);
    },
    addProductoEdicion() {
      this.pedidoSeleccionado.productos.push({ producto_id: "", cantidad: "", unidad_medida_id: "" });
    },
    removeProductoEdicion(index) {
      this.pedidoSeleccionado.productos.splice(index, 1);
    },
    abrirDialogoEditarPedido(item) {
      this.editarPedidoDialog = true;
      this.pedidoSeleccionado.id = item._id;
      this.pedidoSeleccionado.codigoPedido = item.codigoPedido;
      this.pedidoSeleccionado.nombreCliente = item.nombreCliente;
      this.pedidoSeleccionado.estadoPedido = item.estadoPedido;
      this.pedidoSeleccionado.productos = item.productos;
      this.pedidoSeleccionado.observacion = item.observacion;
    },
    verDetallePedido(item) {
      this.detallePedidoDialog = true;
      this.detallePedido.codigoPedido = item.codigoPedido;
      this.detallePedido.nombreCliente = item.nombreCliente;
      this.detallePedido.estadoPedido = item.estadoPedido;
      this.detallePedido.codigoProducto = item.productos.map(prod => prod.producto_id).join(", ");
      this.detallePedido.cantidad.kilos = item.productos.map(prod => prod.cantidad).reduce((acc, val) => acc + val, 0);
      this.detallePedido.cantidad.unidades = item.productos.length;
      this.detallePedido.observacion = item.observacion;
    },
    cerrarVerPedido() {
      this.detallePedidoDialog = false;
      this.detallePedido = {
        codigoPedido: "",
        nombreCliente: "",
        estadoPedido: "",
        codigoProducto: "",
        cantidad: {
          kilos: "",
          unidades: "",
        },
        observacion: "",
      };
    },
    cancelarNuevoPedido() {
      this.limpiarFormularioNuevoPedido();
      this.nuevoPedidoDialog = false;
    },
    limpiarFormularioNuevoPedido() {
      this.nuevoPedido = {
        codigoPedido: null, // Reiniciamos a null para la próxima generación automática
        nombreCliente: "",
        estadoPedido: "",
        productos: [],
        observacion: "",
      };
    },
    cancelarEditarPedido() {
      this.editarPedidoDialog = false;
      this.pedidoSeleccionado = {
        id: "",
        codigoPedido: "",
        nombreCliente: "",
        estadoPedido: "",
        productos: [],
        observacion: "",
      };
    },
  },
  mounted() {
    this.obtenerPedidos();
    this.obtenerUnidades();
    this.obtenerProductos();
  },
};
</script>






<style scoped>
.container-tabla-pedidos {
  padding: 20px;
}

.container-header-table {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
