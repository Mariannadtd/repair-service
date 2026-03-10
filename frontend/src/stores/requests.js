import { defineStore } from "pinia";
import { api } from "../api/http";

export const useRequestsStore = defineStore("requests", {
  state: () => ({
    requests: [],
    loading: false,
    error: "",
    success: "",
  }),

  actions: {
    clearMessages() {
      this.error = "";
      this.success = "";
    },

    async createRequest(payload) {
      this.loading = true;
      this.clearMessages();

      try {
        const result = await api.createRequest(payload);
        this.success = "Заявка создана";
        return result;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchRequests(status = "all") {
      this.loading = true;
      this.error = "";

      try {
        this.requests = await api.getRequests(status);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchMyRequests(userId) {
      this.loading = true;
      this.error = "";

      try {
        this.requests = await api.getMyRequests(userId);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async assignRequest(id, masterId, dispatcherId) {
      this.clearMessages();

      try {
        await api.assignRequest(id, masterId, dispatcherId);
        this.success = "Мастер назначен";
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },

    async cancelRequest(id, dispatcherId) {
      this.clearMessages();

      try {
        await api.cancelRequest(id, dispatcherId);
        this.success = "Заявка отменена";
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },

    async takeRequest(id, userId) {
      this.clearMessages();

      try {
        await api.takeRequest(id, userId);
        this.success = "Заявка взята в работу";
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },

    async completeRequest(id, userId) {
      this.clearMessages();

      try {
        await api.completeRequest(id, userId);
        this.success = "Заявка завершена";
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },
  },
});
