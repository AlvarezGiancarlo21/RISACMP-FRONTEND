<template>
  <v-container class="mt-10">
    <div v-if="dateV" class="d-md-flex justify-space-between">
      <div class="d-flex align-center jusitfy-center md-4">
        <v-btn
          @click="cambiarMes(-1)"
          icon="mdi-chevron-left"
          size="small"
        ></v-btn>
        <h2 class="d-flex ma-2">{{ `${mesVista}, ${yearVista}` }}</h2>
        <v-btn
          @click="cambiarMes(1)"
          icon="mdi-chevron-right"
          size="small"
        ></v-btn>
      </div>

      <v-dialog v-model="dialog" max-width="900">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            color="success"
            class="text-none font-weight-regular"
            prepend-icon="mdi-plus"
            v-bind="activatorProps"
            @click="
              () => {
                getOrdenesTrabajo();
                dialog = true;
                modoModal = 'Agregar';
              }
            "
          >
            AGREGAR
          </v-btn>
        </template>
        <v-card
          :title="
            modoModal === 'Agregar'
              ? 'Agregar Produccion'
              : modoModal === 'Editar'
              ? 'Editar Produccion'
              : 'X'
          "
          class="text-center"
        >
          <v-card-text>
            <v-row dense v-if="modoModal === 'Agregar'">














              <v-col cols="12" sm="12">
                    <v-select v-model="nuevoTrabajo.ordenTrabajo" :items="ordenesTrabajo" label="Orden de Trabajo*" required item-title="codigo_Orden"
                      item-value="id"></v-select>
                  </v-col>













              <v-col cols="6">
                <p class="text-left font-weight-bold">Dia Inicio:</p>
                <!-- <v-text-field
                  v-model="nuevoTrabajo.fechaInicio"
                  type="date"
                ></v-text-field> -->

                <!-- Es el "input" para escoger la fecha de inicio -->
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-title expand-icon="mdi-calendar"
                      >{{ formatearFechaDate(nuevoTrabajo.fechaInicio) }}
                    </v-expansion-panel-title>

                    <v-expansion-panel-text>
                      <v-date-picker
                        v-model="nuevoTrabajo.fechaInicio"
                        :allowed-dates="allowedDates"
                      >
                        <template v-slot:title>
                          <!-- Deja este espacio en blanco para ocultar el título -->
                        </template>
                      </v-date-picker>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>


              <v-col cols="6">
                <p class="text-left font-weight-bold">Dia Final:</p>
                <!-- <v-text-field
                  v-model="nuevoTrabajo.fechaFin"
                  type="date"
                ></v-text-field> -->

                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-title expand-icon="mdi-calendar"
                      >{{ formatearFechaDate(nuevoTrabajo.fechaFin) }}
                    </v-expansion-panel-title>

                    <v-expansion-panel-text>
                      <v-date-picker
                        v-model="nuevoTrabajo.fechaFin"
                        :allowed-dates="allowedDates"
                      >
                        <template v-slot:title>
                          <!-- Deja este espacio en blanco para ocultar el título -->
                        </template>
                      </v-date-picker>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
              <v-col cols="12">
                <p class="text-left font-weight-bold">Estado:</p>
                <v-combobox
                  v-model="nuevoTrabajo.estado"
                  cleareable
                  :items="['EN ESPERA']"
                >
                </v-combobox>
              </v-col>

              <v-col cols="2">
                <v-btn
                  width="300"
                  color="blue"
                  class="text-none font-weight-regular"
                  prepend-icon="mdi-check"
                  text="GUARDAR"
                  @click="agregarOrdenTrabajo()"
                >
                </v-btn>
              </v-col>
              <v-col cols="2">
                <v-btn
                  width="300"
                  color="red"
                  class="text-none font-weight-regular"
                  prepend-icon="mdi-close"
                  text="CANCELAR"
                  @click="limpiarFormulario()"
                >
                </v-btn>
              </v-col>
            </v-row>

            <v-row dense v-if="modoModal === 'Editar'">
              <v-col cols="12">
                <p class="text-left font-weight-bold">Orden de Trabajo:</p>
                <v-combobox
                  v-model="trabajoSeleccionado.ordenTrabajo"
                  cleareable
                  :items="ordenesT"
                  disabled
                >
                </v-combobox>
              </v-col>
              <v-col cols="6">
                <p class="text-left font-weight-bold">Dia Inicio:</p>
                <!-- Es el "input" para escoger la fecha de inicio -->
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-title expand-icon="mdi-calendar"
                      >{{ formatearFechaDate(trabajoSeleccionado.fechaInicio) }}
                    </v-expansion-panel-title>

                    <v-expansion-panel-text>
                      <v-date-picker
                        v-model="trabajoSeleccionado.fechaInicio"
                        :allowed-dates="allowedDates"
                      >
                        <template v-slot:title>
                          <!-- Deja este espacio en blanco para ocultar el título -->
                        </template>
                      </v-date-picker>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
              <v-col cols="6">
                <p class="text-left font-weight-bold">Dia Final:</p>
                <!-- Es el "input" para escoger la fecha de inicio -->
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-title expand-icon="mdi-calendar"
                      >{{ formatearFechaDate(trabajoSeleccionado.fechaFin) }}
                    </v-expansion-panel-title>

                    <v-expansion-panel-text>
                      <v-date-picker
                        v-model="trabajoSeleccionado.fechaFin"
                        :allowed-dates="allowedDates"
                      >
                        <template v-slot:title>
                          <!-- Deja este espacio en blanco para ocultar el título -->
                        </template>
                      </v-date-picker>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
              <v-col cols="12">
                <p class="text-left font-weight-bold">Estado:</p>
                <v-combobox
                  v-model="trabajoSeleccionado.estado"
                  cleareable
                  :items="['Planificado', 'EN ESPERA', 'FINALIZADA']"
                >
                </v-combobox>
              </v-col>

              <v-col cols="2">
                <v-btn
                  width="300"
                  color="blue"
                  class="text-none font-weight-regular"
                  prepend-icon="mdi-check"
                  text="GUARDAR"
                  @click="editarTrabajoSeleccionado(trabajoSeleccionado)"
                >
                </v-btn>
              </v-col>

              <v-col cols="2">
                <v-btn
                  width="300"
                  color="orange"
                  class="text-none font-weight-regular"
                  prepend-icon="mdi-delete"
                  text="ELIMINAR"
                  @click="eliminarPlan(trabajoSeleccionado)"
                >
                </v-btn>
              </v-col>

              <v-col cols="2">
                <v-btn
                  width="300"
                  color="red"
                  class="text-none font-weight-regular"
                  prepend-icon="mdi-close"
                  text="CANCELAR"
                  @click="limpiarFormulario()"
                >
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>

    <v-data-table
      :headers="headers"
      :items="trabajos"
      item-key="ordenTrabajo"
      hide-default-footer
      items-per-page="-1"
      class="mt-6"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.ordenTrabajo }}</td>
          <td v-for="header in headers.slice(1)" :key="header.key">
            <v-sheet
              v-if="item.dias.includes(parseInt(header.key))"
              class="h-100 w-100 cursor-pointer"
              :color="item.color"
              @click="
                () => {
                  verTrabajoSeleccionado(item);
                  modoModal = 'Editar';
                  dialog = true;
                }
              "
            ></v-sheet>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { useDate, createVuetify } from "vuetify";
