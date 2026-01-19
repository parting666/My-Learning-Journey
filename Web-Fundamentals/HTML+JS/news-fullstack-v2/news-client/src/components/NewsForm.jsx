import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Paper
} from "@mui/material";
import api from "../api";

export default function NewsForm({ editingNews, setEditingNews, onSuccess }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("获取分类失败", err));
  }, []);

  useEffect(() => {
    if (editingNews) {
      setTitle(editingNews.title);
      setContent(editingNews.content);
      const cat = categories.find(c => c.name === editingNews.category);
      setCategoryId(cat ? cat.id : "");
    } else {
      setTitle("");
      setContent("");
      setCategoryId("");
    }
  }, [editingNews, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { title, content, category_id: categoryId };
      if (editingNews) {
        await api.put(`/news/${editingNews.id}`, data);
      } else {
        await api.post("/news", data);
      }
      onSuccess();
      setEditingNews(null);
      setTitle("");
      setContent("");
      setCategoryId("");
    } catch (err) {
      console.error("操作失败", err);
      alert("操作失败，请检查输入");
    }
  };

  return (
    <Paper className="glass-card" sx={{ p: 3, borderRadius: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
        {editingNews ? "编辑新闻" : "发布新消息"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <TextField
          label="标题"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
        <TextField
          label="内容"
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          multiline
          rows={6}
          fullWidth
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
        <FormControl required fullWidth>
          <InputLabel>分类</InputLabel>
          <Select
            value={categoryId}
            label="分类"
            onChange={(e) => setCategoryId(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            {categories.map(cat => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ py: 1.5, borderRadius: 2, fontWeight: 600, boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}
          >
            {editingNews ? "更新" : "发布"}
          </Button>
          {editingNews && (
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setEditingNews(null)}
              sx={{ py: 1.5, borderRadius: 2, fontWeight: 600 }}
            >
              取消
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
}