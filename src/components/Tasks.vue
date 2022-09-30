<script setup lang="ts">
import { ElMessage } from "element-plus";
import { Task } from "~/stores/task";

const { tasks, get, cancel, show_email } = defineProps<{
  tasks: Task[];
  get: () => Promise<void>;
  cancel: (id: number) => Promise<boolean>;
  show_email: boolean;
}>();

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
    await get();
  } else {
    ElMessage.error("Failed to cancel task");
  }
};
</script>

<template>
  <el-table
    :data="tasks"
    :row-class-name="taskStatusToClassName"
    class="margin-top"
  >
    <el-table-column prop="name" label="Name" />
    <el-table-column v-if="show_email" prop="email" label="Email" width="250" />
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
