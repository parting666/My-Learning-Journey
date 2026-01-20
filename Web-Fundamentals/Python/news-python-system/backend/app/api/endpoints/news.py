from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.news import News as NewsModel
from app.schemas.news import News as NewsSchema, NewsCreate
from app.services import news as news_service

router = APIRouter()

@router.post("/", response_model=NewsSchema)
def create_news(news: NewsCreate, db: Session = Depends(get_db)):
    """新增新闻"""
    # 业务逻辑：可以添加权限验证
    return news_service.create_news(db=db, news=news)

@router.get("/{news_id}", response_model=NewsSchema)
def read_news(news_id: int, db: Session = Depends(get_db)):
    """根据ID获取新闻详情"""
    db_news = news_service.get_news(db, news_id)
    if not db_news:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="新闻未找到"
        )
    return db_news

@router.get("/", response_model=List[NewsSchema])
def list_news(
    q: str = Query(None, description="模糊查询关键词"),
    page: int = Query(1, gt=0, description="页码"),
    size: int = Query(10, gt=0, le=100, description="每页新闻数量"),
    db: Session = Depends(get_db)
):
    """
    模糊分页查询新闻
    q: 模糊查询标题或内容
    page: 页码，从1开始
    size: 每页数量
    """
    skip = (page - 1) * size
    return news_service.get_news_list(db, skip=skip, limit=size, keyword=q)

@router.put("/{news_id}", response_model=NewsSchema)
def update_news(news_id: int, news: NewsCreate, db: Session = Depends(get_db)):
    """更新新闻"""
    db_news = news_service.get_news(db, news_id)
    if not db_news:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="新闻未找到"
        )
    return news_service.update_news(db=db, db_news=db_news, news=news)

@router.delete("/{news_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_news(news_id: int, db: Session = Depends(get_db)):
    """删除新闻"""
    db_news = news_service.get_news(db, news_id)
    if not db_news:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="新闻未找到"
        )
    news_service.delete_news(db=db, news=db_news)
    return {"message": "新闻删除成功"}