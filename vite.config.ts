import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path"


export default defineConfig({
  plugins: [react()],
  base: '/', // Устанавливаем базовый путь на корень
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist', // Папка, куда будут собраны файлы
    assetsDir: 'assets', // Папка, куда будут скопированы ресурсы
    assetsInlineLimit: 0, // Отключаем встраивание ресурсов
  },
});
