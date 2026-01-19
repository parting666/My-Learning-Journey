/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 在这里添加你的自定义样式
      colors: {
        'primary-color': '#42a5f5', // 自定义一个主色
        'secondary-color': '#66bb6a', // 自定义一个副色
      },
      fontFamily: {
        'sans': ['Helvetica', 'Arial', 'sans-serif'], // 自定义无衬线字体
        'serif': ['Georgia', 'serif'], // 自定义衬线字体
      },
    },
  },
  plugins: [],
}