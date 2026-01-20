from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app.core.database import Base

class News(Base):
    """
    新闻模型 (ORM)
    定义数据库中的 news 表
    """
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    author = Column(String)
    # 使用 func.now() 自动在创建时生成当前时间
    created_at = Column(DateTime, default=func.now())