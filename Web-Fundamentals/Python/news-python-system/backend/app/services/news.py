from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.news import News as NewsModel
from app.schemas.news import NewsCreate

def get_news(db: Session, news_id: int) -> Optional[NewsModel]:
    """
    根据新闻ID获取单个新闻
    参数:
    - db: 数据库会话
    - news_id: 新闻ID
    返回:
    - NewsModel对象或None
    """
    return db.query(NewsModel).filter(NewsModel.id == news_id).first()

def get_news_list(db: Session, skip: int = 0, limit: int = 10, keyword: Optional[str] = None) -> List[NewsModel]:
    """
    模糊分页查询新闻列表
    参数:
    - db: 数据库会话
    - skip: 跳过的记录数（用于分页）
    - limit: 返回的最大记录数（用于分页）
    - keyword: 模糊查询关键词，将匹配标题和内容
    返回:
    - 新闻模型列表
    """
    query = db.query(NewsModel)
    if keyword:
        # 使用or_()进行多条件查询，匹配标题或内容
        query = query.filter(
            (NewsModel.title.ilike(f"%{keyword}%")) |
            (NewsModel.content.ilike(f"%{keyword}%"))
        )
    # 按创建时间倒序排序
    return query.order_by(NewsModel.created_at.desc()).offset(skip).limit(limit).all()

def create_news(db: Session, news: NewsCreate) -> NewsModel:
    """
    创建新闻
    参数:
    - db: 数据库会话
    - news: 包含新闻数据的Pydantic模型
    返回:
    - 新创建的新闻模型对象
    """
    # **news.dict() 将 Pydantic 模型转换为字典，便于创建 ORM 对象
    db_news = NewsModel(**news.dict())
    db.add(db_news)
    db.commit()
    db.refresh(db_news)  # 刷新对象，以获取数据库自动生成的值（如ID）
    return db_news

def update_news(db: Session, db_news: NewsModel, news: NewsCreate) -> NewsModel:
    """
    更新现有新闻
    参数:
    - db: 数据库会话
    - db_news: 数据库中已存在的新闻模型对象
    - news: 包含更新数据的Pydantic模型
    返回:
    - 已更新的新闻模型对象
    """
    # 从 Pydantic 模型中获取更新后的数据
    update_data = news.dict(exclude_unset=True)
    for key, value in update_data.items():
        # setattr() 动态设置对象的属性
        setattr(db_news, key, value)
    db.add(db_news)
    db.commit()
    db.refresh(db_news)
    return db_news

def delete_news(db: Session, news: NewsModel):
    """
    删除新闻
    参数:
    - db: 数据库会话
    - news: 要删除的新闻模型对象
    """
    db.delete(news)
    db.commit()