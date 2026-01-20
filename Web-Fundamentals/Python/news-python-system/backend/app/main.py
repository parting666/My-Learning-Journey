import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <-- 导入 CORS 中间件

from app.api.api import router as api_router
from app.core.database import SessionLocal, engine, Base
import logging
logging.basicConfig(level=logging.INFO)
# 创建数据库表
Base.metadata.create_all(bind=engine)

app = FastAPI()

# <-- 在这里添加 CORS 配置
origins = [
    "http://localhost:5173",  # 允许前端应用访问
    "http://127.0.0.1:5173",  # 备用地址
]
# mytest = 'ok'
# logging.info(f"获得的数据info1:{mytest}")
# logging.info("获得的数据info2:%s", mytest)
# logging.info("获得的数据info3:{}", mytest)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有 HTTP 方法 (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # 允许所有请求头
)
# logging.info(f"获得的数据info1：{origins}")
# logging.info("获得的数据info2：%s", origins)
# logging.info("获得的数据info3：{}", origins)

# logging.warning(f"获得的数据warning1：{origins}")
# logging.warning("获得的数据warning2：%s", origins)
# logging.warning("获得的数据warning3：{}", origins)

app.include_router(api_router, prefix="")