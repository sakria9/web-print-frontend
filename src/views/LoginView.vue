<script setup lang="ts">
import { onUpdated, reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "~/stores/user";
import router from "~/router";

const { email, admin, max_page } = storeToRefs(useUserStore());
const { login, logout } = useUserStore();

const form = reactive({
  email: "",
  password: "",
});
const onSubmit = () => {
  login(form.email, form.password);
};

onUpdated(() => {
  if (email.value.length > 0) {
    router.push("/user");
  }
});
</script>

<template>
  <div v-if="email.length == 0">
    <el-form :model="form" label-width="120px" class="margin-top">
      <el-form-item label="Email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="Password">
        <el-input v-model="form.password" type="password" show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Login</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
