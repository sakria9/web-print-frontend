<script setup lang="ts">
import ServerInfo from "~/components/ServerInfo.vue";
import Tasks from "~/components/Tasks.vue";
import CreateTask from "~/components/CreateTask.vue";
import { storeToRefs } from "pinia";
import { useTaskStore } from "~/stores/task";
import { onBeforeUnmount } from "vue";

const { tasks } = storeToRefs(useTaskStore());
const { get, cancel } = useTaskStore();

const taskGetInterval = setInterval(() => {
  get();
}, 1000);
onBeforeUnmount(() => {
  clearInterval(taskGetInterval);
});
</script>

<template>
  <el-card class="box-card margin-top">
    <ServerInfo :is_admin="false" />
  </el-card>
  <el-card class="box-card margin-top">
    <Tasks :tasks="tasks" :get="get" :cancel="cancel" :show_email="false" />
  </el-card>
  <div class="margin-top">
    <CreateTask />
  </div>
</template>
