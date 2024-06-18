<template>
  <v-card>
    <div class="container-tabla-pedidos">
      <v-card flat>
        <v-card-text>
          <div class="container-header-table">
            <v-text-field 
              v-model="search" 
              label="Buscar" 
              prepend-inner-icon="mdi-magnify" 
              variant="outlined" 
              hide-details
            ></v-text-field>

            <v-btn 
              icon="mdi-export" 
              color="green-darken-2" 
              @click="dialogExportarPedidos = true"
            ></v-btn>

            <v-btn 
              prepend-icon="mdi-plus" 
              color="blue-darken-2" 
              @click="nuevoPedidoDialog = true"
            >
              Registrar Orden de Trabajo
            </v-btn>
          </div>
        </v-card-text>

        <v-data-table :headers="headers" :items="ordenesTrabajo" :search="search">
          <template v-slot:item.pedido="{ item }">
            {{ item.pedido.codigoPedido }} - {{ item.pedido.nombreCliente }}
          </template>
          <template v-slot:item.receta="{ item }">
            {{ item.receta.codigo }} - {{ item.receta.nombre }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon @click="abrirDialogoEditarOrdenTrabajo(item)" class="mr-2">mdi-pencil</v-icon>
            <v-icon @click="verDetalleOrdenTrabajo(item)" class="mr-2">mdi-eye</v-icon>
            <v-icon @click="eliminarOrdenTrabajo(item)" class="mr-2">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-card>

      <v-dialog v-model="nuevoPedidoDialog" max-width="500px">
        <NuevoOrdenTrabajoDialog 
          :ordenTrabajo="nuevaOrdenTrabajo" 
          @guardar="crearOrdenTrabajo" 
          @cancelar="nuevoPedidoDialog = false"
        />
      </v-dialog>

      <v-dialog v-model="editarPedidoDialog" max-width="500px">
        <EditarOrdenTrabajoDialog 
          :ordenTrabajo="ordenTrabajoSeleccionada" 
          @guardar="actualizarOrdenTrabajo" 
          @cancelar="editarPedidoDialog = false"
        />
      </v-dialog>

      <ExportarOrdenesTrabajoDialog v-model="dialogExportarPedidos" />

      <VerDetalleOrdenTrabajoDialog v-model="detallePedidoDialog" :ordenTrabajo="detalleOrdenTrabajo" />
    </div>
  </v-card>
</template>

<script>
import axios from "axios";
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/User";
import jwt_decode from "jwt-decode"; // Importa la librería para decodificar el token JWT

const userStore = useUserStore();
const role = computed(() => userStore.user.role);
const nombres = computed(() => userStore.user.nombres);
const apellidos = computed(() => userStore.user.apellidos);

export default {
  data() {
    return {
      // ... (otras variables de datos)

      headers: [
        { title: "Pedido", value: "pedido" },
        { title: "Receta", value: "receta" },
        { title: "Cantidad a Realizar", value: "cantidad_a_realizar" },
        { title: "Cantidad Realizada", value: "cantidad_realizada" },
        { title: "Unidad de Medida", value: "unidad_medida_id" },
        { title: "Estado", value: "estado" },
        { title: "Acciones", value: "actions", sortable: false },
      ],
      ordenesTrabajo: [], // Cambiado de pedidos a ordenesTrabajo
      nuevaOrdenTrabajo: { // Cambiado de nuevoPedido a nuevaOrdenTrabajo
        pedido_id: "", // Cambiado de codigoPedido a pedido_id
        producto_id: "", // Cambiado de codigoProducto a producto_id
        cantidad_a_realizar: null,
        cantidad_realizada: null,
        unidad_medida_id: "",
        estado: "",
      },
      ordenTrabajoSeleccionada: null, // Cambiado de pedidoSeleccionado a ordenTrabajoSeleccionada
      detalleOrdenTrabajo: null, // Cambiado de detallePedido a detalleOrdenTrabajo
    };
  },

  methods: {
    async fetchOrdenesTrabajo() { // Cambiado de fetchPedidos a fetchOrdenesTrabajo
      try {
        const response = await axios.get("http://localhost:3000/api/orden_trabajo/get/all");
        this.ordenesTrabajo = response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    async crearOrdenTrabajo(ordenTrabajo) {
      try {
        await axios.post("http://localhost:3000/api/orden_trabajo/post", ordenTrabajo);
        this.nuevoPedidoDialog = false;
        this.fetchOrdenesTrabajo();
        this.nuevaOrdenTrabajo = { // Restablecer el objeto nuevaOrdenTrabajo
          pedido_id: "",
          producto_id: "",
          cantidad_a_realizar: null,
          cantidad_realizada: null,
          unidad_medida_id: "",
          estado: "",
        };
      } catch (error) {
        console.error("Error creating orden de trabajo:", error);
      }
    },

    // ... (Otros métodos adaptados para ordenesTrabajo)
  },

  mounted() {
    this.fetchOrdenesTrabajo();
  },
}
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
