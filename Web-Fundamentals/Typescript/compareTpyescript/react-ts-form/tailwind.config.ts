/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 确保扫描您所有的组件文件
  ],
  theme: {
    extend: {}, // 在这里添加您的自定义主题
  },
  plugins: [],
}