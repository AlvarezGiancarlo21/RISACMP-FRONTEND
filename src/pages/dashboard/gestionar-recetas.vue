<template>
  <div class="container-tabla-recetas">
    <v-card flat>
      <template v-slot:text>
        <div class="container-header-table">
          <!-- Cuadro de busqueda para buscar una receta -->
          <v-text-field v-model="search" label="Buscar" prepend-inner-icon="mdi-magnify" variant="outlined"
            hide-details></v-text-field>
          <v-btn color="green-darken-2" @click="dialogExportarRecetas = true">
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
      <!-- Tabla de datos principal para mostrar todos las recetas -->
      <v-data-table :headers="headers" :items="recetas" :search="search">
        <template v-slot:item.disponible="{ item }">
          <v-icon v-if="item.disponible === true" color="green">
            mdi-check
          </v-icon>
          <v-icon v-else color="red"> mdi-close </v-icon>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon class="me-2" size="small" @click="() => {
              detalleReceta(item);
              modoModal = 'Detalle';
              dialogAgregar = true;
            }
            ">
            mdi-book-open-variant
          </v-icon>
          <v-icon class="me-2" size="small" @click="() => {
              detalleReceta(item);
              modoModal = 'Modificar';
              dialogAgregar = true;
            }
            " :disabled="item.disponible === false">
            mdi-pencil
          </v-icon>
          <v-icon class="me-2" size="small" @click="() => { detalleReceta(item); dialogCambioDisponible = true }"
            :disabled="item.disponible === false">
            mdi-cancel
          </v-icon>
          <v-icon size="small" @click="() => { detalleReceta(item); dialogCambioDisponible = true }"
            :disabled="item.disponible === true">
            mdi-check-bold
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <div class="pa-4 text-center">
      <!-- Dialog para Agregar, Detalles y Editar -->
      <v-dialog v-model="dialogAgregar" max-width="1000" persistent transition="dialog-top-transition">
        <v-card :title="modoModal === 'Detalle'
            ? 'Detalle de Receta'
            : modoModal === 'Modificar'
              ? 'Modificar Receta'
              : 'Agregar Receta'
          " style="text-align: center">
          <v-card-text>
            <!-- Inputs de Agregar Receta -->
            <v-row dense v-if="modoModal === 'Agregar'">
              <v-col cols="12" md="4" sm="6">
                <v-text-field label="Codigo" v-model="nuevaReceta.codigo" required readonly></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-autocomplete
                :items="productosNombre"
                v-model="nuevaReceta.nombre"
                label="Buscar producto"
                required
                hide-no-data
                hide-details
              ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field label="Rendimiento por receta" v-model="nuevaReceta.rendimiento" required type="text"
                  :rules="[value => /^\d*\.?\d+$/.test(value) || 'Debe ser un valor numérico positivo']"
                  @input="nuevaReceta.rendimiento = validatePositiveNumber(nuevaReceta.rendimiento, nuevaReceta)"
                  @update:modelValue="nuevaReceta.rendimiento = validatePositiveNumber(nuevaReceta.rendimiento, nuevaReceta)"></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field label="Disponibilidad" v-model="disponibilidadTextoNuevaReceta" required readonly
                  :append-inner-icon="RecetaSeleccionada.disponible ? 'mdi-check' : 'mdi-close'"
                  :append-icon="null"></v-text-field>
              </v-col>
              <v-col cols="12">
                <h2>Ingredientes:</h2>
                <div class="container-ingredientes">
                  <div class="elemento-ingrediente" v-for="(ingrediente, index) in nuevaReceta.ingredientes" :key="index">
                    <v-row>
                      <v-col cols="1" style="
                          height: 50px;
                          margin-top: 15px;
                          border-radius: 20px;
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          background-color: #ededed;
                        ">
                        <span>{{ index + 1 }}</span>
                      </v-col>
                      <v-col cols="12" md="3" sm="4">
                        <v-autocomplete
                      :items="productosNombre"
                      v-model="ingrediente.nombre"
                      label="Buscar producto"
                      required
                      hide-no-data
                      hide-details
                    ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" md="3" sm="3">
                        <v-text-field label="Cantidad" v-model="ingrediente.cantidad" required  :rules="[value => /^\d*\.?\d+$/.test(value) || 'Debe ser un valor numérico positivo']" @input="ingrediente.cantidad = validatePositiveNumber(ingrediente.cantidad, ingrediente)" @update:modelValue="ingrediente.cantidad = validatePositiveNumber(ingrediente.cantidad, ingrediente)"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3" sm="3">
                        <v-select label="Unidad" v-model="ingrediente.unidad" :items="['kg', 'g', 'l', 'ml']"  required></v-select>
                      </v-col>
                      <v-col cols="12" md="2" sm="3" class="remove-ingredient">
                        <v-btn @click="removeIngredient(index)">Quitar</v-btn>
                      </v-col>
                    </v-row>
                  </div>
                </div>
                <v-btn @click="addIngredient">Agregar ingrediente</v-btn>
              </v-col>
            </v-row>
            <!-- Inputs de Detalle Proveedor -->
            <v-row dense v-if="modoModal === 'Detalle'">
              <v-col cols="12" md="4" sm="6">
                <v-text-field label="Codigo" v-model="RecetaSeleccionada.codigo" required readonly></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field label="Nombre" v-model="RecetaSeleccionada.nombre" required readonly></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field label="Rendimiento por receta" v-model="RecetaSeleccionada.rendimiento" required
                  readonly></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field label="Disponibilidad" v-model="disponibilidadTextoRecetaSeleccionada" required readonly
                  :append-inner-icon="RecetaSeleccionada.disponible ? 'mdi-check' : 'mdi-close'"
                  :append-icon="null"></v-text-field>
              </v-col>

              <v-col cols="12" md="12" sm="12">
                <h2 style="text-align: start; margin-bottom: 15px">
                  Ingredientes:
                </h2>
                <div class="container-ingredientes">
                  <div class="elemento-ingrediente" v-for="(
                      ingrediente, index
                    ) in RecetaSeleccionada.ingredientes" :key="index">
                    <v-row>
                      <v-col cols="1" style="
                          height: 50px;
                          margin-top: 15px;
                          border-radius: 20px;
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          background-color: #ededed;
                        ">
                        <span>{{ index + 1 }}</span>
                      </v-col>
                      <v-col cols="3.5">
                        <v-text-field label="Nombre" v-model="ingrediente.nombre" required readonly></v-text-field>
                      </v-col>
                      <v-col cols="3.5">
                        <v-text-field label="Cantidad" v-model="ingrediente.cantidad" required readonly></v-text-field>
                      </v-col>
                      <v-col cols="3.5">
                        <v-text-field label="Unidad" v-model="ingrediente.unidad" required readonly></v-text-field>
                      </v-col>
                    </v-row>
                  </div>
                </div>
              </v-col>
            </v-row>
            <!-- Inputs de Modificar Proveedor -->
            <v-row dense v-if="modoModal === 'Modificar'">
              <v-col cols="12" md="4" sm="6">
                <v-text-field label="Codigo" v-model="RecetaSeleccionada.codigo" required></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <!-- <v-text-field label="Nombre" v-model="RecetaSeleccionada.nombre" required></v-text-field> -->
                <v-autocomplete
                :items="productosNombre"
                v-model="RecetaSeleccionada.nombre"
                label="Buscar producto"
                required
                hide-no-data
                hide-details
              ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field label="Rendimiento por receta" v-model="RecetaSeleccionada.rendimiento" required type="text"
                  :rules="[value => /^\d*\.?\d+$/.test(value) || 'Debe ser un valor numérico positivo']"
                  @update:modelValue="RecetaSeleccionada.rendimiento = validatePositiveNumber(RecetaSeleccionada.rendimiento, RecetaSeleccionada)"
                  @input:modelValue="RecetaSeleccionada.rendimiento = validatePositiveNumber(RecetaSeleccionada.rendimiento, RecetaSeleccionada)"></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field label="Disponibilidad" v-model="disponibilidadTextoRecetaSeleccionada"
                  required readonly :append-inner-icon="RecetaSeleccionada.disponible ? 'mdi-check' : 'mdi-close'"
                  :append-icon="null"></v-text-field>
              </v-col>

              <v-col cols="12" md="12" sm="12">
                <h2 style="text-align: start; margin-bottom: 15px">
                  Ingredientes:
                </h2>
                <div class="container-ingredientes">
                  <div class="elemento-ingrediente" v-for="(
                      ingrediente, index
                    ) in RecetaSeleccionada.ingredientes" :key="index">
                    <v-row>
                      <v-col cols="1" style="
                          height: 50px;
                          margin-top: 15px;
                          border-radius: 20px;
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          background-color: #ededed;
                        ">
                        <span>{{ index + 1 }}</span>
                      </v-col>
                      <v-col cols="3.5">
                        <!-- <v-text-field label="Nombre" v-model="ingrediente.nombre" required></v-text-field> -->
                        <v-autocomplete
                      :items="productosNombre"
                      v-model="ingrediente.nombre"
                      label="Buscar producto"
                      required
                      hide-no-data
                      hide-details
                    ></v-autocomplete>
                      </v-col>
                      <v-col cols="3.5">
                        <v-text-field label="Cantidad" v-model="ingrediente.cantidad" required  :rules="[value => /^\d*\.?\d+$/.test(value) || 'Debe ser un valor numérico positivo']" @input="ingrediente.cantidad = validatePositiveNumber(ingrediente.cantidad, ingrediente)" @update:modelValue="ingrediente.cantidad = validatePositiveNumber(ingrediente.cantidad, ingrediente)"></v-text-field>
                      </v-col>
                      <v-col cols="3.5">
                        <v-select label="Unidad" v-model="ingrediente.unidad" :items="['kg', 'g', 'l', 'ml']" required></v-select>
                      </v-col>
                      <v-col cols="12" md="2" sm="3" class="remove-ingredient">
                        <v-btn @click="removeIngredient(index)">Quitar</v-btn>
                      </v-col>
                    </v-row>
                  </div>
                </div>
                <v-btn @click="addIngredient">Agregar ingrediente</v-btn>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions v-if="modoModal === 'Agregar'">
            <v-spacer></v-spacer>

            <v-btn color="success" text="Agregar" variant="tonal" @click="dialogAgregarConfirmacion = true"></v-btn>

            <v-btn color="red" text="Cancelar" variant="tonal" @click="() => {
                dialogAgregar = false;
                nuevaReceta.codigo = '';
                nuevaReceta.nombre = '';
                nuevaReceta.rendimiento = '';
                nuevaReceta.disponible = true;
                nuevaReceta.ingredientes = [];
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
            <v-btn color="success" text="Modificar" variant="tonal" @click="dialogAgregarConfirmacion = true"></v-btn>

            <v-btn color="red" text="Cancelar" variant="tonal" @click="() => {
                dialogAgregar = false;
                this.modoModal = '';
              }
              "></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Dialog para error de agregar receta -->
      <v-dialog v-model="dialogAgregarError" width="auto">
        <v-card max-width="500" prepend-icon="mdi-google-downasaur" :title="errorDialogTitle">
          <v-card-text style="margin: 20px;">
            {{ errorDialogText }}
            <ul>
              <li>Verifique que todos los campos estén completos.</li>
              <li>
                Verifique si el rendimiento no coincide con la suma de las cantidades de los ingredientes.
              </li>
              <li>Verifique si los tipos de datos son correctos.</li>
            </ul>
          </v-card-text>
          <template v-slot:actions>
            <v-btn class="ms-auto" text="Ok" @click="dialogAgregarError = false"></v-btn>
          </template>
        </v-card>
      </v-dialog>
      <!-- Dialog para la confirmacion de agregar o modificar receta -->
      <v-dialog v-model="dialogAgregarConfirmacion" width="auto">
        <v-card max-width="400" prepend-icon="mdi-google-downasaur"
          :title="modoModal === 'Agregar' ? 'Agregar Receta' : 'Modificar Receta'">
          <v-card-text style="margin: 20px;">
            ¿Está seguro que desea {{ modoModal === 'Agregar'
              ? "agregar"
              : "modificar" }} la receta?
          </v-card-text>
          <v-card-actions v-if="modoModal === 'Agregar'">
            <v-spacer></v-spacer>
            <v-btn color="success" text="Sí" variant="tonal" @click="agregarReceta"></v-btn>
            <v-btn color="red" text="Cancelar" variant="tonal" @click="() => {
                dialogAgregarConfirmacion = false;
              }
              ">

            </v-btn>
          </v-card-actions>
          <v-card-actions v-if="modoModal === 'Modificar'">
            <v-spacer></v-spacer>
            <v-btn color="success" text="Sí" variant="tonal" @click="modificarReceta(RecetaSeleccionada)"></v-btn>
            <v-btn color="red" text="Cancelar" variant="tonal" @click="() => {
                dialogAgregarConfirmacion = false;
              }
              ">
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Dialog para habilitar o deshabilitar una receta, un mensaje de confirmacion -->
      <v-dialog v-model="dialogCambioDisponible" width="auto">
        <v-card max-width="400" prepend-icon="mdi-google-downasaur"
          :title="RecetaSeleccionada && RecetaSeleccionada.disponible ? 'Deshabilitar Receta' : 'Habilitar Receta'">
          <v-card-text style="margin: 20px;">
            ¿Está seguro que desea {{ RecetaSeleccionada && RecetaSeleccionada.disponible
              ? "deshabilitar"
              : "habilitar" }} la receta?
          </v-card-text>
          <v-card-actions v-if="RecetaSeleccionada.disponible === true">
            <v-spacer></v-spacer>
            <v-btn color="success" text="Sí" variant="tonal" @click="deshabilitarReceta(RecetaSeleccionada)"></v-btn>
            <v-btn color="red" text="Cancelar" variant="tonal" @click="() => {
                dialogCambioDisponible = false;
              }
              ">

            </v-btn>
          </v-card-actions>
          <v-card-actions v-if="RecetaSeleccionada.disponible === false">
            <v-spacer></v-spacer>
            <v-btn color="success" text="Sí" variant="tonal" @click="habilitarReceta(RecetaSeleccionada)"></v-btn>
            <v-btn color="red" text="Cancelar" variant="tonal" @click="() => {
                dialogCambioDisponible = false;
              }
              ">
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Dialog para Exportar Usuarios a PDF O XLSX -->
      <v-dialog v-model="dialogExportarRecetas" max-width="480">
        <v-card v-card title="Exportar Usuario es formato EXCEL o PDF">
          <template v-slot:text>
            <div class="ma-4">
              <v-row>
                <v-col style="
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                  ">
                  <v-img :aspect-ratio="1" class="bg-white" src="/src/assets/Gestionar Usuarios/pdf.png"
                    style="height: 100px; width: 100px"></v-img>
                  <v-btn class="my-2" text="Exportar en PDF" @click="exportToPDF()"></v-btn>
                </v-col>

                <v-col style="
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                  ">
                  <v-img :aspect-ratio="1" class="bg-white" src="/src/assets/Gestionar Usuarios/excel.png"
                    style="height: 100px; width: 100px"></v-img>
                  <v-btn class="my-2" text="Exportar en EXCEL" @click="exportToExcel()"></v-btn>
                </v-col>
              </v-row>
            </div>
          </template>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text="Cerrar" variant="tonal" color="red" @click="dialogExportarRecetas = false"></v-btn>
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
          key: "codigo",
          sortable: false,
          title: "Codigo",
        },
        { key: "nombre", title: "Nombre" },
        { key: "rendimiento", title: "Rendimiento por receta" },
        { key: "disponible", title: "Disponible" },
        { key: "actions", title: "Acciones", sortable: false },
      ],
      recetas: [],
      dialogAgregar: false,
      dialogExportarRecetas: false,
      dialogAgregarError: false,
      dialogCambioDisponible: false,
      dialogAgregarConfirmacion: false,
      dialogRequerimiento: false,
      nuevaReceta: {
        codigo: "",
        nombre: "",
        rendimiento: "",
        ingredientes: [],
        disponible: true,
      },
      RecetaSeleccionada: {
        _id: "",
        codigo: "",
        nombre: "",
        rendimiento: "",
        ingredientes: [],
        disponible: true,
      },
      contadorIngredientes: 0,
      modoModal: "",
      productos: [],
      productosNombres:[],
    };
  },
  watch: {
    modoModal(newVal) {
      if (newVal === 'Agregar') {
        this.generarCodigo();
      }
    }
  },
  computed: {
    errorDialogTitle() {
      return this.modoModal === "Agregar" ? "Error al agregar Receta" : "Error al modificar Receta";
    },
    errorDialogText() {
      return this.modoModal === "Agregar"
        ? "Ha ocurrido un error al agregar la receta:"
        : "Ha ocurrido un error al modificar la receta:";
    },
    disponibilidadTextoRecetaSeleccionada() {
      return this.RecetaSeleccionada.disponible ? 'Disponible' : 'No disponible';
    },
    disponibilidadTextoNuevaReceta() {
      return this.nuevaReceta.disponible ? 'Disponible' : 'No disponible';
    }
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get("http://localhost:3000/api/receta");
        console.log("Data:", response.data);
        this.recetas = response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    addIngredient() {
      if (this.modoModal === "Agregar") {
        this.nuevaReceta.ingredientes.push({
          nombre: "",
          cantidad: "",
          unidad: "",
        });
      } else if (this.modoModal === "Modificar") {
        this.RecetaSeleccionada.ingredientes.push({
          nombre: "",
          cantidad: "",
          unidad: "",
        });
      }
    }, async fetchProductos() {
      try {
        const response = await axios.get("http://localhost:3000/api/producto");
        console.log("Data:", response.data);
        this.productos = response.data;
        this.productosNombre = this.productos.map(producto => producto.nombreProducto);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    removeIngredient(index) {
      if (this.modoModal === "Agregar") {
        this.nuevaReceta.ingredientes.splice(index, 1);
      } else if (this.modoModal === "Modificar") {
        this.RecetaSeleccionada.ingredientes.splice(index, 1);
      }
    },
    async agregarReceta() {
      try {
        if (this.validarRendimiento()) {
          const response = await axios.post(
            "http://localhost:3000/api/receta/register",
            this.nuevaReceta
          );
          console.log("Receta agregada:", response.data);
          // Actualiza la lista de recetas
          this.recetas.push(response.data);
          // Actualiza la lista de recetas
          await this.fetchData();
          this.nuevaReceta = {
            codigo: "",
            nombre: "",
            rendimiento: "",
            ingredientes: [],
            disponible: true,
          };
          // Cierra el diálogo
          this.modoModal = "";
          this.dialogAgregarConfirmacion = false;
          this.dialogAgregar = false;
        } else {
          console.error(
            "El rendimiento no coincide con la suma de las cantidades de los ingredientes"
          );
          this.dialogAgregarError = true;
        }
      } catch (error) {
        this.modoModal = "Agregar";
        this.dialogAgregarError = true;
        console.error("Error al agregar receta:", error);
      }
    },
    // validarRendimiento() {
    //   if (this.modoModal === "Agregar") {
    //     const sumaCantidades = this.nuevaReceta.ingredientes.reduce(
    //       (acc, ingrediente) => {
    //         return acc + parseFloat(ingrediente.cantidad);
    //       },
    //       0
    //     );
    //     return parseInt(this.nuevaReceta.rendimiento) === sumaCantidades;
    //   } else {
    //     const sumaCantidades = this.RecetaSeleccionada.ingredientes.reduce(
    //       (acc, ingrediente) => {
    //         return acc + parseFloat(ingrediente.cantidad);
    //       },
    //       0
    //     );
    //     return parseInt(this.RecetaSeleccionada.rendimiento) === sumaCantidades;
    //   }
    // },
    async detalleReceta(i) {
      const response = await axios.get(
        "http://localhost:3000/api/receta/" + i._id
      );
      console.log("Receta:", response.data);
      this.RecetaSeleccionada = response.data;
    },
    async modificarReceta(i) {
      try {
          const response = await axios.put(
            "http://localhost:3000/api/receta/" + i._id,
            this.RecetaSeleccionada
          );
          console.log("Receta modificada:", response.data);
          await this.fetchData();
          this.modoModal = "";
          this.dialogAgregarConfirmacion = false;
          this.dialogAgregar = false;
      } catch (error) {
        this.modoModal = "Modificar";
        this.dialogAgregarError = true;
        console.error("Error al agregar receta:", error);
      }
    },
    async deshabilitarReceta(i) {
      try {
        const response = await axios.patch(
          "http://localhost:3000/api/receta/" + i._id + "/unavailable"
        );
        console.log(response.data.msg);
        await this.fetchData();
        this.dialogCambioDisponible = false;
      } catch (error) {
        console.error("Error al deshabilitar receta:", error);
      }
    },
    async habilitarReceta(i) {
      try {
        const response = await axios.patch(
          "http://localhost:3000/api/receta/" + i._id + "/available"
        );
        console.log(response.data.msg);
        await this.fetchData();
        this.dialogCambioDisponible = false;
      } catch (error) {
        console.error("Error al habilitar receta:", error);
      }
    },

    async exportToExcel() {
      axios
        .get("http://localhost:3000/api/receta/export-excel", {
          responseType: "blob",
        }) // Indicar que esperamos una respuesta de tipo blob
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data])); // Crear una URL para el blob
          const link = document.createElement("a"); // Crear un enlace
          link.href = url;
          link.setAttribute("download", "recetas.xlsx"); // Establecer el nombre del archivo
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
        .get("http://localhost:3000/api/receta/export-pdf", {
          responseType: "blob",
        })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "recetas.pdf");
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          console.error("Error al exportar a PDF:", error);
        });
    },
    generarCodigo() {
      const codigos = this.recetas.map(receta => parseInt(receta.codigo, 10));
      const maxCodigo = Math.max(...codigos);
      const nuevoCodigo = (maxCodigo + 1).toString().padStart(3, '0');
      this.nuevaReceta.codigo = nuevoCodigo;
    },
    validatePositiveNumber(value, model) {
    const regex = /^\d*\.?\d*$/; // Permite solo números y punto decimal
    if (!regex.test(value)) {
      model = value.slice(0, -1);
      return model;
    }
    return value;
    },
  },
  mounted() {
    this.fetchData(),
    this.fetchProductos();
  },
};
</script>

<style>
.container-tabla-recetas {
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

.container-ingredientes {
  max-height: 300px;
  /* Altura máxima del contenedor */
  overflow-y: auto;
  /* Habilitar scroll vertical */
  overflow-x: hidden;
  /* Deshabilitar scroll horizontal */
  margin: 10px;
  padding: 20px;
  border: 1px solid #ccc;
  /* Opcional: añadir borde */
  border-radius: 4px;
  /* Opcional: añadir borde redondeado */
  background-color: #f9f9f9;
  /* Opcional: añadir color de fondo */
}
</style>