import axios from "axios";
import * as servicios from '../../services/s_ordenesTrabajos';

import DayJsAdapter from "@date-io/dayjs"; //en consola: npm install @date-io/dayjs dayjs

createVuetify({
  date: {
    adapter: DayJsAdapter,
  },
});

export default {
  data() {
    return {
      meses: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ],

      trabajosT: null,

      dialog: false,
      modoModal: "",
      ordenesT: [],

      nuevoTrabajo: {},
      trabajoSeleccionado: {
        orden: "",
        dias: [],
        color: "",
        estado: "",
        fechaInicio: null,
        fechaFin: null,
      },

      fechaVista: null,
      mesVista: "",
      yearVista: "",
      dateV: null,
      ordenesTrabajo:[],

      headers: [], // Los dias se agregan segun el mes 'obtenerDiasMes()'
      trabajos: [],
    };
  },
  methods: {
    initializeNuevoTrabajo() {
      return {
        ordenTrabajo: "",
        dias: [],
        color: "",
        fechaInicio: null,
        fechaFin: null,
        estado: "",
      };
    },
    allowedDates(val) {
      if (!this.trabajosT || this.trabajosT.length === 0) {
        return true; // Permite todas las fechas si trabajosT está vacío o es null
      }

      if (val >= this.trabajoSeleccionado.fechaInicio && val <= this.trabajoSeleccionado.fechaFin) {
        return true;
      }

      for (const rango of this.trabajosT) {
        const inicio = new Date(rango.fechaInicio);
        const fin = new Date(rango.fechaFin);

        // Si la fecha val está dentro del rango de fechas, retorna false
        if (val >= inicio && val <= fin) {
          return false;
        }
      }

      
      
      // Si no está dentro de ningún rango, retorna true
      return true;
    },
    //Prepara el array dias segun la fecha de inicio y fin
    diasCalendario(fechaInicio, fechaFin) {
      const diaInicio = fechaInicio.getUTCDate();
      const diaFin = fechaFin.getUTCDate();

      const mesInicio = fechaInicio.getUTCMonth();
      const mesFin = fechaFin.getUTCMonth();

      if (mesInicio != mesFin) {
        throw new Error(
          "Las fechas de inicio y fin deben estar en el mismo mes"
        );
      }

      if (diaFin - diaInicio < 0) {
        throw new Error(
          "La fecha de fin no puede ser menor que la fecha de inicio"
        );
      }

      let diasC = [];
      let j = 0;
      for (let i = diaInicio; i <= diaFin; i++) {
        diasC[j] = i;
        j++;
      }
      return diasC;
    },
    estados(e) {
      if (e == "Planificado") {
        return "blue";
      }
      if (e == "EN ESPERA") {
        return "orange";
      }
      if (e == "FINALIZADA") {
        return "green";
      }
    },

    async fetchData() {
      this.obtenerDiasMes();
      try {
        const response = await axios.get(
          "http://localhost:3000/api/plan-produccion/get/all"
        );
        // console.log("Data:", response.data);
        this.trabajosT = response.data;
        this.trabajos = response.data.filter(this.filtrarTrabajosEnVistaActual); //Solo debe añadir al array trabajos[] los trabajos que estan en el mes de vista actual
        this.trabajos.sort(
          (a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)
        );
        console.log(this.trabajos);
        // this.mostrarTrabajosFechaVista(response.data)
        // this.trabajos = response.data;
        //   this.comprobarIgualdad();
        this.nuevoTrabajo = this.initializeNuevoTrabajo(); // Actualizar nuevaOrden después de obtener los ids
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    filtrarTrabajosEnVistaActual(returnedData) {
      const fechaRI = new Date(returnedData.fechaInicio);
      const fechaRF = new Date(returnedData.fechaFin);
      // console.log(`${fechaRI} - ${this.fechaVista}`)
      // console.log(fechaRI.getUTCMonth() != this.fechaVista.getUTCMonth())
      // console.log(fechaRF.getUTCMonth() != this.fechaVista.getUTCMonth())

      //Solo debe añadir al array trabajos[] los trabajos que estan en el mes de vista actual
      if (
        fechaRI.getUTCMonth() === this.fechaVista.getUTCMonth() ||
        fechaRF.getUTCMonth() === this.fechaVista.getUTCMonth()
      ) {
        return true;
      } else return false;
    },
    async agregarOrdenTrabajo() {
      try {
        //Agrega en el arreglo dias la lista de dias seleccionadas por inicio y fin de fecha
        this.nuevoTrabajo.dias = this.diasCalendario(
          this.nuevoTrabajo.fechaInicio,
          this.nuevoTrabajo.fechaFin
        );
        this.nuevoTrabajo.color = this.estados(this.nuevoTrabajo.estado);
        const response = await axios.post(
          "http://localhost:3000/api/plan-produccion/post",
          this.nuevoTrabajo
        );
        this.nuevoTrabajo = {
          orden: "",
          dias: [],
          color: "",
          fechaInicio: "",
          fechaFin: "",
          estado: "",
        };
        console.log("Orden de compra agregada:", response.data);
        this.trabajos.push(response.data);
        await this.fetchData();
        this.limpiarFormulario();
      } catch (error) {
        alert(`Error al agregar orden: ${error.message}`);
        this.modoModal = "Agregar";
      }
    },
    limpiarFormulario() {
      this.nuevoTrabajo = this.initializeNuevoTrabajo();
      this.trabajoSeleccionado = this.initializeNuevoTrabajo();
      this.dialog = false;
      this.modoModal = "";
    },

    async verTrabajoSeleccionado(i) {
      const response = await axios.get(
        "http://localhost:3000/api/plan-produccion/get/" + i._id
      );
      console.log("Orden selecionada:", response.data);
      response.data.fechaInicio = new Date(response.data.fechaInicio)
      
      response.data.fechaFin = new Date(response.data.fechaFin)

      this.trabajoSeleccionado = response.data;
    },

    async editarTrabajoSeleccionado(i) {
      try {
        this.trabajoSeleccionado.dias = this.diasCalendario(
          this.trabajoSeleccionado.fechaInicio,
          this.trabajoSeleccionado.fechaFin
        );
        this.trabajoSeleccionado.color = this.estados(
          this.trabajoSeleccionado.estado
        );
        const response = await axios.put(
          "http://localhost:3000/api/plan-produccion/" + i._id,
          this.trabajoSeleccionado
        );
        console.log("Plan modificado:", response.data);
        await this.fetchData();
        this.dialog = false;
        this.modoModal = "";
      } catch (error) {
        this.modoModal = "Editar";
        this.dialogAgregarConfirmacion = true;
        console.error("Error al editar Plan:", error);
      }
    },

    async eliminarPlan(i) {
      try {
        await axios.delete(
          `http://localhost:3000/api/plan-produccion/delete/${i._id}`
        );
        alert("Plan eliminado");
        this.dialog = false;
        this.modoModal = "";
        this.fetchData();
      } catch (error) {
        alert("No se pudo eliminar el plan");
        console.error("Error al eliminar el plan:", error);
      }
    },

    async getOrdenesTrabajo() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/orden_trabajo/get/all"
        );
        console.log(response.data);
        this.ordenesT = response.data;
      } catch (e) {
        console.log(e);
      }
    },

    obtenerDiasMes() {
      const date = this.dateV;
      const weeks = date.getWeekArray(this.fechaVista);
      const mesVista = date.getMonth(this.fechaVista) + 1;

      const diasMes = [];

      for (let i = 0; i < weeks.length; i++) {
        for (let j = 0; j < weeks[i].length; j++) {
          let nuevaFecha = {
            key: "",
            title: "",
            align: "center",
            sortable: false,
          };
          let mesRecibido = date.getMonth(weeks[i][j]) + 1;

          if (mesRecibido == mesVista) {
            nuevaFecha.key = date.getDate(weeks[i][j]);
            nuevaFecha.title = date.getDate(weeks[i][j]);

            diasMes.push(nuevaFecha);
          }
        }
      }
      this.headers = [
        { key: "ordenTrabajo", title: "Orden de Trabajo", align: "left" },
      ];
      this.headers = this.headers.concat(diasMes);
      this.mesVista = this.meses[date.getMonth(this.fechaVista)];
      this.yearVista = date.getYear(this.fechaVista);
    },

    formatearFecha(fecha) {
      const date = new Date(fecha);
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const day = String(date.getUTCDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    formatearFechaDate(fecha) {
      if (fecha) {
        const year = fecha.getUTCFullYear();
        const month = String(fecha.getUTCMonth() + 1).padStart(2, "0");
        const day = String(fecha.getUTCDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      } else return `Selecciona una fecha`;
    },

    cambiarMes(switcher) {
      const date = this.dateV;
      this.fechaVista = date.addMonths(this.fechaVista, switcher);
      this.mesVista = date.getMonth(this.fechaVista) + 1;
      this.fetchData();
    },

    initVista() {
      const date = this.dateV;
      this.fechaVista = new Date();
      this.mesVista = date.getMonth(this.fechaVista) + 1;
      this.yearVista = date.getYear(this.fechaVista);

      this.obtenerDiasMes();
    },





    async obtenerOrdenesTrabajo() {
      try {
      const ordenes = await servicios.obtenerOrdenesTrabajo();
      this.ordenesTrabajo = ordenes.map(orden => ({
        id: orden._id,
        codigo_Orden: orden.codigo_Orden
      }));
      console.log(this.ordenesTrabajo);
    }
      
      catch (error) {
        this.errorMessage = error.message;
        this.isAlertVisible = true;
      }
    },







  },
  mounted() {
    this.dateV = useDate();
    this.trabajosT = [];
    this.initVista();
    this.fetchData();
    this.obtenerOrdenesTrabajo();
  },
};
</script>

<style lang="scss" scoped>
.v-table .v-table__wrapper table tbody tr td {
  padding: 10px 0 10px 0;
}

.v-table .v-table__wrapper table tbody tr th {
  padding: 0;
}
</style>
