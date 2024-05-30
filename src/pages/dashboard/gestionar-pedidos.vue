<template>
    <div>
      <v-card class="card" style="margin: 80px auto 0; width: auto; height: 120%;">
        <v-card-title>Gestionar Pedidos</v-card-title>
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
  
  
                <!-- Registrar Nuevo usuario -->
                <v-btn
                  color="success"
                  elevation="2"
                  outlined
                  dark
                  class="text-none font-weight-regular mb-2"
                  prepend-icon="mdi-account-multiple-plus-outline"
                  text="Registrar Usuario"
                  variant="tonal"
                  @click="dialogRegistrarUsuario = true"
                ></v-btn>
  
                <v-dialog v-model="dialogRegistrarUsuario" max-width="680">
                  <v-card title="Registrar usuario en el sistema">
                    <v-card-text>
                      <v-row dense>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            v-model="nuevoUsuario.username"
                            clearable
                            label="Usuario"
                            variant="solo"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-select
                            v-model="nuevoUsuario.role"
                            variant="solo"
                            :items="['Jefe de Planta', 'Usuario','Calidad','Encargado de Produccion','Jefe de Produccion','Logistico','Chef']"
                            label="Rol*"
                            required
                          ></v-select>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            v-model="nuevoUsuario.nombres"
                            clearable
                            label="Nombres"
                            variant="solo"
                            hint="tienen que ser ambos nombres"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            v-model="nuevoUsuario.apellidos"
                            clearable
                            label="Apellidos"
                            variant="solo"
                            hint="tienen que ser ambos apellidos"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-select
                            v-model="nuevoUsuario.sexo"
                            variant="solo"
                            :items="['Masculino','Femenino']"
                            label="Sexo"
                            required
                          ></v-select>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            v-model="nuevoUsuario.password"
                            variant="solo"
                            label="Contraseña"
                            type="password"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-select
                            v-model="nuevoUsuario.tipoDocumento"
                            variant="solo"
                            :items="['DNI','Carnet de Extranjeria','Pasaporte']"
                            label="Tipo de Documento*"
                            required
                          ></v-select>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            v-model="nuevoUsuario.numeroDocumento"
                            variant="solo"
                            label="Numero de documento"
                            type="string"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            v-model="nuevoUsuario.telefono"
                            variant="solo"
                            label="Telefono"
                            type="string"
                            required
                          ></v-text-field>
                        </v-col>
                        <!-- Campo de entrada de archivo -->
                        <v-col cols="12" sm="6">
                          <v-file-input
                            v-model="nuevoUsuario.cv"
                            label="Cargar CV"
                            variant="solo"
                            required
                            accept=".pdf,.doc,.docx"
                          ></v-file-input>
                        </v-col>
                      </v-row>
                      <small class="text-caption text-medium-emphasis">*indicates required field</small>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn text="Close" variant="plain" @click="dialogRegistrarUsuario = false"></v-btn>
                      <v-btn color="primary" text="Save" variant="tonal" @click="registrarUsuario"></v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <!-- Columnas de la tabla -->
            <template v-slot:[`item.actions`]="{ item }">
              <v-row>
                <v-btn color="primary" small dark  @click="verUsuario(item)">
                  <v-icon left>mdi-account-details</v-icon>
                  <span>Ver</span>
                </v-btn>
                <v-btn color="info" small dark class="ml-2" @click="editarUsuario(item)">
                  <v-icon left>mdi-pencil</v-icon>
                  <span>Editar</span>
                </v-btn>
                <v-btn color="error" small dark class="ml-2" @click="confirmarEliminarUsuario(item)">
                  <v-icon left>mdi-delete</v-icon>
                  <span>Eliminar</span>
                </v-btn>
              </v-row>
            </template>
          </v-data-table>
        </div>
      </v-card>
  
      <!-- Diálogo para Ver Usuario -->
      <v-dialog v-model="dialogVerUsuario" max-width="680">
        <v-card title="Detalles del Usuario">
          <v-card-text>
            <v-row dense>
              <v-col cols="12" md="4" sm="6">
                <v-text-field   :value="usuarioActual.username" readonly></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field  :value="usuarioActual.role" readonly></v-text-field>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field  :value="usuarioActual.nombres" readonly></v-text-field>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field  :value="usuarioActual.apellidos" readonly></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field  :value="usuarioActual.sexo" readonly></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field  :value="usuarioActual.tipoDocumento" readonly></v-text-field>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field  :value="usuarioActual.numeroDocumento" readonly></v-text-field>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field  :value="usuarioActual.telefono" readonly></v-text-field>
              </v-col>
              <!-- Mostrar enlace para descargar CV -->
              <v-col cols="12" sm="6">
                <v-btn :href="usuarioActual.cv" target="_blank" color="primary">
                  Descargar CV
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Close" variant="plain" @click="dialogVerUsuario = false"></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Diálogo para Editar Usuario -->
      <v-dialog v-model="dialogEditarUsuario" max-width="680">
        <v-card title="Editar Usuario">
          <v-card-text>
            <v-row dense>
              <v-col cols="12" md="4" sm="6">
                <v-text-field v-model="usuarioActual.username" label="Usuario" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="usuarioActual.role"
                  :items="['Jefe de Planta', 'Usuario','Calidad','Encargado de Produccion','Jefe de Produccion','Logistico','Chef']"
                  label="Rol*"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field v-model="usuarioActual.nombres" label="Nombres" hint="tienen que ser ambos nombres" required></v-text-field>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field v-model="usuarioActual.apellidos" label="Apellidos" hint="tienen que ser ambos apellidos" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="usuarioActual.sexo" :items="['Masculino','Femenino']" label="Sexo" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="usuarioActual.tipoDocumento"
                  :items="['DNI','Carnet de Extranjeria','Pasaporte']"
                  label="Tipo de Documento*"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field v-model="usuarioActual.numeroDocumento" label="Número de Documento" required></v-text-field>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field v-model="usuarioActual.telefono" label="Teléfono" required></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Close" variant="plain" @click="dialogEditarUsuario = false"></v-btn>
            <v-btn color="primary" text="Save" variant="tonal" @click="actualizarUsuario"></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Confirmación para Eliminar Usuario -->
      <v-dialog v-model="dialogEliminarUsuario" max-width="480">
        <v-card title="Confirmar Eliminación">
          <v-card-text>
            <p>¿Está seguro de que desea eliminar al usuario {{ usuarioActual.username }}?</p>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Cancelar" variant="plain" @click="dialogEliminarUsuario = false"></v-btn>
            <v-btn color="error" text="Eliminar" variant="tonal" @click="eliminarUsuarioConfirmado"></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const headersTableUsuario = [
    { text: 'Usuario', value: 'username' },
    { text: 'Nombres', value: 'nombres' },
    { text: 'Apellidos', value: 'apellidos' },
    { text: 'Rol', value: 'role' },
    { text: 'Acciones', value: 'actions', sortable: false },
  ];
  
  const usuarios = ref([]);
  const search = ref('');
  const tableOptions = ref({});
  const dialogRegistrarUsuario = ref(false);
  const dialogVerUsuario = ref(false);
  const dialogEditarUsuario = ref(false);
  const dialogEliminarUsuario = ref(false);
  
  const nuevoUsuario = ref({
    _id: '',
    username: '',
    role: '',
    nombres: '',
    apellidos: '',
    sexo: '',
    tipoDocumento: '',
    numeroDocumento: '',
    telefono: '',
    cv: null, // Nuevo campo para el archivo
  });
  
  const usuarioActual = ref({});
  
  const cargarUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/auth/users');
      usuarios.value = response.data;
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
    }
  };
  
  const registrarUsuario = async () => {
    try {
      const formData = new FormData();
      for (const key in nuevoUsuario.value) {
        formData.append(key, nuevoUsuario.value[key]);
      }
      await axios.post('http://localhost:3000/api/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Usuario registrado correctamente.');
      dialogRegistrarUsuario.value = false;
      cargarUsuarios();
    } catch (error) {
      alert('Error al registrar el usuario. Por favor, inténtalo de nuevo.');
      console.error('Error al registrar el usuario:', error);
    }
  };
  
  const verUsuario = (usuario) => {
    usuarioActual.value = { ...usuario, id: usuario._id };
    dialogVerUsuario.value = true;
  };
  
  const editarUsuario = (usuario) => {
    usuarioActual.value = { ...usuario, id: usuario._id };
    dialogEditarUsuario.value = true;
  };
  
  const actualizarUsuario = async () => {
    try {
      await axios.put(`http://localhost:3000/api/auth/users/${usuarioActual.value.id}`, usuarioActual.value);
      alert('Usuario actualizado correctamente.');
      dialogEditarUsuario.value = false;
      cargarUsuarios();
    } catch (error) {
      alert('Error al actualizar el usuario. Por favor, inténtalo de nuevo.');
      console.error('Error al actualizar el usuario:', error);
    }
  };
  
  const confirmarEliminarUsuario = (usuario) => {
    usuarioActual.value = { ...usuario, id: usuario._id };
    dialogEliminarUsuario.value = true;
  };
  
  const eliminarUsuarioConfirmado = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/auth/users/${usuarioActual.value.id}`);
      alert('Usuario eliminado correctamente.');
      dialogEliminarUsuario.value = false;
      cargarUsuarios();
    } catch (error) {
      alert('Error al eliminar el usuario. Por favor, inténtalo de nuevo.');
      console.error('Error al eliminar el usuario:', error);
    }
  };
  

  
  onMounted(cargarUsuarios);
  </script>
  
  <style scoped>
  .card {
    margin: 80px auto 0;
    width: auto;
    height: 120%;
  }
  </style>
  