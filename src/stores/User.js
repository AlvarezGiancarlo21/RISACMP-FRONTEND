import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: null,
    user: { role: null, username: null,nombres:null,
      apellidos:null,tipoDocumento:null,numeroDocumento:null,telefono:null,sexo:null }, // Inicializa el objeto user con un rol null
  }),
  actions: {
    setUserRole(role, username,nombres,apellidos,tipoDocumento,numeroDocumento,telefono,sexo) {
      this.user.role = role;
      this.user.username = username;
      this.user.nombres=nombres;
      this.user.apellidos=apellidos;
      this.user.tipoDocumento=tipoDocumento;
      this.user.numeroDocumento=numeroDocumento;
      this.user.telefono=telefono;
      this.user.sexo=sexo;
    },
    setToken(token) {
      this.token = token;
    },
    clearUser() {
      this.token = null;
      this.user.role = null;
      this.user.username = null;
      this.user.nombres=null;
      this.user.apellidos=null;
      this.user.tipoDocumento=null;
      this.user.numeroDocumento=null;
      this.user.telefono=null;
      this.user.sexo=null;
    },
  },
});



