# 环境配置说明

## 数据库配置

项目默认使用 PostgreSQL 数据库。在运行前，请修改 `application.properties` 中的数据库配置：

```properties
# 位置: news-management-backend/src/main/resources/application.properties

spring.datasource.url=jdbc:postgresql://localhost:5432/news_java
spring.datasource.username=postgres
spring.datasource.password=your_password_here  # 替换为你的数据库密码
```

### 快速切换到 H2 内存数据库

如果不想配置 PostgreSQL，可以切换到 H2 内存数据库（无需安装）：

1. 修改 `pom.xml`，注释掉 PostgreSQL 依赖，启用 H2：

```xml
<!-- 注释掉 PostgreSQL -->
<!--
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
-->

<!-- 启用 H2 -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

2. 修改 `application.properties`：

```properties
# H2 Database Configuration
spring.datasource.url=jdbc:h2:mem:newsdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# H2 Console (可选，用于查看数据库)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA Settings
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
```

## IDE 配置文件说明

项目保留了 IDE 配置文件，方便团队协作：

### IntelliJ IDEA
- `.idea/` 文件夹包含项目配置
- 个人工作区设置（workspace.xml）已被 .gitignore 排除
- 可以直接用 IDEA 打开项目

### VSCode
- `.vscode/settings.json` 包含基本的 Java 配置
- 个人设置已被排除

## JWT 密钥配置

当前 JWT 密钥在代码中硬编码，仅供开发使用：

```properties
jwt.secret=ThisIsAVeryStrongAndLongSecretKeyForYourNewsManagementSystemJWTToken
```

**生产环境建议**：使用环境变量
```bash
export JWT_SECRET=your_production_secret_key
```

然后在 `application.properties` 中引用：
```properties
jwt.secret=${JWT_SECRET}
```

## 端口配置

- 后端端口：`8080`
- 前端端口：`3000`（Vite 默认）

如需修改，请同步更新：
1. 后端 `application.properties` 中的 `server.port`
2. 前端 `newsApi.ts` 中的 `API_URL`
3. 后端 `SecurityConfig.java` 中的 CORS 配置
