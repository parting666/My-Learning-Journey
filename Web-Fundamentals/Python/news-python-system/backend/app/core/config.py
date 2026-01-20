import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

class Settings:
    # 数据库连接URL
    # f-string 格式化，使用 .env 文件中的变量
    DATABASE_URL = (f"postgresql+psycopg2://{os.getenv('POSTGRES_USER')}:"
                    f"{os.getenv('POSTGRES_PASSWORD')}@"
                    f"{os.getenv('POSTGRES_HOST')}:"
                    f"{os.getenv('POSTGRES_PORT')}/"
                    f"{os.getenv('POSTGRES_DB')}")

    # JWT 配置
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

settings = Settings()