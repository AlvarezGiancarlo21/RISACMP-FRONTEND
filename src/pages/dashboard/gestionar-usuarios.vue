<template>
  <div>
    <v-card class="card" style="margin: 80px auto 0; width: auto;height:120%;">
      <v-card-title> Gestionar Usuarios </v-card-title>
      <div class="d-flex justify-center align-center">
      <v-data-table
        :headers="headersTableUsuario"
        :items="usuarios"
        :search="search"
        :options="tableOptions"
        :items-per-page="5"
        loading-text="Cargando. Por favor, espere un momento..."
        no-data-text="No se encontró información del recurso solicitado."
        no-results-text="No se han encontrado resultados para su búsqueda."
        class="elevation-4"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-divider :thickness="20" class="border-opacity-0" vertical></v-divider>
            <v-text-field
              v-model="search"
              label="Buscar usuario especifico"
              single-line
              hide-details
              clearable
              prepend-icon="mdi-account-search-outline"
              variant="outlined"
            ></v-text-field>

            <v-spacer></v-spacer>

            <v-btn
            color="red"
          elevation="2"
          outlined
          dark
          class="text-none font-weight-regular mb-2"
          prepend-icon="mdi-account-multiple-plus-outline"
          text="Registrar Usuario"
          variant="tonal"
              @click="dialogExportarUsuarios=true"
            >
              <span>Exportar</span>
            </v-btn>
            <!----------------------------------------->
            <!--Opciones de exportar-->
            <!----------------------------------------->
            <!--Dialog principal-->
            <v-dialog
              v-model="dialogExportarUsuarios"
              max-width="480"
            >
            <v-card v-card title="Exportar Usuario es formato EXCEL o PDF">
              <template v-slot:text>
                <div class="ma-4">
                  <v-row>
                    <v-col>
                      <v-img
                    :aspect-ratio="1"
                    class="bg-white"
                    src="/src/assets/Gestionar Usuarios/pdf.png"
                    style="height: 100px;width:100px"
                  ></v-img>
                  </v-col>

                    <v-col>
                      <v-img
                      :aspect-ratio="1"
                      class="bg-white"

                      src="/src/assets/Gestionar Usuarios/excel.png"
                      style="height: 100px;width:100px"

                  ></v-img>
                    </v-col>
                  </v-row>


                </div>
                <v-btn
                  class="my-2"
                  text="Exportar en PDF"
                  @click="exportToPDF()"

                ></v-btn>
                <v-btn
                  class="my-2"
                  text="Exportar en EXCEL"
                  @click="exportToExcel()"
                ></v-btn>
              </template>
            <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text="Close"
            variant="text"
            @click="dialogExportarUsuarios = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


            <!------------------------>



            <!--Registrar Nuevo usuario-->
            <div class="pa-4 text-center">
    <v-dialog
      v-model="dialogRegistrarUsuario"
      max-width="680"
    >
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          color="success"
          elevation="2"
          outlined
          dark
          class="text-none font-weight-regular mb-2"
          prepend-icon="mdi-account-multiple-plus-outline"
          text="Registrar Usuario"
          variant="tonal"
          v-bind="activatorProps"
        ></v-btn>
      </template>

      <v-card
        prepend-icon="mdi-account"
        title="Registrar usuario en el sistema"
      >
        <v-card-text>
          <v-row dense>
            <v-col
              cols="12"
              md="4"
              sm="6"
            >
              <v-text-field
              v-model="nuevoUsuario.username"
              clearable label="Usuario" variant="solo"
                required
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-select
              v-model="nuevoUsuario.role"
              variant="solo"
                :items="['Jefe de Planta', 'Usuario','Calidad','Encargado de Produccion','Jefe de Produccion','Logistico','Chef']"
                label="Rol*"
                required
              ></v-select>
            </v-col>
            <v-col
              cols="12"
              md="4"
              sm="6"
            >
              <v-text-field
              v-model="nuevoUsuario.nombres"
              clearable label="Nombres" variant="solo"
              hint="tienen que ser ambos nombres"
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="4"
              sm="6"
            >
              <v-text-field
              v-model="nuevoUsuario.apellidos"
              clearable label="Apellidos" variant="solo"
                hint="tienen que ser ambos apellidos"
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-select
              v-model="nuevoUsuario.sexo"
              variant="solo"
                :items="['Masculino','Femenino']"
                label="Sexo"
                required
              ></v-select>
            </v-col>

            <v-col
              cols="12"
              md="4"
              sm="6"
            >
              <v-text-field
              v-model="nuevoUsuario.password"
              variant="solo"
                label="Contraseña"
                required
              ></v-text-field>
            </v-col>


            <v-col
              cols="12"
              sm="6"
            >
              <v-select
              v-model="nuevoUsuario.tipoDocumento"
              variant="solo"
                :items="['DNI','Carnet de Extranjeria','Pasaporte']"
                label="Tipo de Documento*"
                required
              ></v-select>
            </v-col>
            <v-col
              cols="12"
              md="4"
              sm="6"
            >
              <v-text-field
              v-model="nuevoUsuario.numeroDocumento"
              variant="solo"
                label="Numero de documento"
                type="string"
                required
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="4"
              sm="6"
            >
              <v-text-field
              v-model="nuevoUsuario.telefono"
              variant="solo"
                label="Telefono"
                type="string"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <small class="text-caption text-medium-emphasis">*indicates required field</small>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text="Close"
            variant="plain"
            @click="dialogRegistrarUsuario = false"
          ></v-btn>

          <v-btn
            color="primary"
            text="Save"
            variant="tonal"
            @click="registrarUsuario"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

            <!----------------------------------->



          </v-toolbar>
        </template>
        <!-- Columnas de la tabla -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-row>
            <v-btn
              color="primary"
              small
              dark
              @click="verUsuario(item)"
            >
              <v-icon left>mdi-account-details</v-icon>
              <span>Ver</span>
            </v-btn>
            <v-btn
              color="info"
              small
              dark
              class="ml-2"
              @click="editarUsuario(item)"
            >
              <v-icon left>mdi-pencil</v-icon>
              <span>Editar</span>
            </v-btn>
            <v-btn
              color="error"
              small
              dark
              class="ml-2"
              @click="eliminarUsuario(item)"
            >
              <v-icon left>mdi-delete</v-icon>
              <span>Eliminar</span>
            </v-btn>
          </v-row>
        </template>
      </v-data-table>
    </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
