<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>新闻列表</span>
    </div>
    <el-table :data="newsList" style="width: 100%" stripe empty-text="暂无新闻，请先发布一篇吧！">
      <el-table-column prop="title" label="标题" width="200"></el-table-column>
      <el-table-column prop="author" label="作者" width="120"></el-table-column>
      <el-table-column prop="category" label="分类" width="100"></el-table-column>
      <el-table-column prop="content" label="内容摘要">
        <template slot-scope="scope">
          {{ scope.row.content.substring(0, 50) + '...' }}
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="发布时间" width="180"></el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: 'NewsList',
  props: {
    // 通过 props 接收父组件传递过来的新闻列表数据
    newsList: {
      type: Array,
      required: true,
      default: () => []
    }
  }
};
</script>