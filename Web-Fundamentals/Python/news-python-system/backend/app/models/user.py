from sqlalchemy import Column, Integer, String
from app.core.database import Base

class User(Base):
    """
    用户模型 (ORM)
    定义数据库中的 users 表
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)