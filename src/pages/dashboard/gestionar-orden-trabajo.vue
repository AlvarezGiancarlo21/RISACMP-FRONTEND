<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-card class="card" style="margin: 240px auto 0; width: auto;height:120%;">
    <v-card title="Órdenes de Trabajo" flat></v-card>
    <template v-slot:text>
      <v-toolbar flat>
        <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details
          single-line></v-text-field>

        <!-- Registrar Órdenes de Trabajo -->
        <div class="pa-4 text-center">
          <v-dialog v-model="dialogPostOrdenDeTrabajo" max-width="600">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn class="text-none font-weight-regular" prepend-icon="mdi-account"
                text="Crear Ordenes de Trabajo a partir de Pedido" variant="tonal" v-bind="activatorProps"
                @click="obtenerPedidos()"></v-btn>
            </template>

            <v-card prepend-icon="mdi-account" title="Orden de Trabajo">
              <v-card-text>
                <v-row dense>

                  <v-col cols="12" sm="12">
                    <v-select v-model="pedido_id" :items="pedidos" label="Pedido*" required item-title="codigoPedido"
                      item-value="id"></v-select>
                  </v-col>
                </v-row>

                <small class="text-caption text-medium-emphasis">*indica campo requerido</small>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text="Cerrar" variant="plain" @click="dialogPostOrdenDeTrabajo = false"></v-btn>

                <v-btn color="primary" text="Crear" variant="tonal" @click="registrar"></v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>

      </v-toolbar>
    </template>

    <v-dialog v-model="dialogDetalles" max-width="600">
      <v-card>
        <v-card-title>Detalle de Orden de Trabajo</v-card-title>
        <v-card-text>
          <v-container>
            <v-row v-for="(value, key) in ordenTrabajoSeleccionada" :key="key">
              <v-col cols="6" md="4">
                <strong>{{ key }}</strong>
              </v-col>
              <v-col cols="6" md="8">
                <span>{{ value }}</span>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Cerrar" variant="plain" @click="dialogDetalles = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogPutCantidadRealizada" max-width="600">
      <v-card>
        <v-card-title>Actualizar Cantidad Realizada</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="ordenTrabajoSeleccionada.cantidad_realizada" label="Cantidad Realizada"
                  type="number"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Cerrar" variant="plain" @click="dialogPutCantidadRealizada = false"></v-btn>
          <v-btn color="primary" text="Actualizar" variant="tonal" @click="actualizarCantidadRealizada"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-alert v-model="isAlertVisible" closable icon="$error" title="Error" :text="errorMessage" type="error"
      variant="tonal">
    </v-alert>

    <v-data-table :headers="headers" :items="ordenesTrabajoTabla" :search="search">
      <template v-slot:item.detalles="{ item }">

        <v-btn color="primary" @click="abrirDetalles(item)">Detalles
          <v-icon icon="mdi-information-outline" end>
          </v-icon>
        </v-btn>

      </template>

      <template v-slot:item.actions="{ item }">

        <v-btn color="secondary" @click="abrirDialogPutCantidadRealizada(item)">
          Actualizar
          <v-icon icon="mdi-plus" end></v-icon>
        </v-btn>

      </template>
    </v-data-table>

  </v-card>
</template>
<script>
import * as servicios from '../../services/s_ordenesTrabajos';

export default {
  data() {
    return {
      search: '',
      dialogDetalles: false,
      dialogPostOrdenDeTrabajo: false,
      dialogPutCantidadRealizada: false,
      ordenTrabajoSeleccionada: {},
      headers: [
        { title: 'Código Orden de Trabajo', value: 'codigo_Orden' },
        { title: 'Código Pedido', value: 'pedido.codigoPedido' },
        { title: 'Producto a Realizar', value: 'producto.nombre' },
        { title: 'Cantidad a Realizar', value: 'cantidad_a_realizar.producto' },
        { title: 'Cantidad Realizada', value: 'cantidad_realizada' },
        { title: 'Estado', value: 'estado' },
        { title: 'Detalles', value: 'detalles', sortable: false },
        { title: 'Acciones', value: 'actions', sortable: false },
      ],
      ordenesTrabajoTabla: [],
      unidades: [],
      pedidos: [],
      pedido_id: '',
      errorMessage: '',
      isAlertVisible: false,
    }
  },
  methods: {
    async registrar() {
      try {
        await servicios.registrarOrdenesTrabajoAPartirDePedido(this.pedido_id);
        this.dialogPostOrdenDeTrabajo = false;
        await this.obtenerDatos();
      } catch (error) {
        this.errorMessage = error.message;
        this.isAlertVisible = true;
      } finally {
        this.dialogPostOrdenDeTrabajo = false;
      }
    },
    async obtenerDatos() {
      try {
        this.ordenesTrabajoTabla = await servicios.obtenerOrdenesTrabajo();
      }
      catch (error) {
        this.errorMessage = error.message;
        this.isAlertVisible = true;
      }
    },
    async obtenerPedidos() {
      try {
      const pedidos = await servicios.obtenerPedidos();
      this.pedidos = pedidos.map(pedido => ({
        id: pedido._id,
        codigoPedido: pedido.codigoPedido
      }));}
      catch (error) {
        this.errorMessage = error.message;
        this.isAlertVisible = true;
      }
    },
    abrirDetalles(item) {
      /*const ingredientes = item.cantidad_a_realizar.ingredientes.map((ingrediente)=>({
        nombre: ingrediente.nombre,
        cantidad: ingrediente.cantidad,
      }))*/
      this.ordenTrabajoSeleccionada = {
        'Código del Pedido': item.pedido.codigoPedido,
        'Nombre del Cliente': item.pedido.nombreCliente,
        'Estado del Pedido': item.pedido.estadoPedido,
        'Observación del Pedido': item.pedido.observacion,
        'Fecha del Pedido': item.pedido.fechaPedido,
        'Nombre del Producto:': item.producto.nombre,
        'Tipo del Producto:': item.producto.tipo,
        'Cantidad a realizar:': item.cantidad_a_realizar.producto,
        'Unidad de Medida:': item.producto.unidad_medida.nombre,
        'Cantidad realizada:': item.cantidad_realizada,
        'Estado:': item.estado,
        'Ingredientes usados/a usar:': "",
      };
      for (const ingrediente of item.cantidad_a_realizar.ingredientes) {
        this.ordenTrabajoSeleccionada[ingrediente.nombre] = ingrediente.cantidad;
      }
      this.dialogDetalles = true;
    },
    abrirDialogPutCantidadRealizada(item) {
      this.ordenTrabajoSeleccionada = { ...item };
      this.dialogPutCantidadRealizada = true;
    },
    async actualizarCantidadRealizada() {
      try {
        console.log(this.ordenTrabajoSeleccionada.cantidad_realizada);
        await servicios.actualizarOrdenTrabajoCantidadRealizada(this.ordenTrabajoSeleccionada.id, {
          cantidad_realizada: this.ordenTrabajoSeleccionada.cantidad_realizada,
        });
        this.dialogPutCantidadRealizada = false;
        await this.obtenerDatos();
      } catch (error) {
        this.errorMessage = error.message;
        this.isAlertVisible = true;
      }
    },
    handleCloseErrorAlert() {
      this.errorMessage = '';
      this.isAlertVisible = false;
    },
  },
  async created() {
    await this.obtenerDatos(() => { });
  }
}
</script>