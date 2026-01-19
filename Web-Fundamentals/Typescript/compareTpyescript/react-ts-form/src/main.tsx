import React from 'react'
import ReactDOM from 'react-dom/client'
import { createRoot } from 'react-dom/client'; 
import App from './App.tsx'
import './index.css' // 导入 Tailwind 样式

const container = document.getElementById('root');
if (container) {
  // 使用 createRoot 创建一个根
  const root = createRoot(container);
  
  // 在根上调用 render
  root.render(<App />);
} else {
  // 处理未找到 DOM 元素的情况
  console.error('在 DOM 中未找到 ID 为 "root" 的元素。');
}