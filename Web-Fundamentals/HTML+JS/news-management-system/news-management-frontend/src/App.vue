<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <div class="logo">新闻管理系统</div>
      <div class="user-info">
        <template v-if="isLoggedIn">
          <span>欢迎, {{ username }}</span>
          <el-button type="danger" link @click="logout">退出登录</el-button>
        </template>
        <template v-else>
          <el-button type="primary" link @click="goTo('/login')">登录</el-button>
          <el-button link @click="goTo('/register')">注册</el-button>
        </template>
      </div>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const isLoggedIn = ref(!!localStorage.getItem('token'));
const username = ref(localStorage.getItem('username') || '');

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  isLoggedIn.value = false;
  username.value = '';
  router.push('/login');
};

const goTo = (path) => {
  router.push(path);
};

// 监听路由变化，以在登录/注册后更新状态
watch(() => route.path, () => {
  isLoggedIn.value = !!localStorage.getItem('token');
  username.value = localStorage.getItem('username') || '';
});
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--el-border-color);
}
.logo {
  font-size: 20px;
  font-weight: bold;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}
.el-main {
  background-color: #f4f5f7;
  min-height: calc(100vh - 60px);
}
</style>

<style>
/* 全局样式 */
body {
  margin: 0;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
</style>