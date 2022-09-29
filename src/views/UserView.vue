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
</script>

<template>
  <el-descriptions title="User Info" class="margin-top">
    <el-descriptions-item label="Email">{{ email }}</el-descriptions-item>
    <el-descriptions-item label="Admin">{{ admin }}</el-descriptions-item>
    <el-descriptions-item label="Max Page">{{ max_page }}</el-descriptions-item>
  </el-descriptions>

  <el-button @click="get()">Refresh</el-button>
  <el-button @click="logout()">Logout</el-button>

  <div v-if="admin">
    <el-descriptions title="Server Info" class="margin-top">
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
  </div>
</template>
