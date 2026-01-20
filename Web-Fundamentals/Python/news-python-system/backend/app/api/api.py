from fastapi import APIRouter
from app.api.endpoints import user, news

router = APIRouter()

router.include_router(user.router, prefix="/user", tags=["用户管理"])
router.include_router(news.router, prefix="/news", tags=["新闻管理"])