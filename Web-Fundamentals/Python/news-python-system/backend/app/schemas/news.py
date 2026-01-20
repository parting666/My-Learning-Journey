from pydantic import BaseModel
from datetime import datetime

class NewsBase(BaseModel):
    """Pydantic基类，用于通用新闻数据"""
    title: str
    content: str
    author: str

class NewsCreate(NewsBase):
    """用于创建新闻的Pydantic模型"""
    pass

class News(NewsBase):
    """用于返回给前端的新闻模型，包含ID和时间"""
    id: int
    created_at: datetime

    class Config:
        orm_mode = True