// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2'; // <-- Correct import

export default defineConfig({
  plugins: [
    vue() // <-- Correct usage
  ],
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm.js'
    }
  }
});