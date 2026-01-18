<template>
  <div class="main-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>添加新闻</span>
        </div>
      </template>

      <el-form :model="newsForm" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="新闻标题" prop="title">
          <el-input v-model="newsForm.title" placeholder="请输入新闻标题"></el-input>
        </el-form-item>
        <el-form-item label="新闻内容" prop="content">
          <el-input
            v-model="newsForm.content"
            type="textarea"
            :rows="5"
            placeholder="请输入新闻内容"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { Message } from 'element-ui';

// 表单数据模型
const newsForm = reactive({
  title: '',
  content: ''
});

// 表单验证规则
const rules = reactive({
  title: [
    { required: true, message: '请输入新闻标题', trigger: 'blur' },
    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入新闻内容', trigger: 'blur' }
  ]
});

// 获取表单实例，用于调用 validate 方法
const formRef = ref(null);

// 提交表单
const submitForm = async () => {
  const valid = await formRef.value.validate();
  if (valid) {
    // 模拟后端接口请求
    console.log('提交的数据:', JSON.stringify(newsForm));
    
    // 模拟网络延迟
    setTimeout(() => {
      // 模拟提交成功
      Message({
        message: '新闻添加成功！',
        type: 'success',
      });
      // 提交成功后重置表单
      resetForm();
    }, 1000); // 1秒延迟
  } else {
    Message.error('表单验证失败，请检查填写内容。');
    return false;
  }
};

// 重置表单
const resetForm = () => {
  formRef.value.resetFields();
};
</script>

<style scoped>
.main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.box-card {
  width: 600px;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}
</style>