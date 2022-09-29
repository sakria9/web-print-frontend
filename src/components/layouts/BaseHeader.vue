<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { toggleDark } from "~/composables";
import { useUserStore } from "~/stores/user";
const { email } = storeToRefs(useUserStore());
</script>

<template>
  <el-menu class="el-menu-demo" mode="horizontal">
    <router-link to="/" style="text-decoration: none">
      <el-menu-item index="1">SUSTech</el-menu-item>
    </router-link>
    <router-link
      to="/user"
      v-if="email.length != 0"
      style="text-decoration: none"
    >
      <el-menu-item index="4">{{ email }}</el-menu-item>
    </router-link>
    <router-link
      to="/login"
      v-if="email.length == 0"
      style="text-decoration: none"
    >
      <el-menu-item index="4">Login</el-menu-item>
    </router-link>
    <el-menu-item h="full" @click="toggleDark()">
      <button
        class="border-none w-full bg-transparent cursor-pointer"
        style="height: var(--ep-menu-item-height)"
      >
        <i inline-flex i="dark:ep-moon ep-sunny" />
      </button>
    </el-menu-item>
  </el-menu>
</template>
