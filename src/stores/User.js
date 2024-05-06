import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: null,
    user: { role: null, username: null }, // Inicializa el objeto user con un rol null
  }),
  actions: {
    setUserRole(role, username) {
      this.user.role = role;
      this.user.username = username;
    },
    setToken(token) {
      this.token = token;
    },
    clearUser() {
      this.token = null;
      this.user.role = null;
      this.user.username = null;
    },
  },
});



