import { defineStore } from "pinia";
import { postData } from "~/utils/post";

export const useUserStore = defineStore("user", {
  state: () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      email: user.email || "",
      admin: user.admin || false,
      max_page: user.max_page || 0,
    }
  },
  getters: {
    isAdmin: (state) => state.admin,
  },
  actions: {
    async get() {
      const result = await fetch("/api/me");
      let data = await result.json();
      data = data.data;
      this.email = data.email;
      this.admin = data.admin;
      this.max_page = data.max_page;
    },
    async login(email: string, password: string) {
      const result = await postData("/api/login", { email, password });
      const data = result.data;
      this.email = email;
      this.admin = data.admin;
      this.max_page = data.max_page;
      localStorage.setItem("user", JSON.stringify({
        email,
        admin: this.admin,
        max_page: this.max_page
      }))
    },
    async logout() {
      localStorage.removeItem("user");
      this.email = "";
      this.admin = false;
      this.max_page = 0;
    },
  },
});
