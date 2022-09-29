import { defineStore } from "pinia";
import { postData } from "~/utils/post";

export const useServerStore = defineStore("server", {
  state: () => {
    return {
      pending_pages: 0,
      pending_tasks: 0,
      enable_print: false,
      ready: false,
    };
  },
  actions: {
    async get() {
      const result = await fetch("/api/server");
      const data = await result.json();
      const status = data.data;
      if (result.ok) {
        this.pending_pages = status.pending_pages;
        this.pending_tasks = status.pending_tasks;
        this.enable_print = status.enable_print;
        this.ready = true;
      }
    },
    async enablePrint() {
      const result = await postData("/api/admin/enable-print", {});
      await this.get();
    },
    async disablePrint() {
      const result = await postData("/api/admin/disable-print", {});
      await this.get();
    },
  },
});
