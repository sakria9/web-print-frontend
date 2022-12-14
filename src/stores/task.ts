import { defineStore } from "pinia";
import router from "~/router";
import { postData } from "~/utils/post";
import { useUserStore } from "./user";

export interface Task {
  id: number;
  file: string;
  email: string;
  pages: number;
  status: string;
  date: string;
}

export const useTaskStore = defineStore("task", {
  state: () => {
    return {
      tasks: [] as Task[],
      all_tasks: [] as Task[],
    };
  },
  getters: {},
  actions: {
    async get() {
      const result = await fetch("/api/task/list");
      if (result.status == 401) {
        const { logout } = useUserStore();
        logout();
        router.push("/login");
      }
      if (result.ok) {
        let data = await result.json();
        this.tasks = data.data;
      }
    },
    async getAll() {
      const result = await fetch("/api/admin/list-task");
      if (result.ok) {
        let data = await result.json();
        this.all_tasks = data.data;
      }
    },
    async cancel(id: number): Promise<boolean> {
      const data = await postData("/api/task/cancel", { id });
      const task = data.data;
      return task.status == "cancelled";
    },
  },
});
