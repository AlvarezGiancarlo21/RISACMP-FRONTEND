<template>
  <v-container>
    <div v-if="dateV" class="d-md-flex justify-space-between">
      <h2>{{ `${months[dateV.getMonth(date)]}, ${dateV.getYear(date)}` }}</h2>
      <v-dialog v-model="dialog" max-width="900">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn color="success" class="text-none font-weight-regular" prepend-icon="mdi-plus" v-bind="activatorProps"
              @click="() => {
                dialog = true;
                modoModal = 'Agregar';
              }">
              AGREGAR
            </v-btn>
          </template>
          <v-card
            :title="modoModal === 'Agregar' ? 'Agregar Produccion' : modoModal === 'Editar' ? 'Editar Produccion' : 'X'"
            class="text-center">
            <v-card-text>
              <v-row dense v-if="modoModal === 'Agregar'">
                <v-col cols="12">
                  <p class="text-left font-weight-bold">Orden de Trabajo: </p>
                  <v-combobox v-model="nuevoTrabajo.ordenTrabajo" cleareable :items="ordenesT">
                  </v-combobox>
                </v-col>
                <v-col cols="6">
                  <p class="text-left font-weight-bold">Dia Inicio: </p>
                  <v-text-field v-model="nuevoTrabajo.fechaInicio" type="date"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <p class="text-left font-weight-bold">Dia Final: </p>
                  <v-text-field v-model="nuevoTrabajo.fechaFin" type="date"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <p class="text-left font-weight-bold">Estado: </p>
                  <v-combobox v-model="nuevoTrabajo.estado" cleareable :items="['Planificado','En progreso','Finalizado']">
                  </v-combobox>
                </v-col>

                <v-col cols="2">
                  <v-btn width="300" color="blue" class="text-none font-weight-regular" prepend-icon="mdi-check"
                    text="GUARDAR" @click="agregarOrdenTrabajo()">
                  </v-btn>
                </v-col>
                <v-col cols="2">
                  <v-btn width="300" color="red" class="text-none font-weight-regular" prepend-icon="mdi-close"
                    text="CANCELAR" @click="limpiarFormulario()">
                  </v-btn>
                </v-col>
              </v-row>

              <v-row dense v-if="modoModal === 'Editar'">
                <v-col cols="12">
                  <p class="text-left font-weight-bold">Orden de Trabajo: </p>
                  <v-combobox v-model="trabajoSeleccionado.ordenTrabajo" cleareable :items="ordenesT" disabled>
                  </v-combobox>
                </v-col>
                <v-col cols="6">
                  <p class="text-left font-weight-bold">Dia Inicio: </p>
                  <v-text-field v-model="trabajoSeleccionado.fechaInicio" type="date"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <p class="text-left font-weight-bold">Dia Final: </p>
                  <v-text-field v-model="trabajoSeleccionado.fechaFin" type="date"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <p class="text-left font-weight-bold">Estado: </p>
                  <v-combobox v-model="trabajoSeleccionado.estado" cleareable :items="['Planificado','En progreso','Finalizado']">
                  </v-combobox>
                </v-col>

                <v-col cols="2">
                  <v-btn width="300" color="blue" class="text-none font-weight-regular" prepend-icon="mdi-check"
                    text="GUARDAR" @click="editarTrabajoSeleccionado(trabajoSeleccionado)">
                  </v-btn>
                </v-col>

                <v-col cols="2">
                  <v-btn width="300" color="orange" class="text-none font-weight-regular" prepend-icon="mdi-delete"
                    text="ELIMINAR" @click="eliminarPlan(trabajoSeleccionado)">
                  </v-btn>
                </v-col>

                <v-col cols="2">
                  <v-btn width="300" color="red" class="text-none font-weight-regular" prepend-icon="mdi-close"
                    text="CANCELAR" @click="limpiarFormulario()">
                  </v-btn>
                </v-col>

              </v-row>
            </v-card-text>
          </v-card>

      </v-dialog>
    </div>
    
    <v-data-table :headers="headers" :items="trabajos" item-key="ordenTrabajo" hide-default-footer>
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.ordenTrabajo }}</td>
          <td v-for="header in headers.slice(1)" :key="header.key">
            <v-sheet v-if="item.dias.includes(parseInt(header.key))" class="h-100 w-100" :color="item.color" 
            @click="()=>{
              verTrabajoSeleccionado(item);modoModal='Editar'; dialog=true
              }"></v-sheet>
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
      months: [
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

      dialog:false,
      modoModal:'',
      ordenesT:['1','2','3'],

      nuevoTrabajo:{},
      trabajoSeleccionado:{
        orden:'',
        dias:[],
        color:'',
        estado:'',
        fechaInicio:'',
        fechaFin:''
      },
      
      date: new Date(),
      dateV: null,
      weeks: useDate().getWeekArray(new Date()),

      headers: [
        { key: "ordenTrabajo", title: "Orden de Trabajo", align: "left" },
      ], // Los dias se agregan segun el mes 'obtenerDiasMes()'
      trabajos:[],
    };
  },
  methods: {   
    initializeNuevoTrabajo() {
      return {
        ordenTrabajo: '',
        dias: [],
        color:'',
        fechaInicio:'',
        fechaFin:'',
        estado:''
      };
    },
    //Prepara el array dias segun la fecha de inicio y fin 
    diasCalendario(fechaInicio,fechaFin){
      const date = this.dateV
      const fechaI = date.getDate(new Date(`${fechaInicio}T00:00:00`))
      const fechaF = date.getDate(new Date(`${fechaFin}T00:00:00`))

      if(fechaF-fechaI<0) throw new Exception('La fecha de fin no puede ser menor que la fecha de inicio')

      let diasC=[]
      let j=0

      for(let i=fechaI;i<=fechaF;i++){ diasC[j]=i;j++}

      return diasC
    },
    estados(e){
      if(e=='Planificado'){
        return 'blue'
      }
      if(e=='En progreso'){
        return 'orange'
      }
      if(e=='Finalizado'){
        return 'green'
      }
    },
    async agregarOrdenTrabajo() {
      try {
        //Agrega en el arreglo dias la lista de dias seleccionadas por inicio y fin de fecha
        this.nuevoTrabajo.dias=this.diasCalendario(this.nuevoTrabajo.fechaInicio,this.nuevoTrabajo.fechaFin);
        this.nuevoTrabajo.color=this.estados(this.nuevoTrabajo.estado)
        const response = await axios.post('http://localhost:3000/api/plan-produccion/post',
          this.nuevoTrabajo
        );
        this.nuevoTrabajo={
          orden: '',
          dias: [],
          color:'',
          fechaInicio:'',
          fechaFin:'',
          estado: ''
        }
        console.log('Orden de compra agregada:', response.data);
        this.trabajos.push(response.data);
        await this.fetchData();
        this.limpiarFormulario();
      } catch (error) {
        console.error('Error al agregar orden:', error);
        this.modoModal = 'Agregar';
      }
    },
    limpiarFormulario() {
      this.nuevoTrabajo = this.initializeNuevoTrabajo();
      this.trabajoSeleccionado = this.initializeNuevoTrabajo();
      this.dialog = false;
      this.modoModal = '';
    },
    async fetchData(){
      try {
        const response = await axios.get("http://localhost:3000/api/plan-produccion/get/all");
        console.log("Data:", response.data);
        this.trabajos = response.data

        this.nuevoTrabajo = this.initializeNuevoTrabajo();  // Actualizar nuevaOrden después de obtener los ids
        console.log(this.ids);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    async verTrabajoSeleccionado(i){
      const response = await axios.get(
        "http://localhost:3000/api/plan-produccion/get/" + i._id
      );
      console.log("Orden selecionada:", response.data);
      response.data.fechaInicio = this.formatearFecha(response.data.fechaInicio);
      response.data.fechaFin = this.formatearFecha(response.data.fechaFin);

      this.trabajoSeleccionado = response.data;
    },

    async editarTrabajoSeleccionado(i){
      try {
        this.trabajoSeleccionado.dias=this.diasCalendario(this.trabajoSeleccionado.fechaInicio,this.trabajoSeleccionado.fechaFin);
        this.trabajoSeleccionado.color=this.estados(this.trabajoSeleccionado.estado)
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

    async eliminarPlan(i){
      try {
        await axios.delete(`http://localhost:3000/api/plan-produccion/delete/${i._id}`);
        alert('Plan eliminado');
        this.dialog = false;
        this.modoModal = '';
        this.fetchData();
      } catch (error) {
        alert('No se pudo eliminar el plan');
        console.error('Error al eliminar el plan:', error);
      }
    },

    obtenerDiasMes() {
      const date = this.dateV;

      for (let i = 0; i < this.weeks.length; i++) {
        for (let j = 0; j < this.weeks[i].length; j++) {
          let nuevaFecha = {
            key: "",
            title: "",
            align: "center",
            sortable: false,
          };

          let mesActual = date.getMonth(new Date()) + 1;
          let mesRecibido = date.getMonth(this.weeks[i][j]) + 1;

          if (mesRecibido == mesActual) {
            nuevaFecha.key = date.getDate(this.weeks[i][j]);
            nuevaFecha.title = date.getDate(this.weeks[i][j]);

            this.headers.push(nuevaFecha);
          }
        }
      }
    },

    formatearFecha(fecha) {
      const date = new Date(fecha);
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    
  },
  mounted() {
    this.dateV = useDate();
    this.weeks = this.dateV.getWeekArray(new Date());
    this.weekDays = this.dateV.getWeekdays();
    this.obtenerDiasMes();
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
