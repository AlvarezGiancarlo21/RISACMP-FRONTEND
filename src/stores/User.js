// user.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: { role: null,username:null}, // Inicializa el objeto user con un rol null

  }),
  actions: {
    setUserRole(role) {
      this.user.role = role;
    },
    setUserUsername(username){
      this.username=username;
    },
  },
});
