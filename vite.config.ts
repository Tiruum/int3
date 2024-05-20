import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Устанавливаем базовый путь на корень
  build: {
    outDir: 'dist', // Папка, куда будут собраны файлы
    assetsDir: 'assets', // Папка, куда будут скопированы ресурсы
    assetsInlineLimit: 0, // Отключаем встраивание ресурсов
  },
});
