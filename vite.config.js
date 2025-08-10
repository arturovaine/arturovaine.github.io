import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Keep utilities together  
          'vendor-utils': ['./src/utils/ThemeManager.js', './src/utils/ImageOptimizer.js']
        }
      }
    },
    // Optimize for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      }
    },
    // Enable source maps for debugging (optional)
    sourcemap: false,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000
  },
  
  // Optimize dev server
  server: {
    // Enable HTTP/2 for dev server
    https: false,
    // Optimize HMR
    hmr: {
      overlay: false // Disable error overlay for better performance
    }
  },

  // Optimize dependencies  
  optimizeDeps: {
    // Exclude Three.js since it's loaded via import map
    exclude: ['three', 'three/examples/jsm/loaders/STLLoader.js', 'three/examples/jsm/controls/OrbitControls.js']
  },

  // Add performance hints
  define: {
    'import.meta.env.BUILD_TIME': JSON.stringify(new Date().toISOString())
  }
})