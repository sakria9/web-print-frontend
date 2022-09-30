<script setup lang="ts">
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
import { useServerStore } from "~/stores/server";
import { useTaskStore, Task } from "~/stores/task";

const { tasks } = storeToRefs(useTaskStore());
const { get, cancel } = useTaskStore();

const { pending_pages, pending_tasks, enable_print, ready } = storeToRefs(
  useServerStore()
);
const serverStore = useServerStore();

onBeforeMount(() => {
  get();
});

const taskStatusToClassName = ({
  row,
  rowIndex,
}: {
  row: Task;
  rowIndex: number;
}) => {
  if (row.status == "printing") {
    return "warning-row";
  } else if (row.status == "printed") {
    return "success-row";
  } else if (row.status == "cancelled") {
    return "cancel-row";
  }
  return "";
};

const cancelTask = async (id: number) => {
  if (await cancel(id)) {
    get();
  } else {
    ElMessage.error("Failed to cancel task");
  }
};
</script>

<template>
  <el-card class="box-card margin-top">
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
    <el-button @click="serverStore.get()">Refresh</el-button>
  </el-card>

  <el-card class="box-card margin-top">
    <el-table
      :data="tasks"
      :row-class-name="taskStatusToClassName"
      class="margin-top"
    >
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="date" label="Date" width="170" />
      <el-table-column prop="pages" label="Page" width="100" align="center" />
      <el-table-column prop="status" label="Status" width="110">
        <template #default="scope">
          <span style="text-transform: uppercase">{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="Operations" width="100" align="center">
        <template #default="scope">
          <el-button
            v-if="scope.row.status == 'pending'"
            type="danger"
            @click="cancelTask(scope.row.id)"
            size="small"
            >Cancel</el-button
          >
          <div v-else></div>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="get()" class="margin-top">Refresh</el-button>
  </el-card>
</template>

<style>
.success-row {
  background-color: var(--el-color-success-light-7) !important;
}
.warning-row {
  background-color: var(--el-color-warning-light-7) !important;
}
.cancel-row {
  color: #c0c4cc !important;
}
.dark .cancel-row {
  color: #6c6e72 !important;
}
</style>
