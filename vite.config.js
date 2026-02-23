import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimizaciones de build
    minify: 'esbuild', // Más rápido que terser
    sourcemap: false, // Desactivar en producción para mejor rendimiento
    rollupOptions: {
      output: {
        // Code splitting más agresivo
        manualChunks: {
          // Separar vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'icons-vendor': ['lucide-react'],
        },
        // Optimizar nombres de chunks
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Optimizaciones adicionales
    target: 'es2015', // Compatibilidad moderna
    cssCodeSplit: true, // Separar CSS
    reportCompressedSize: false, // Más rápido en build
    chunkSizeWarningLimit: 1000, // Aumentar límite de warning
  },
  // Optimizaciones para desarrollo
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
    ],
    // Pre-bundle dependencies comunes
    esbuildOptions: {
      target: 'es2015',
    },
  },
  // 🔧 Configuración de servidor para desarrollo
  // OJO: no ponemos cabeceras de caché agresivas aquí,
  // dejamos que Vite gestione la caché para que HMR funcione bien
  server: {
    // Puedes añadir aquí otras opciones (port, host, etc.) si las necesitas,
    // pero sin Cache-Control con max-age alto en desarrollo.
  },
})
