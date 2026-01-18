// src/api/upload.js
import axios from 'axios';
import apiClient from './index'; // 假设你的 Axios 实例在这里

// 从后端获取七牛云上传凭证
export const getUploadToken = async () => {
  const res = await apiClient.get("/upload/token");
  console.log("res", res);
  return res.data.token;
};

// upload.js

// 执行文件上传到七牛云
export const uploadFileToQiniu = async (file) => {

  console.log("文件：", file);
  try {

    const response = await getUploadToken();
    console.log("response", response);

    const token = response;


    // 3. 为上传的文件生成一个唯一的 key（文件名）
    const fileExtension = file.name.substring(file.name.lastIndexOf('.'));
    const fileName = `${new Date().getTime()}${Math.floor(Math.random() * 1000)}${fileExtension}`;
    console.log("文件名：", fileName);

    // 4. 创建 FormData 对象并添加所有必需的字段
    const formData = new FormData();
    formData.append('file', file);
    formData.append('token', token);
    formData.append('fname', fileName); // 关键修复：添加 key 字段

    // 5. 指定七牛云上传域名


    // 6. 发送 POST 请求进行文件上传
    const resp = await axios.post(`${import.meta.env.VITE_QINIU_UPLOAD_URL}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log("文件名resp：", resp);
    return `${import.meta.env.VITE_QINIU_DOMAIN}/${resp.data.key}`;



  } catch (error) {
    console.error("上传错误详细内容：", error);
    ElMessage.error('上传失败，请检查网络或后端服务');
    throw error; // 抛出错误以便在调用处捕获
  }
};
export const uploadMultipleFiles = async (files) => {
  const token = await getUploadToken();

  const uploadTasks = files.map(async (file) => {
    const fileExtension = file.name.substring(file.name.lastIndexOf('.'));
    const fileName = `${new Date().getTime()}${Math.floor(Math.random() * 1000)}${fileExtension}`;
    console.log("文件名：", fileName);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("token", token);
    formData.append('fname', fileName); // 关键修复：添加 key 字段
    const res = await axios.post(`${import.meta.env.VITE_QINIU_UPLOAD_URL}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return `${import.meta.env.VITE_QINIU_DOMAIN}/${res.data.key}`;
  });

  return Promise.all(uploadTasks);
};