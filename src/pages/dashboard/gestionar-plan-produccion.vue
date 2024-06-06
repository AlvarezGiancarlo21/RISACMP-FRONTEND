<template> 
    <v-row class="d-flex flex-column">
        <v-col>
            <br>
            <h1>Calendario</h1>
            <v-dialog v-model="dialog" max-width="900px" max-height="900px">
                <template v-slot:activator="{ props: activatorProps }">
                    <v-btn color="success" class="text-none font-weight-regular" prepend-icon="mdi-plus" 
                    @click="dialog=true" v-bind="activatorProps">
                        Registrar
                    </v-btn>
                </template>
                <v-card>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                            <p class="text-left font-weight-bold">Orden de Trabajo: </p>
                            <v-combobox v-model="nuevoEvento.title" cleareable label="Seleccionar Orden de Trabajo" :items="ordenesTrabajo">
                            </v-combobox>
                            <v-text-field label="Fecha y hora Inicio" v-model="nuevoEvento.start"></v-text-field>
                            <v-text-field label="Fecha y hora Final" v-model="nuevoEvento.end"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                            <p class="text-left font-weight-bold">Color: </p>
                            <v-combobox v-model="nuevoEvento.color" label="Seleccionar color"
                                :items="['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1']">
                            </v-combobox>
                            </v-col>
                        </v-row>    
                        <v-row>   
                            <v-col cols="8">
                            </v-col>
                            <v-col cols="2">
                                <v-btn width="300" color="blue" class="text-none font-weight-regular" prepend-icon="mdi-check"
                                    text="GUARDAR" v-bind="activatorProps" @click="agregarEvento">
                                </v-btn>
                            </v-col>
                            <v-col cols="2">
                                <v-btn width="300" color="red" class="text-none font-weight-regular" prepend-icon="mdi-close"
                                    text="CANCELAR" v-bind="activatorProps" @click="limpiarFormulario">
                                </v-btn>
                            </v-col>
                        </v-row> 
                        
                        
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-col>
        <v-col>
            <v-calendar
            ref="calendar"
            v-model="value"
            :events="events"
            :view-mode="type"
            :weekdays="weekday"
            ></v-calendar>
        </v-col>
    </v-row>
</template>

<script>
import axios from 'axios';
import { useDate } from 'vuetify'
import { VCalendar } from 'vuetify/labs/VCalendar'
export default {
components: {
    VCalendar,
},
data () {
    return{
        dialog: false,
        type: 'week',
        weekday: [0, 1, 2, 3, 4, 5, 6],
        value: new Date(),
        events: [],
        ordenesTrabajo: ['jamon','pollo'],
        nuevoEvento: {},
    }
},
methods: {
    initializeNuevoEvento() {
        return {
            title: '',
            start:new Date(''),
            end:new Date(''),
            color:'',
        };
    },
    async fetchData() {
        try {
            const response = await axios.get("http://localhost:3000/api/plan-produccion/get/all");
            console.log("Data:", response.data);
            this.nuevoEvento = this.initializeNuevoEvento();  // Actualizar nuevoEvento después de obtener los ids
            this.events=response.data.map((evento)=>{
                return {
                    ...evento,
                    start: new Date(evento.start),
                    end: new Date(evento.end)
                }
            })
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    },
    async obtenerOrdenTrabajo() {
        try {
            const response = await axios.get("http://localhost:3000/api/ordenTrabajo");
            this.ordenesTrabajo = response.data.map(ordenTrabajo => ordenTrabajo.nombre);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    },
    async agregarEvento() {
        try {
            const response = await axios.post(
            "http://localhost:3000/api/plan-produccion/post",
            this.nuevoEvento
            );
            console.log("Plan produccion agregado:", response.data);
            // Actualiza la lista de proveedores
            // Actualiza la lista de proveedores
            await this.fetchData();
            // Limpia los campos del formulario después de agregar
            // this.headers.push({ key: 'actions', title: 'Acciones', sortable: false})
            this.nuevoEvento = {
                title: '',
                start:'',
                end:'',
                color:'',
            };
            // Cierra el diálogo
            this.dialog= false;
        } catch (error) {
            this.dialog= true;
            console.error("Error al agregar proveedor:", error);
        }
    },

    // agregarEvento(){
    //     this.events.push({
    //         title: this.nuevoEvento.title,
    //         start:new Date(this.nuevoEvento.start),
    //         end:new Date(this.nuevoEvento.end),
    //         color:this.nuevoEvento.color,
    //     })
    //     this.dialog= false;
    //     this.limpiarFormulario();
    // },
    limpiarFormulario() {
        this.nuevoEvento = this.initializeNuevoEvento();
        if (this.$refs.formRef) {
            this.$refs.formRef.reset(); // Resetea validación si es necesaria
        }
        this.dialog = false;
    },
},
mounted() {
    this.fetchData();
}
}
</script>

<style lang="scss" scoped>
</style>