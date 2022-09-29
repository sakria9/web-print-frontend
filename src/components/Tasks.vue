<script setup lang="ts">
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
import { useTaskStore, Task } from "~/stores/task";

const { tasks } = storeToRefs(useTaskStore());
const { get, cancel } = useTaskStore();

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
  <el-button @click="get()">Refresh</el-button>
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
        <span style="text-transform: uppercase;">{{ scope.row.status }}</span>
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
</template>

<style>
.warning-row {
  background-color: #3e301c !important;
}
.success-row {
  background-color: #25371c !important;
}
.cancel-row {
  color: #2d2d2f !important;
}
</style>
