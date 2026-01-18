<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>发布新新闻</span>
    </div>
    <el-form ref="newsForm" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="新闻标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入新闻标题"></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="form.author" placeholder="请输入作者姓名"></el-input>
      </el-form-item>
      <el-form-item label="新闻分类" prop="category">
        <el-select v-model="form.category" placeholder="请选择分类">
          <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="新闻内容" prop="content">
        <el-input type="textarea" :rows="4" v-model="form.content" placeholder="请输入新闻内容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">立即发布</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'NewsForm',
  data() {
    return {
      form: {
        title: '',
        author: '',
        category: '',
        content: ''
      },
      categories: ['科技', '财经', '体育', '娱乐', '社会'],
      rules: {
        title: [
          { required: true, message: '新闻标题不能为空', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '作者不能为空', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择新闻分类', trigger: 'change' }
        ],
        content: [
          { required: true, message: '新闻内容不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.newsForm.validate((valid) => {
        if (valid) {
          // 校验成功，模拟提交
          this.$message.success('新闻发布成功！');
          // 通过 $emit 将数据传递给父组件
          // 额外添加一个 id 和创建时间，让数据更真实
          this.$emit('add-news', {
            ...this.form,
            id: Date.now(),
            createdAt: new Date().toLocaleString()
          });
          // 重置表单
          this.resetForm();
        } else {
          this.$message.error('表单校验失败，请检查输入！');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.newsForm.resetFields();
    }
  }
};
</script>

<style scoped>
.box-card {
  margin-bottom: 20px;
}
</style>