<template>
  <div class="news-container">
    <h1>新闻列表</h1>

    <div class="toolbar">
      <el-input
        v-model="searchParams.keyword"
        placeholder="请输入标题或内容关键字"
        class="search-input"
        clearable
        @clear="fetchNews"
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="success" @click="openAddDialog">发布新闻</el-button>
    </div>

    <el-table :data="tableData" v-loading="loading" style="width: 100%">
      <el-table-column label="图片" width="100">
        <template #default="scope">
          <img v-if="scope.row.image_url" :src="scope.row.image_url" alt="新闻图片" style="width: 80px; height: 60px; object-fit: cover;" />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="250" />
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column prop="author" label="作者" width="120" />
      <el-table-column prop="created_at" label="发布时间" width="180">
        <template #default="scope">
          {{ new Date(scope.row.created_at).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" v-if="isLoggedIn">
        <template #default="scope">
          <el-button size="small" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next, total"
      :total="pagination.total"
      :current-page="pagination.page"
      :page-size="pagination.pageSize"
      @current-change="handlePageChange"
      class="pagination"
    />

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="50%">
      <el-form :model="newsForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="newsForm.title" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="newsForm.content" type="textarea" :rows="5" />
        </el-form-item>
        <el-form-item label="新闻图片">
            <!-- <el-upload
                ref="uploadRef"
                class="upload-demo"
                action="http://up-z2.qiniup.com" 
                :on-success="handleUploadSuccess"
                :on-remove="handleRemove"
                :file-list="fileList"
                :data="uploadData"
                :limit="1"
                :auto-upload="false"
            >
                <el-button size="small" type="primary" @click="handleManualUpload">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传一张图片</div>
            </el-upload> -->
             <input type="file" id="file-upload" ref="fileInput" @change="handleManualUpload" />
             <input type="file" multiple @change="handleMultipleUpload" />

        </el-form-item>
        <el-form-item label="图片">
          <el-input v-model="newsForm.image_url" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import apiClient from '@/api';
import { getUploadToken,uploadFileToQiniu,uploadMultipleFiles } from '@/api/upload'; 
import { ElMessage, ElMessageBox } from 'element-plus'; 
 

// --- 响应式数据 ---
const fileInput = ref(null);
const uploadRef = ref(null);
const tableData = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const dialogMode = ref('add');
const currentNewsId = ref(null);
const fileList = ref([]);
const uploadedUrls = ref([]);  
const uploadData = reactive({
  token: '',
  domain: ''
});

const searchParams = reactive({
  keyword: '',
});

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});

const newsForm = reactive({
  title: '',
  content: '',
  image_url: '',
  image_urls:''
});

const isLoggedIn = computed(() => !!localStorage.getItem('token'));
const dialogTitle = computed(() => dialogMode.value === 'add' ? '发布新新闻' : '编辑新闻');


// --- 方法 ---
// 手动处理上传，先获取token，再提交
const handleManualUpload = async () => {

    try {
      const  selectedFile = fileInput.value.files[0];
      const response = await uploadFileToQiniu(selectedFile);
    
      console.log("返回的文件：",response);
      newsForm.image_url = response;
      ElMessage.success('图片上传成功！');

    } catch (error) {
      ElMessage.error('上传 失败',error);
    }
};
const handleMultipleUpload = async (e) => {
  try {
    const files = Array.from(e.target.files);
    const urls = await uploadMultipleFiles(files);
    console.log("多文件上传结果:", urls);
    newsForm.image_urls = urls.join(',');
    // 默认取第一张作为主图
    if (urls.length > 0 && !newsForm.image_url) {
      newsForm.image_url = urls[0];
    }
    ElMessage.success("多文件上传成功！");
  } catch (err) {
    console.error(err);
    ElMessage.error("多文件上传失败");
  }
};
 
 

// 上传成功回调
const handleUploadSuccess = (response, file) => {
  // 七牛云的响应直接包含 key，不嵌套在 data 中
  const imageUrl = `${uploadData.domain}/${response.key}`;
  newsForm.image_url = imageUrl;
  ElMessage.success('图片上传成功！');
};

// 处理移除文件
const handleRemove = () => {
  newsForm.image_url = '';
  fileList.value = [];
};
 
// 获取新闻列表
const fetchNews = async () => {
  loading.value = true;
  try {
    const response = await apiClient.get('/news', {
      params: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        keyword: searchParams.keyword,
      },
    });
    tableData.value = response.data.list;
    pagination.total = response.data.total;
  } catch (error) {
    ElMessage.error('获取新闻列表失败');
  } finally {
    loading.value = false;
  }
};

// 搜索按钮点击
const handleSearch = () => {
  pagination.page = 1;
  fetchNews();
};

// 分页切换
const handlePageChange = (newPage) => {
  pagination.page = newPage;
  fetchNews();
};

// 打开新增对话框
const openAddDialog = () => {
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录再发布新闻');
    return;
  }
  dialogMode.value = 'add';
  newsForm.title = '';
  newsForm.content = '';
  newsForm.image_url='';
  newsForm.image_urls = '';
  fileList.value = [];
  currentNewsId.value = null;
  uploadedUrls.value = [];
  dialogVisible.value = true;
};

// 打开编辑对话框
const openEditDialog = (row) => {
  dialogMode.value = 'edit';
  newsForm.title = row.title;
  newsForm.content = row.content;
  newsForm.image_url = row.image_url;
  newsForm.image_urls = row.image_urls || '';
  currentNewsId.value = row.id;

  // 如果有图片URL，初始化文件列表以显示现有图片
  if (row.image_url) {
    fileList.value = [{
      name: row.image_url.substring(row.image_url.lastIndexOf('/') + 1),
      url: row.image_url,
    }];
  } else {
    fileList.value = [];
  }
  dialogVisible.value = true;
};

// 提交表单 (新增或编辑)
const submitForm = async () => {
  if (!newsForm.title || !newsForm.content) {
    ElMessage.warning('标题和内容不能为空');
    return;
  }

  // 如果主图为空但有多图，自动取多图的第一张作为主图
  if (!newsForm.image_url && newsForm.image_urls) {
    newsForm.image_url = newsForm.image_urls.split(',')[0];
  }

  try {
    if (dialogMode.value === 'add') {
      await apiClient.post('/news', newsForm);
      ElMessage.success('发布成功');
    } else {
      await apiClient.put(`/news/${currentNewsId.value}`, newsForm);
      ElMessage.success('更新成功');
    }
    dialogVisible.value = false;
    fetchNews();
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '操作失败');
  }
};
 
// 删除新闻
const handleDelete = (id) => {
  ElMessageBox.confirm('确定要删除这篇新闻吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await apiClient.delete(`/news/${id}`);
      ElMessage.success('删除成功');
      fetchNews();
    } catch (error) {
      ElMessage.error(error.response?.data?.message || '删除失败');
    }
  }).catch(() => {
    // 用户取消删除
  });
};


// 组件挂载时获取数据
onMounted(() => {
  fetchNews();
});
</script>

<style scoped>
.news-container {
  padding: 20px;
}
.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.search-input {
  width: 300px;
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>