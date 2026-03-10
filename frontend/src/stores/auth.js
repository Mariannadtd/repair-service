import { defineStore } from "pinia";
import { api } from "../api/http";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("repair-user") || "null"),
    users: [],
    loading: false,
    error: "",
  }),

  actions: {
    async fetchUsers() {
      this.loading = true;
      this.error = "";

      try {
        this.users = await api.getUsers();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    login(user) {
      this.user = user;
      localStorage.setItem("repair-user", JSON.stringify(user));
    },

    logout() {
      this.user = null;
      localStorage.removeItem("repair-user");
    },
  },
});
