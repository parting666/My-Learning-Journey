<template>
  <div class="login-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>用户登录</span>
        </div>
      </template>
      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="form.password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">注册</el-button>
          <el-button @click="goToLogin">去登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api';
import { ElMessage } from 'element-plus';

const router = useRouter();
const form = reactive({
  username: '',
  password: '',
});

const onSubmit = async () => {
  try {
    const response = await apiClient.post('/users/register', form);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('username', response.data.username);
    ElMessage.success('注册成功！');
    router.push('/news');
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '登录失败');
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.box-card {
  width: 400px;
}
</style>