// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.1/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/.pnpm/@vitejs+plugin-react-swc@3.11.0_vite@5.4.21/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///home/project/node_modules/.pnpm/lovable-tagger@1.1.11_vite@5.4.21/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "/home/project";
var isLocalDev = process.env.VITE_SUPABASE_URL?.includes("localhost");
var supabaseUrl = process.env.VITE_SUPABASE_URL || "http://localhost:54321";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Proxy configuration for local Supabase development
    // Routes /functions/v1/* to the local Supabase edge functions runtime
    // For hosted environments, this proxy is disabled and requests go directly to the hosted Supabase URL
    proxy: isLocalDev ? {
      "/functions/v1": {
        target: supabaseUrl,
        changeOrigin: true,
        rewrite: (path2) => path2
        // Keep the path as-is
      }
    } : {}
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__vite_injected_original_dirname, "./src") },
      { find: "@winmixpro", replacement: path.resolve(__vite_injected_original_dirname, "./src/winmixpro") },
      { find: "react-flow-renderer", replacement: path.resolve(__vite_injected_original_dirname, "./src/vendor/react-flow-renderer.tsx") }
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) {
              return "react-vendor";
            }
            if (id.includes("@radix-ui")) {
              return "ui-vendor";
            }
            if (id.includes("@tanstack/react-query")) {
              return "query-vendor";
            }
            if (id.includes("@supabase/supabase-js")) {
              return "supabase-vendor";
            }
            if (id.includes("recharts")) {
              return "chart-vendor";
            }
            if (id.includes("react-hook-form") || id.includes("@hookform") || id.includes("zod")) {
              return "form-vendor";
            }
            if (id.includes("date-fns")) {
              return "date-vendor";
            }
            if (id.includes("lucide-react")) {
              return "icons-vendor";
            }
            if (id.includes("clsx") || id.includes("tailwind-merge") || id.includes("class-variance-authority")) {
              return "utils-vendor";
            }
            return "vendor";
          }
        }
      }
    },
    chunkSizeWarningLimit: 500,
    sourcemap: false,
    minify: "esbuild"
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcblxuLy8gRGV0ZXJtaW5lIGlmIHdlJ3JlIHVzaW5nIGxvY2FsIFN1cGFiYXNlXG5jb25zdCBpc0xvY2FsRGV2ID0gcHJvY2Vzcy5lbnYuVklURV9TVVBBQkFTRV9VUkw/LmluY2x1ZGVzKFwibG9jYWxob3N0XCIpO1xuY29uc3Qgc3VwYWJhc2VVcmwgPSBwcm9jZXNzLmVudi5WSVRFX1NVUEFCQVNFX1VSTCB8fCBcImh0dHA6Ly9sb2NhbGhvc3Q6NTQzMjFcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwiOjpcIixcbiAgICBwb3J0OiA4MDgwLFxuICAgIC8vIFByb3h5IGNvbmZpZ3VyYXRpb24gZm9yIGxvY2FsIFN1cGFiYXNlIGRldmVsb3BtZW50XG4gICAgLy8gUm91dGVzIC9mdW5jdGlvbnMvdjEvKiB0byB0aGUgbG9jYWwgU3VwYWJhc2UgZWRnZSBmdW5jdGlvbnMgcnVudGltZVxuICAgIC8vIEZvciBob3N0ZWQgZW52aXJvbm1lbnRzLCB0aGlzIHByb3h5IGlzIGRpc2FibGVkIGFuZCByZXF1ZXN0cyBnbyBkaXJlY3RseSB0byB0aGUgaG9zdGVkIFN1cGFiYXNlIFVSTFxuICAgIHByb3h5OiBpc0xvY2FsRGV2XG4gICAgICA/IHtcbiAgICAgICAgICBcIi9mdW5jdGlvbnMvdjFcIjoge1xuICAgICAgICAgICAgdGFyZ2V0OiBzdXBhYmFzZVVybCxcbiAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLCAvLyBLZWVwIHRoZSBwYXRoIGFzLWlzXG4gICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgICAgOiB7fSxcbiAgfSxcbiAgcGx1Z2luczogW3JlYWN0KCksIG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIiAmJiBjb21wb25lbnRUYWdnZXIoKV0uZmlsdGVyKEJvb2xlYW4pLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IFtcbiAgICAgIHsgZmluZDogXCJAXCIsIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpIH0sXG4gICAgICB7IGZpbmQ6IFwiQHdpbm1peHByb1wiLCByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy93aW5taXhwcm9cIikgfSxcbiAgICAgIHsgZmluZDogXCJyZWFjdC1mbG93LXJlbmRlcmVyXCIsIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL3ZlbmRvci9yZWFjdC1mbG93LXJlbmRlcmVyLnRzeFwiKSB9LFxuICAgIF0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczogKGlkKSA9PiB7XG4gICAgICAgICAgLy8gVmVuZG9yIGNodW5rcyB3aXRoIG1vcmUgZ3JhbnVsYXIgc3BsaXR0aW5nXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdyZWFjdCcpIHx8IGlkLmluY2x1ZGVzKCdyZWFjdC1kb20nKSB8fCBpZC5pbmNsdWRlcygncmVhY3Qtcm91dGVyLWRvbScpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAncmVhY3QtdmVuZG9yJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnQHJhZGl4LXVpJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICd1aS12ZW5kb3InO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdAdGFuc3RhY2svcmVhY3QtcXVlcnknKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ3F1ZXJ5LXZlbmRvcic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ0BzdXBhYmFzZS9zdXBhYmFzZS1qcycpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAnc3VwYWJhc2UtdmVuZG9yJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygncmVjaGFydHMnKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ2NoYXJ0LXZlbmRvcic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ3JlYWN0LWhvb2stZm9ybScpIHx8IGlkLmluY2x1ZGVzKCdAaG9va2Zvcm0nKSB8fCBpZC5pbmNsdWRlcygnem9kJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdmb3JtLXZlbmRvcic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ2RhdGUtZm5zJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdkYXRlLXZlbmRvcic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ2x1Y2lkZS1yZWFjdCcpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAnaWNvbnMtdmVuZG9yJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnY2xzeCcpIHx8IGlkLmluY2x1ZGVzKCd0YWlsd2luZC1tZXJnZScpIHx8IGlkLmluY2x1ZGVzKCdjbGFzcy12YXJpYW5jZS1hdXRob3JpdHknKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ3V0aWxzLXZlbmRvcic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBBbGwgb3RoZXIgbm9kZV9tb2R1bGVzIGdvIGludG8gdmVuZG9yIGNodW5rXG4gICAgICAgICAgICByZXR1cm4gJ3ZlbmRvcic7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNTAwLFxuICAgIHNvdXJjZW1hcDogZmFsc2UsXG4gICAgbWluaWZ5OiAnZXNidWlsZCcsXG4gIH0sXG59KSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFIaEMsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTSxhQUFhLFFBQVEsSUFBSSxtQkFBbUIsU0FBUyxXQUFXO0FBQ3RFLElBQU0sY0FBYyxRQUFRLElBQUkscUJBQXFCO0FBR3JELElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBSU4sT0FBTyxhQUNIO0FBQUEsTUFDRSxpQkFBaUI7QUFBQSxRQUNmLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQ0EsVUFBU0E7QUFBQTtBQUFBLE1BQ3JCO0FBQUEsSUFDRixJQUNBLENBQUM7QUFBQSxFQUNQO0FBQUEsRUFDQSxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsaUJBQWlCLGdCQUFnQixDQUFDLEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDOUUsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsRUFBRSxNQUFNLEtBQUssYUFBYSxLQUFLLFFBQVEsa0NBQVcsT0FBTyxFQUFFO0FBQUEsTUFDM0QsRUFBRSxNQUFNLGNBQWMsYUFBYSxLQUFLLFFBQVEsa0NBQVcsaUJBQWlCLEVBQUU7QUFBQSxNQUM5RSxFQUFFLE1BQU0sdUJBQXVCLGFBQWEsS0FBSyxRQUFRLGtDQUFXLHNDQUFzQyxFQUFFO0FBQUEsSUFDOUc7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjLENBQUMsT0FBTztBQUVwQixjQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0IsZ0JBQUksR0FBRyxTQUFTLE9BQU8sS0FBSyxHQUFHLFNBQVMsV0FBVyxLQUFLLEdBQUcsU0FBUyxrQkFBa0IsR0FBRztBQUN2RixxQkFBTztBQUFBLFlBQ1Q7QUFDQSxnQkFBSSxHQUFHLFNBQVMsV0FBVyxHQUFHO0FBQzVCLHFCQUFPO0FBQUEsWUFDVDtBQUNBLGdCQUFJLEdBQUcsU0FBUyx1QkFBdUIsR0FBRztBQUN4QyxxQkFBTztBQUFBLFlBQ1Q7QUFDQSxnQkFBSSxHQUFHLFNBQVMsdUJBQXVCLEdBQUc7QUFDeEMscUJBQU87QUFBQSxZQUNUO0FBQ0EsZ0JBQUksR0FBRyxTQUFTLFVBQVUsR0FBRztBQUMzQixxQkFBTztBQUFBLFlBQ1Q7QUFDQSxnQkFBSSxHQUFHLFNBQVMsaUJBQWlCLEtBQUssR0FBRyxTQUFTLFdBQVcsS0FBSyxHQUFHLFNBQVMsS0FBSyxHQUFHO0FBQ3BGLHFCQUFPO0FBQUEsWUFDVDtBQUNBLGdCQUFJLEdBQUcsU0FBUyxVQUFVLEdBQUc7QUFDM0IscUJBQU87QUFBQSxZQUNUO0FBQ0EsZ0JBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUMvQixxQkFBTztBQUFBLFlBQ1Q7QUFDQSxnQkFBSSxHQUFHLFNBQVMsTUFBTSxLQUFLLEdBQUcsU0FBUyxnQkFBZ0IsS0FBSyxHQUFHLFNBQVMsMEJBQTBCLEdBQUc7QUFDbkcscUJBQU87QUFBQSxZQUNUO0FBRUEsbUJBQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSx1QkFBdUI7QUFBQSxJQUN2QixXQUFXO0FBQUEsSUFDWCxRQUFRO0FBQUEsRUFDVjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbInBhdGgiXQp9Cg==
