<script setup lang="ts">
import ServerInfo from "~/components/ServerInfo.vue";
import { onBeforeMount, onUpdated, reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "~/stores/user";
import { useServerStore } from "~/stores/server";
import router from "~/router";
import { postData } from "~/utils/post";
import { ElMessage } from "element-plus";
import { useTaskStore } from "~/stores/task";

const { email, admin, max_page } = storeToRefs(useUserStore());
const { get, logout } = useUserStore();

const { all_tasks } = storeToRefs(useTaskStore());
const { getAll, cancel } = useTaskStore();

onUpdated(() => {
  if (email.value.length == 0) {
    router.push("/login");
  }
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
      <ServerInfo :is_admin="true" />
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
    <el-card class="box-card margin-top">
      <Tasks
        :tasks="all_tasks"
        :get="getAll"
        :cancel="cancel"
        :show_email="true"
      />
    </el-card>
  </div>
</template>
