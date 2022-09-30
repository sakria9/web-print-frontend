<script setup lang="ts">
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
import { useServerStore } from "~/stores/server";

const props = defineProps({
  is_admin: Boolean,
});

const { pending_pages, pending_tasks, enable_print, ready } = storeToRefs(
  useServerStore()
);
const serverStore = useServerStore();

onBeforeMount(() => {
  serverStore.get();
});

const enablePrint = async () => {
  serverStore
    .enablePrint()
    .then(() => ElMessage.success("Enable print"))
    .catch(() => ElMessage.error("Failed to enable print"));
};
const disablePrint = () => {
  serverStore
    .disablePrint()
    .then(() => ElMessage.success("Disable print"))
    .catch(() => ElMessage.error("Failed to disable print"));
};
</script>

<template>
  <el-descriptions title="Server Info">
    <el-descriptions-item label="Pending Pages">{{
      ready ? pending_pages : "Loading..."
    }}</el-descriptions-item>
    <el-descriptions-item label="Pending Tasks">{{
      ready ? pending_tasks : "Loading..."
    }}</el-descriptions-item>
    <el-descriptions-item label="Enable Print">{{
      ready ? enable_print : "Loading..."
    }}</el-descriptions-item>
  </el-descriptions>
  <el-button v-if="props.is_admin" @click="enablePrint()"
    >Enable Print</el-button
  >
  <el-button v-if="props.is_admin" @click="disablePrint()"
    >Disable Print</el-button
  >
  <el-button @click="serverStore.get()">Refresh</el-button>
</template>
