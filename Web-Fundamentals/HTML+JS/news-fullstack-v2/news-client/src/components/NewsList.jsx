import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import api from "../api";

export default function NewsList({ news, onEdit, onDelete }) {
  const handleDelete = async (id) => {
    if (!window.confirm("确定删除这条新闻吗？")) return;
    await api.delete(`/news/${id}`);
    onDelete();
  };

  return (
    <Grid container spacing={3}>
      {news.map((item) => (
        <Grid item xs={12} key={item.id}>
          <Card className="glass-card" sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {item.title}
                </Typography>
                <Chip
                  label={item.category}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(99, 102, 241, 0.1)',
                    color: '#6366f1',
                    fontWeight: 600,
                    borderRadius: 1.5
                  }}
                />
              </Box>
              <Typography variant="body1" sx={{ color: '#475569', mb: 3, lineHeight: 1.7 }}>
                {item.content}
              </Typography>
              <Divider sx={{ my: 2, opacity: 0.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                  由 <span style={{ color: '#6366f1' }}>{item.created_by}</span> 发布
                </Typography>
                <CardActions sx={{ p: 0 }}>
                  <Button
                    size="small"
                    onClick={() => onEdit(item)}
                    sx={{ borderRadius: 2, fontWeight: 600 }}
                  >
                    编辑
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(item.id)}
                    sx={{ borderRadius: 2, fontWeight: 600 }}
                  >
                    删除
                  </Button>
                </CardActions>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}