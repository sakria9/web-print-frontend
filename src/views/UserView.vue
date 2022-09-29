<script setup lang="ts">
import { onBeforeMount, onUpdated, reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "~/stores/user";
import router from "~/router";
import { postData } from "~/utils/post";
import { ElMessage } from "element-plus";

const { email, admin, max_page } = storeToRefs(useUserStore());
const { get, logout } = useUserStore();

onUpdated(() => {
  if (email.value.length == 0) {
    router.push("/login");
  }
});

const server_status = reactive({
  pending_pages: 0,
  pending_tasks: 0,
  enable_print: false,
  ready: false,
});

const getServerStatus = async () => {
  const result = await fetch("/api/server");
  const data = await result.json();
  const status = data.data;
  if (result.ok) {
    server_status.pending_pages = status.pending_pages;
    server_status.pending_tasks = status.pending_tasks;
    server_status.enable_print = status.enable_print;
    server_status.ready = true;
  }
};
const enablePrint = async () => {
  try {
    const result = await postData("/api/admin/enable-print", {});
    await getServerStatus();
  } catch (e) {
    ElMessage.error("Failed to enable print");
  }
};
const disablePrint = async () => {
  try {
    const result = await postData("/api/admin/disable-print", {});
    await getServerStatus();
  } catch (e) {
    ElMessage.error("Failed to disable print");
  }
};
onBeforeMount(() => {
  getServerStatus();
});

const userForm = reactive({
  email: "",
  password: "",
  max_page: 0,
  admin: false,
});
const register = async () => {
  try {
    const result = await postData("/api/admin/register", userForm);
    if (result.message == "Register success") {
      ElMessage.success("Register success");
    } else {
      ElMessage.error("Register failed");
    }
  } catch (e) {
    ElMessage.error("Register failed");
  }
};

const newPassword = ref("");
const changePassword = async () => {
  try {
    const result = await postData("/api/change-password", {
      password: newPassword.value,
    });
    if (result.message == "Update success") {
      ElMessage.success("Change password success");
    } else {
      ElMessage.error("Change password failed");
    }
  } catch (e) {
    ElMessage.error("Change password failed");
  }
};
</script>

<template>
  <el-card class="box-card margin-top">
    <el-descriptions title="User Info">
      <el-descriptions-item label="Email">{{ email }}</el-descriptions-item>
      <el-descriptions-item label="Admin">{{ admin }}</el-descriptions-item>
      <el-descriptions-item label="Max Page">{{
        max_page
      }}</el-descriptions-item>
    </el-descriptions>
    <el-button @click="get()">Refresh</el-button>
    <el-button @click="logout()">Logout</el-button>
  </el-card>

  <el-card class="box-card margin-top">
    <el-input
      v-model="newPassword"
      type="password"
      placeholder="New password"
      show-password
    />
    <el-button type="primary" @click="changePassword" class="margin-top"
      >Change Password</el-button
    >
  </el-card>

  <div v-if="admin">
    <el-card class="box-card margin-top">
      <el-descriptions title="Server Info">
        <el-descriptions-item label="Pending Pages">{{
          server_status.ready ? server_status.pending_pages : "Loading..."
        }}</el-descriptions-item>
        <el-descriptions-item label="Pending Tasks">{{
          server_status.ready ? server_status.pending_tasks : "Loading..."
        }}</el-descriptions-item>
        <el-descriptions-item label="Enable Print">{{
          server_status.ready ? server_status.enable_print : "Loading..."
        }}</el-descriptions-item>
      </el-descriptions>
      <el-button @click="enablePrint()">Enable Print</el-button>
      <el-button @click="disablePrint()">Disable Print</el-button>
    </el-card>

    <el-card class="box-card margin-top">
      <el-form :model="userForm" label-width="120px" class="margin-top">
        <el-form-item label="Email">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="userForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="Admin">
          <el-switch v-model="userForm.admin" />
        </el-form-item>
        <el-form-item label="Max Page">
          <el-input v-model.number="userForm.max_page" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register"
            >Register / Update User</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
