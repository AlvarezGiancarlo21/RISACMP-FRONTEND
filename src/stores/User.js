// user.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: { role: null }, // Inicializa el objeto user con un rol null
  }),
  actions: {
    setUserRole(role) {
      this.user.role = role;
    },
  },
});
