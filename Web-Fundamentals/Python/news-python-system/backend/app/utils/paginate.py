from typing import TypeVar, List, Dict
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import Base

# 定义一个类型变量，T 可以是任何 SQLAlchemy 模型
T = TypeVar("T", bound=Base)

def paginate(db: Session, model: T, page: int, size: int) -> Dict:
    """
    通用分页工具函数
    参数:
    - db: 数据库会话
    - model: SQLAlchemy 模型
    - page: 页码
    - size: 每页数量
    返回:
    - 包含分页数据的字典
    """
    # 计算总记录数
    total_count = db.query(func.count(model.id)).scalar()
    # 计算总页数
    total_pages = (total_count + size - 1) // size
    
    # 获取当前页的数据
    items = db.query(model).offset((page - 1) * size).limit(size).all()
    
    return {
        "items": items,
        "total_count": total_count,
        "total_pages": total_pages,
        "current_page": page,
        "page_size": size
    }