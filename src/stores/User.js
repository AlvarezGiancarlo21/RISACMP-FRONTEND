// user.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: { role: null,username:null}, // Inicializa el objeto user con un rol null

  }),
  actions: {
    setUserRole(role,username) {
      this.user.role = role;
      this.user.username=username;
    },
    // setUserUsername(username){

    // },
  },
});
