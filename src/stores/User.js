// user.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null, // Aquí puedes almacenar la información del usuario, incluido su rol
  }),
});
