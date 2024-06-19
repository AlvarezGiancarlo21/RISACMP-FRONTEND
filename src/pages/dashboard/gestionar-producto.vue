<template>
  <div class="container-tabla-productos">
    <v-card>
      <template v-slot:text>
        <div class="container-header-table">
          <!-- Título encima de la barra de búsqueda -->
          <div class="header-title">
            <h1>Gestionar Productos</h1>
          </div>
          <!-- Cuadro de búsqueda para buscar un producto -->
          <v-text-field
            v-model="search"
            label="Buscar"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
          ></v-text-field>
          <v-btn
            color="blue-darken-2"
            @click="
              () => {
                dialogRegistrarProducto = true;
                modoModal = 'Agregar';
              }
            "
          >
            Agregar Producto
          </v-btn>
        </div>
      </template>
      <!-- Tabla de datos principal para mostrar todos los productos -->
      <v-data-table :headers="headers" :items="productos" :search="search">
        <template v-slot:item.actions="{ item }">
          <v-icon
            class="me-2"
            size="small"
            @click="
              () => {
                verProducto(item);
                modoModal = 'Detalle';
                dialogRegistrarProducto = true;
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
                verProducto(item);
                modoModal = 'Modificar';
                dialogRegistrarProducto = true;
              }
            "
          >
            mdi-pencil
          </v-icon>
          <v-icon size="small" @click="eliminarProducto(item)">
            mdi-cancel
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog
      v-model="dialogRegistrarProducto"
      max-width="1000"
      persistent
      transition="dialog-top-transition"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ modoModal === 'Detalle' ? 'Detalle del Producto' : modoModal === 'Modificar' ? 'Modificar Producto' : 'Agregar Producto' }}
        </v-card-title>
        <v-card-text>
          <!-- Inputs de Agregar Producto -->
          <v-row dense v-if="modoModal === 'Agregar'">
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Código"
                v-model="nuevoProducto.codigo"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Familia"
                v-model="nuevoProducto.familia"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Subfamilia"
                v-model="nuevoProducto.subFamilia"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Proveedor"
                v-model="nuevoProducto.proveedor"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Nombre del Producto"
                v-model="nuevoProducto.nombreProducto"
                required
              ></v-text-field>
            </v-col> 
            <v-col cols="12" md="4" sm="6">
              <v-text-field
               label="Fecha de Registro"
               v-model="nuevoProducto.fechaRegistro"
               required>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Stock Actual"
                v-model="nuevoProducto.stockActual"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Cantidad Solicitada"
                v-model="nuevoProducto.cantSolicitada"
                required
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Stock Resultante"
                v-model="nuevoProducto.stockResul"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
              label="Unidad Medida"
              v-model="nuevoProducto.unidMedida"
              required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
              label="Almacen"
              v-model="nuevoProducto.almacen"
              required
              ></v-text-field>
            </v-col>
          </v-row>
          <!-- Inputs de Detalle Producto -->
          <v-row dense v-if="modoModal === 'Detalle'">
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Código" 
                v-model="productoSeleccionado.codigo"
                required
                readonly
              ></v-text-field>
              
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Familia"
                v-model="productoSeleccionado.familia"
                required
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Subfamilia"
                v-model="productoSeleccionado.subFamilia"
                required
                readonly
              ></v-text-field>
            </v-col> 
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Proveedor"
                v-model="productoSeleccionado.proveedor"
                required
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Nombre del Producto"
                v-model="productoSeleccionado.nombreProducto"
                required
                readonly
              ></v-text-field>
            </v-col>
           <v-col cols="12" md="4" sm="6">
            <v-text-field
             label="Fecha de Registro"
             v-model="productoSeleccionado.fechaRegistro"
             required
             readonly
             ></v-text-field>
           </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Stock Actual"
                v-model="productoSeleccionado.stockActual"
                required
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
               label="Cantidad Solicitada"
               v-model="productoSeleccionado.cantSolicitada"
               required
               readonly
               ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
              label="Stock Resultante"
              v-model="productoSeleccionado.stockResul"
              required
              readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
              label="Unidad Medida"
              v-model="productoSeleccionado.unidMedida"
              required
              readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
              label="Almacen"
              v-model="productoSeleccionado.almacen"
              required
              readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <!-- Inputs de Modificar Producto -->
          <v-row dense v-if="modoModal === 'Modificar'">
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Código"
                v-model="productoSeleccionado.codigo"
                required
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Familia"
                v-model="productoSeleccionado.familia"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Subfamilia"
                v-model="productoSeleccionado.subFamilia"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Proveedor"
                v-model="productoSeleccionado.proveedor"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Nombre del Producto"
                v-model="productoSeleccionado.nombreProducto"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Fecha de Registro"
                v-model="productoSeleccionado.fechaRegistro"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Stock Actual"
                v-model="productoSeleccionado.stockActual"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
               label="Cantidad Solicitada"
               v-model="productoSeleccionado.cantSolicitada"
               required
               ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
              label="Stock Resultante"
              v-model="productoSeleccionado.stockResul"
              required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
              label="Unidad Medida"
              v-model="productoSeleccionado.unidMedida"
              required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
              label="Almacen"
              v-model="productoSeleccionado.almacen"
              required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            v-if="modoModal === 'Agregar'"
            text
            @click="registrarProducto"
          >
            Agregar
          </v-btn>
          <v-btn
            color="primary"
            v-if="modoModal === 'Modificar'"
            text
            @click="modificarProducto(productoSeleccionado)"
          >
            Modificar
          </v-btn>
          <v-btn
            color="red"
            text
            @click="
              () => {
                dialogRegistrarProducto = false;
                modoModal = '';
              }
            "
          >
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      search: '',
      headers: [
        { align: 'start', key: 'codigo', sortable: false, title: 'Código' },
        { key: 'familia', title: 'Familia' },
        { key: 'proveedor', title: 'Proveedor' },
        { key: 'nombreProducto', title: 'Nombre del Producto' },
        { key: 'cantSolicitada', title: 'Cantidad Solicitada'},
        { key: 'stockResul', title: 'Stock Resultante'},
        { key: 'almacen', title: 'Almacen'},
        { key: 'actions', title: 'Acciones', sortable: false },
      ],
      productos: [],
      dialogRegistrarProducto: false,
      nuevoProducto: {
        codigo: '',
        familia: '',
        subFamilia: '',
        proveedor: '',
        nombreProducto: '',
        fechaRegistro: '',
        stockActual: '',
        cantSolicitada: '',
        stockResul: '',
        unidMedida: '',
        almacen: '',
      },
      productoSeleccionado: {},
      modoModal: '',
    };
  },
  methods: {
  async obtenerProductos() {
    try {
      const response = await axios.get('http://localhost:3000/api/producto');
      this.productos = response.data;
    } catch (error) {
      console.error(error);
    }
  },
  async registrarProducto() {
    try {
      const response = await axios.post('http://localhost:3000/api/producto/register', this.nuevoProducto);
      this.productos.push(response.data);
      await this.obtenerProductos();
      this.nuevoProducto = { codigo: '', familia: '', subFamilia: '', proveedor: '', nombreProducto: '', fechaRegistro: '', stockActual: '', cantSolicitada: '', stockResul: '', unidMedida: '', almacen: '' };
      this.modoModal = '';
      this.dialogRegistrarProducto = false;
    } catch (error) {
      console.error('Error al registrar producto:', error);
    }
  },
  async verProducto(producto) {
    try {
      const response = await axios.get(`http://localhost:3000/api/producto/${producto._id}`);
      this.productoSeleccionado = response.data;
    } catch (error) {
      console.error('Error al obtener detalle del producto:', error);
    }
  },
  async modificarProducto(producto) {
    try {
      const response = await axios.put(`http://localhost:3000/api/producto/${producto._id}`, producto);
      await this.obtenerProductos();
      this.modoModal = '';
      this.dialogRegistrarProducto = false;
    } catch (error) {
      console.error('Error al modificar producto:', error);
    }
  },
  async eliminarProducto(producto) {
    try {
      await axios.delete(`http://localhost:3000/api/producto/${producto._id}`);
      await this.obtenerProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  },
},
  mounted() {
    this.obtenerProductos();
  },
};
</script>

<style>
.container-tabla-productos {
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

       
