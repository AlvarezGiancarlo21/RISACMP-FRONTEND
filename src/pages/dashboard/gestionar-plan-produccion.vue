<template>
    <v-container class="mt-10">
      <div v-if="dateV" class="d-md-flex justify-space-between">
        <div class="d-flex align-center jusitfy-center md-4">
          <v-btn @click="restarUnMes()" icon="mdi-chevron-left" size="small"></v-btn>
          <h2 class="d-flex ma-2">{{ `${mesVista}, ${yearVista}` }}</h2>
          <v-btn @click="sumarUnMes()" icon="mdi-chevron-right" size="small"></v-btn>
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
                <v-col cols="12">
                  <p class="text-left font-weight-bold">Orden de Trabajo:</p>
                  <v-combobox
                    v-model="nuevoTrabajo.ordenTrabajo"
                    cleareable
                    :items="ordenesT.map((orden) => orden.nombre_producto)"
                  >
                  </v-combobox>
                </v-col>
                <v-col cols="6">
                  <p class="text-left font-weight-bold">Dia Inicio:</p>
                  <v-text-field
                    v-model="nuevoTrabajo.fechaInicio"
                    type="date"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <p class="text-left font-weight-bold">Dia Final:</p>
                  <v-text-field
                    v-model="nuevoTrabajo.fechaFin"
                    type="date"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <p class="text-left font-weight-bold">Estado:</p>
                  <v-combobox
                    v-model="nuevoTrabajo.estado"
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
                  <v-text-field
                    v-model="trabajoSeleccionado.fechaInicio"
                    type="date"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <p class="text-left font-weight-bold">Dia Final:</p>
                  <v-text-field
                    v-model="trabajoSeleccionado.fechaFin"
                    type="date"
                  ></v-text-field>
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
  import { useDate } from "vuetify";
  import axios from "axios";
  
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
  
        dialog: false,
        modoModal: "",
        ordenesT: [],
  
        nuevoTrabajo: {},
        trabajoSeleccionado: {
          orden: "",
          dias: [],
          color: "",
          estado: "",
          fechaInicio: "",
          fechaFin: "",
        },
  
        fechaVista: null,
        mesVista: "",
        yearVista: "",
        dateV: null,
  
        headers: [], // Los dias se agregan segun el mes 'obtenerDiasMes()'
        trabajos: [], 
        diasIniciales:[],
        diasFinales:[],
        mes:[],
      };
    },
    methods: {
      initializeNuevoTrabajo() {
        return {
          ordenTrabajo: "",
          dias: [],
          color: "",
          fechaInicio: "",
          fechaFin: "",
          estado: "",
        };
      },
      //Prepara el array dias segun la fecha de inicio y fin
      diasCalendario(fechaInicio, fechaFin) {
        const fechaI = new Date(`${fechaInicio}T00:00:00Z`);
        const fechaF = new Date(`${fechaFin}T00:00:00Z`);
  
        const diaInicio = fechaI.getUTCDate();
        const diaFin = fechaF.getUTCDate();
        const inicioMes = fechaI.getUTCMonth() + 1;
        if (diaFin - diaInicio < 0) {
          throw new Error(
            "La fecha de fin no puede ser menor que la fecha de inicio"
          );
        }
        // for (let j = 0; j < this.diasIniciales.length; j++) {
        //   for (let i = j+1; i < this.diasIniciales.length; i++) {
        //     if (this.mes[j] === this.mes[i]) {
        //         if ((this.diasIniciales[j] === this.diasIniciales[i]||this.diasIniciales[j] < this.diasIniciales[i]) && (this.diasIniciales[i] < this.diasFinales[j]||this.diasIniciales[i]===this.diasFinales[j])) 
        //         {
        //           throw new Error(
        //             "Ya tienes una produccion programada en ese intervalo de fecha"
        //           );
        //         }
        //     }
        //   }
        // }
        // for (let j = 0; j < this.diasIniciales.length; j++) {
        //   for (let i = j+1; i < this.diasIniciales.length; i++) {
        //     if (this.mes[j] === this.mes[i]) {
        //         if (this.diasIniciales[i] < this.diasIniciales[j] && this.diasIniciales[j] < this.diasFinales[i]) 
        //         {
        //           throw new Error(
        //             "Ya tienes una produccion programada en ese intervalo de fecha"
        //           )                
        //         }
        //     }
        //   }
        // }
        this.diasIniciales.push(diaInicio);
        this.diasFinales.push(diaFin);
        this.mes.push(inicioMes);
        let diasC = [];
        let j = 0;
        for (let i = diaInicio; i <= diaFin; i++) {
          diasC[j] = i;
          j++;
        }
        return diasC;
      },
    //   comprobarIgualdad(){
    //     for (let j = 0; j < this.diasIniciales.length; j++) {
    //       for (let i = j+1; i < this.diasIniciales.length; i++) {
    //         if (this.mes[j] === this.mes[i]) {
    //             if ((this.diasIniciales[j] === this.diasIniciales[i]||this.diasIniciales[j] < this.diasIniciales[i]) && (this.diasIniciales[i] < this.diasFinales[j]||this.diasIniciales[i]===this.diasFinales[j])) 
    //             {
    //               throw new Error(
    //                 "Ya tienes una produccion programada en ese intervalo de fecha"
    //               );
    //             }
    //         }
    //       }
    //     }
    //     for (let j = 0; j < this.diasIniciales.length; j++) {
    //       for (let i = j+1; i < this.diasIniciales.length; i++) {
    //         if (this.mes[j] === this.mes[i]) {
    //             if (this.diasIniciales[i] < this.diasIniciales[j] && this.diasIniciales[j] < this.diasFinales[i]) 
    //             {
    //               throw new Error(
    //                 "Ya tienes una produccion programada en ese intervalo de fecha"
    //               )                
    //             }
    //         }
    //       }
    //     }
    //   },
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
        this.obtenerDiasMes()
        try {
          const response = await axios.get(
            "http://localhost:3000/api/plan-produccion/get/all"
          );
          console.log("Data:", response.data);
  
          this.trabajos = response.data.filter((trabajo) => {
            const inicio = new Date(trabajo.fechaInicio);
            const fin = new Date(trabajo.fechaFin);
            const diaInicio = inicio.getUTCDate();
            const diaFin = fin.getUTCDate();
            this.diasIniciales.push(diaInicio);
            this.diasFinales.push(diaFin);
            
            // Año y mes de inicio y fin
            const inicioAno = inicio.getUTCFullYear();
            const inicioMes = inicio.getUTCMonth() + 1; // getUTCMonth es cero-indexado
            const finAno = fin.getUTCFullYear();
            const finMes = fin.getUTCMonth() + 1; // getUTCMonth es cero-indexado
            this.mes.push(inicioMes);
            // Filtrar solo trabajos de junio de 2024
            return (
              inicioAno === this.dateV.getYear(this.fechaVista) &&
              inicioMes === this.dateV.getMonth(this.fechaVista)+1 &&
              finAno === this.dateV.getYear(this.fechaVista) &&
              finMes === this.dateV.getMonth(this.fechaVista)+1
            );
          });
  
          // this.mostrarTrabajosFechaVista(response.data)
          // this.trabajos = response.data;
        //   this.comprobarIgualdad();
          console.log(this.mes);
          console.log(this.diasIniciales)
          console.log(this.diasFinales)
          this.nuevoTrabajo = this.initializeNuevoTrabajo(); // Actualizar nuevaOrden después de obtener los ids
          console.log(this.ids);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
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
        response.data.fechaInicio = this.formatearFecha(
          response.data.fechaInicio
        );
        response.data.fechaFin = this.formatearFecha(response.data.fechaFin);
  
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
  
      mostrarTrabajosFechaVista(allTrabajos) {
        const date = this.dateV;
  
        for (let i = 0; i < allTrabajos.length; i++) {
          console.log(`fecha allTrabajos: ${allTrabajos[i].fechaInicio}`);
          console.log(`fecha fechaVista: ${this.fechaVista}`);
        }
      },
  
      async getOrdenesTrabajo(){
        try{
            const response = await axios.get("http://localhost:3000/api/orden_trabajo/get/all")
            console.log(response.data)
            this.ordenesT = response.data

        } catch(e){
            console.log(e)
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
  
      sumarUnMes() {
        const date = this.dateV;
        this.fechaVista = date.addMonths(this.fechaVista, 1);
        this.mesVista = date.getMonth(this.fechaVista) + 1;
        this.fetchData();
      },
      restarUnMes() {
        const date = this.dateV;
        this.fechaVista = date.addMonths(this.fechaVista, -1);
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
    },
    mounted() {
      this.dateV = useDate();
      this.initVista();
      this.fetchData();
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
