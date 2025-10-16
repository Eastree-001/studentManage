<template>
  <el-container style="height: 100vh;">
    <el-header style="background-color: #409EFF; color: white; display: flex; align-items: center;">
      <h1 style="margin: 0;">学生作品展示管理平台</h1>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu router :default-active="$route.path">
          <el-menu-item index="/">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/about">
            <el-icon><InfoFilled /></el-icon>
            <span>关于</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { House, InfoFilled } from '@element-plus/icons-vue'
</script>

<style>
body {
  margin: 0;
}
</style>