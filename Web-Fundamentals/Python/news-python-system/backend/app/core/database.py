from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# 创建数据库引擎
# echo=True 会打印所有SQL语句，方便调试
engine = create_engine(settings.DATABASE_URL, echo=True)

# 创建一个会话类，每次请求都会创建一个独立的数据库会话
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建一个基类，用于声明ORM模型
Base = declarative_base()

def get_db():
    """依赖注入函数，提供数据库会话"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()