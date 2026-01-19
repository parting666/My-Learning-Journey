import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Typography,
} from "@mui/material";
import api from "../api";
import { useAuth } from "../state/AuthContext";

export default function AuthModal({ open, onClose }) {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const res = await api.post("/login", { username, password });
        login({ username, token: res.data.token });
        onClose();
      } else {
        await api.post("/register", { username, password });
        alert("注册成功，请登录");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "出错了");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>{isLogin ? "欢迎回来" : "创建账号"}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="用户名"
          variant="filled"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 1 }}
        />
        <TextField
          type="password"
          label="密码"
          variant="filled"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 1 }}
        />
        <Typography
          variant="body2"
          sx={{ cursor: "pointer", color: "primary.main", textAlign: 'center', mt: 1 }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "没有账号？去注册" : "已有账号？去登录"}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ borderRadius: 2 }}>取消</Button>
        <Button variant="contained" onClick={handleSubmit} sx={{ borderRadius: 2, px: 3 }}>
          {isLogin ? "登录" : "注册"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}