# React 表单对比项目：JavaScript vs TypeScript

本项目通过实现一个相同功能的新闻稿提交表单，直观地展示了使用 **JavaScript (JS)** 和 **TypeScript (TS)** 开发 React 应用的区别。

## 项目意义
项目的核心目的是通过对比，帮助开发者理解 TypeScript 在实际业务逻辑（如表单处理、状态管理、异步请求）中提供的**类型安全**、**开发效率提升**以及**可维护性增强**等优势。

## JS 与 TS 的主要区别

| 特性 | JavaScript 版本 (`react-js-form`) | TypeScript 版本 (`react-ts-form`) |
| :--- | :--- | :--- |
| **类型安全** | 缺乏类型约束，属性名写错（如 `title` 写成 `titel`）只能在运行时发现。 | 使用 `interface FormData` 强制约束数据结构，编写代码时即可发现拼写错误。 |
| **开发体验** | VS Code 提供的代码提示有限，需要频繁查看状态定义。 | 完善的属性自动补全。状态 `formData` 的每个字段都有精确提示。 |
| **事件处理** | `handleChange` 的事件参数 `e` 是隐式的，无法直接感知 `e.target` 的属性。 | 显式声明 `React.ChangeEvent` 类型，开发者能明确知道 `e` 的结构。 |
| **错误捕获** | `catch(error)` 中的 `error` 类型不明确，直接访问 `error.message` 存在风险。 | 需要类型断言（如 `error as Error`），确保错误处理逻辑的健壮性。 |
| **项目配置** | 配置文件简单（`.js` 后缀）。 | 增加了 `tsconfig.json` 等配置，虽然增加了上手难度，但换来了长期维护的稳定性。 |

## 架构与运行逻辑

### 1. 技术栈架构
- **构建工具**: [Vite](https://vitejs.dev/) - 提供极速的热更新和构建体验。
- **前端框架**: [React 18](https://react.dev/) - 使用函数式组件和 Hooks (useState)。
- **样式方案**: [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架，确保 UI 美观且响应式。
- **接口测试**: [httpbin.org](https://httpbin.org/post) - 用于模拟真实后端 POST 请求的返回。

### 2. 运行逻辑 (Data Flow)
两个表单的底层逻辑是完全一致的，遵循 React 的受控组件模式：

1.  **初始化**: 组件挂载时，初始化表单数据状态 (`formData`)、提交状态 (`submissionStatus`) 和加载状态 (`isLoading`)。
2.  **输入控制**: 用户在 `input` 或 `textarea` 中输入时，触发 `onChange` 事件，调用 `handleChange` 函数通过 `setFormData` 同步更新 React 状态。
3.  **异步提交**: 
    - 用户点击“提交”按钮，触发 `onSubmit` 事件。
    - `handleSubmit` 函数首先调用 `e.preventDefault()` 阻止浏览器默认刷新。
    - 设置 `isLoading` 为 `true`，向 `httpbin.org` 发起异步 `fetch` 请求。
4.  **结果反馈**: 
    - 请求成功：将接口返回的 JSON 数据保存到 `submissionStatus` 中，并清空表单。
    - 请求失败：捕获异常并将错误信息展示在界面上。
    - 最后将 `isLoading` 设回 `false`。

## 如何运行

### JavaScript 版本
```bash
cd react-js-form
npm install
npm run dev
```

### TypeScript 版本
```bash
cd react-ts-form
npm install
npm run dev
```
