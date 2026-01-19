import React, { useState, useEffect } from "react";
import { Container, AppBar, Toolbar, Typography, Button, Box, Grid } from "@mui/material";
import AuthModal from "./components/AuthModal";
import NewsList from "./components/NewsList";
import NewsForm from "./components/NewsForm";
import api, { setAuthToken } from "./api";
import { useAuth } from "./state/AuthContext";

export default function App() {
  const { user, logout, showAuth, setShowAuth } = useAuth();
  const [news, setNews] = useState([]);
  const [editingNews, setEditingNews] = useState(null);

  useEffect(() => {
    if (user?.token) {
      setAuthToken(user.token);
      loadNews();
    }
  }, [user]);

  const loadNews = async () => {
    try {
      const res = await api.get("/news");
      setNews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <AppBar
        position="fixed"
        sx={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          color: "text.primary",
          boxShadow: "none",
          borderBottom: "1px solid rgba(0,0,0,0.1)"
        }}
      >
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: "-0.5px" }}>
            NewsPulse
          </Typography>
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {user.username}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={logout}
                sx={{ borderRadius: 2 }}
              >
                退出登录
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              onClick={() => setShowAuth(true)}
              sx={{ borderRadius: 2, px: 3 }}
            >
              登录 / 注册
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Toolbar /> {/* Spacer for fixed header */}

      <Box sx={{ mt: 4 }}>
        {user ? (
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <NewsForm
                editingNews={editingNews}
                setEditingNews={setEditingNews}
                onSuccess={loadNews}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <NewsList news={news} onEdit={setEditingNews} onDelete={loadNews} />
            </Grid>
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              欢迎来到 NewsPulse
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              请登录以管理您的新闻内容
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => setShowAuth(true)}
              sx={{ borderRadius: 2, px: 6, py: 1.5 }}
            >
              立即登录
            </Button>
          </Box>
        )}
      </Box>

      <AuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
      />
    </Container>
  );
}