const dialogExportarUsuarios=ref(false);
const dialogRegistrarUsuario=ref(false);
// const dialogEliminarUsuario=ref(false);
// const dialogVerUsuario=ref(false);
// const editarUsuario=ref(false);
const usuarios = ref([]);
const search = ref('');
const headersTableUsuario = [
  { title: 'Nombre de usuario', value: 'username' },
  { title: 'Nombres', value: 'nombres' },
  { title: 'Apellidos', value: 'apellidos' },
  { title: 'Rol', value: 'role' },
  { title: 'Opciones', value: 'actions', sortable: false },
];
const tableOptions = {
  pagination: {
    rowsPerPageOptions: [5, 10, 20], // Define las opciones de filas por página
    sortBy: ['name'], // Columna inicial para ordenar
  },
  dense: true,
};



const cargarUsuarios = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/auth/users');
    usuarios.value = response.data;
  } catch (error) {
    console.error('Error al cargar los usuarios:', error);
  }
};

const nuevoUsuario = ref({
  username: '',
  password:'',
  role:'',
  nombres:'',
  apellidos:'',
  tipoDocumento:'',
  numeroDocumento:'',
  telefono:'',
  sexo:'',

  // Agrega los otros campos del usuario aquí
});

const registrarUsuario = async () => {
  try {
    // Envía la solicitud HTTP al backend para registrar el nuevo usuario
    await axios.post('http://localhost:3000/api/auth/register', nuevoUsuario.value);
    // Si el registro es exitoso, muestra un mensaje y cierra el diálogo
    alert('Usuario registrado correctamente.');
    dialogRegistrarUsuario.value = false;
    // También puedes recargar la lista de usuarios aquí si es necesario
  } catch (error) {
    // Si ocurre un error, muestra un mensaje de error al usuario
    alert('Error al registrar el usuario. Por favor, inténtalo de nuevo.');
    console.error('Error al registrar el usuario:', error);
  }
};


const exportToExcel = () => {
  axios.get('http://localhost:3000/api/auth/export-excel', { responseType: 'blob' }) // Indicar que esperamos una respuesta de tipo blob
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data])); // Crear una URL para el blob
      const link = document.createElement('a'); // Crear un enlace
      link.href = url;
      link.setAttribute('download', 'usuarios.xlsx'); // Establecer el nombre del archivo
      document.body.appendChild(link); // Agregar el enlace al DOM
      link.click(); // Simular clic en el enlace para iniciar la descarga
      window.URL.revokeObjectURL(url); // Liberar la URL del objeto
    })
    .catch(error => {
      console.error('Error al exportar a Excel:', error);
    });
};

const exportToPDF = () => {
  axios.get('http://localhost:3000/api/auth/export-pdf', { responseType: 'blob' })
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'usuarios.pdf');
      document.body.appendChild(link);
      link.click();
    })
    .catch(error => {
      console.error('Error al exportar a PDF:', error);
    });
};


onMounted(() => {
  cargarUsuarios();
})
</script>

<style lang="scss">
/* Estilos personalizados */
</style>
