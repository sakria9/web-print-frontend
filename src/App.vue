<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "~/stores/user";
import router from "./router";

const { email } = storeToRefs(useUserStore());

if (email.value.length == 0) {
  router.push("/login");
}
</script>

<template>
  <el-config-provider namespace="ep">
    <BaseHeader />
    <div style="display: flex">
      <el-row justify="center" style="width: 100%">
        <el-col :xs="22" :sm="20" :md="15" :lg="15" :xl="15">
          <router-view />  
        </el-col>
      </el-row>
    </div>
  </el-config-provider>
</template>

<style>
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
}
</style>
