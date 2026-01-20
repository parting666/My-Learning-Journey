from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    """Pydantic基类，用于通用用户数据"""
    username: str
    email: EmailStr

class UserCreate(UserBase):
    """用于创建用户的Pydantic模型，包含密码"""
    password: str

class User(UserBase):
    """用于返回给前端的用户模型，不包含密码"""
    id: int

    class Config:
        orm_mode = True  # 启用ORM模式，兼容SQLAlchemy模型