// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///home/project/node_modules/lovable-tagger/dist/index.js";
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
        manualChunks: {
          // Vendor chunks
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-select", "@radix-ui/react-tabs"],
          "query-vendor": ["@tanstack/react-query", "@supabase/supabase-js"],
          "chart-vendor": ["recharts"],
          "form-vendor": ["react-hook-form", "@hookform/resolvers", "zod"],
          "utils-vendor": ["date-fns", "clsx", "tailwind-merge", "lucide-react"]
        }
      }
    },
    chunkSizeWarningLimit: 1e3
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcblxuLy8gRGV0ZXJtaW5lIGlmIHdlJ3JlIHVzaW5nIGxvY2FsIFN1cGFiYXNlXG5jb25zdCBpc0xvY2FsRGV2ID0gcHJvY2Vzcy5lbnYuVklURV9TVVBBQkFTRV9VUkw/LmluY2x1ZGVzKFwibG9jYWxob3N0XCIpO1xuY29uc3Qgc3VwYWJhc2VVcmwgPSBwcm9jZXNzLmVudi5WSVRFX1NVUEFCQVNFX1VSTCB8fCBcImh0dHA6Ly9sb2NhbGhvc3Q6NTQzMjFcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwiOjpcIixcbiAgICBwb3J0OiA4MDgwLFxuICAgIC8vIFByb3h5IGNvbmZpZ3VyYXRpb24gZm9yIGxvY2FsIFN1cGFiYXNlIGRldmVsb3BtZW50XG4gICAgLy8gUm91dGVzIC9mdW5jdGlvbnMvdjEvKiB0byB0aGUgbG9jYWwgU3VwYWJhc2UgZWRnZSBmdW5jdGlvbnMgcnVudGltZVxuICAgIC8vIEZvciBob3N0ZWQgZW52aXJvbm1lbnRzLCB0aGlzIHByb3h5IGlzIGRpc2FibGVkIGFuZCByZXF1ZXN0cyBnbyBkaXJlY3RseSB0byB0aGUgaG9zdGVkIFN1cGFiYXNlIFVSTFxuICAgIHByb3h5OiBpc0xvY2FsRGV2XG4gICAgICA/IHtcbiAgICAgICAgICBcIi9mdW5jdGlvbnMvdjFcIjoge1xuICAgICAgICAgICAgdGFyZ2V0OiBzdXBhYmFzZVVybCxcbiAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLCAvLyBLZWVwIHRoZSBwYXRoIGFzLWlzXG4gICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgICAgOiB7fSxcbiAgfSxcbiAgcGx1Z2luczogW3JlYWN0KCksIG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIiAmJiBjb21wb25lbnRUYWdnZXIoKV0uZmlsdGVyKEJvb2xlYW4pLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IFtcbiAgICAgIHsgZmluZDogXCJAXCIsIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpIH0sXG4gICAgICB7IGZpbmQ6IFwiQHdpbm1peHByb1wiLCByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy93aW5taXhwcm9cIikgfSxcbiAgICAgIHsgZmluZDogXCJyZWFjdC1mbG93LXJlbmRlcmVyXCIsIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL3ZlbmRvci9yZWFjdC1mbG93LXJlbmRlcmVyLnRzeFwiKSB9LFxuICAgIF0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIC8vIFZlbmRvciBjaHVua3NcbiAgICAgICAgICAncmVhY3QtdmVuZG9yJzogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgICd1aS12ZW5kb3InOiBbJ0ByYWRpeC11aS9yZWFjdC1kaWFsb2cnLCAnQHJhZGl4LXVpL3JlYWN0LWRyb3Bkb3duLW1lbnUnLCAnQHJhZGl4LXVpL3JlYWN0LXNlbGVjdCcsICdAcmFkaXgtdWkvcmVhY3QtdGFicyddLFxuICAgICAgICAgICdxdWVyeS12ZW5kb3InOiBbJ0B0YW5zdGFjay9yZWFjdC1xdWVyeScsICdAc3VwYWJhc2Uvc3VwYWJhc2UtanMnXSxcbiAgICAgICAgICAnY2hhcnQtdmVuZG9yJzogWydyZWNoYXJ0cyddLFxuICAgICAgICAgICdmb3JtLXZlbmRvcic6IFsncmVhY3QtaG9vay1mb3JtJywgJ0Bob29rZm9ybS9yZXNvbHZlcnMnLCAnem9kJ10sXG4gICAgICAgICAgJ3V0aWxzLXZlbmRvcic6IFsnZGF0ZS1mbnMnLCAnY2xzeCcsICd0YWlsd2luZC1tZXJnZScsICdsdWNpZGUtcmVhY3QnXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAsXG4gIH0sXG59KSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFIaEMsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTSxhQUFhLFFBQVEsSUFBSSxtQkFBbUIsU0FBUyxXQUFXO0FBQ3RFLElBQU0sY0FBYyxRQUFRLElBQUkscUJBQXFCO0FBR3JELElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBSU4sT0FBTyxhQUNIO0FBQUEsTUFDRSxpQkFBaUI7QUFBQSxRQUNmLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQ0EsVUFBU0E7QUFBQTtBQUFBLE1BQ3JCO0FBQUEsSUFDRixJQUNBLENBQUM7QUFBQSxFQUNQO0FBQUEsRUFDQSxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsaUJBQWlCLGdCQUFnQixDQUFDLEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDOUUsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsRUFBRSxNQUFNLEtBQUssYUFBYSxLQUFLLFFBQVEsa0NBQVcsT0FBTyxFQUFFO0FBQUEsTUFDM0QsRUFBRSxNQUFNLGNBQWMsYUFBYSxLQUFLLFFBQVEsa0NBQVcsaUJBQWlCLEVBQUU7QUFBQSxNQUM5RSxFQUFFLE1BQU0sdUJBQXVCLGFBQWEsS0FBSyxRQUFRLGtDQUFXLHNDQUFzQyxFQUFFO0FBQUEsSUFDOUc7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUE7QUFBQSxVQUVaLGdCQUFnQixDQUFDLFNBQVMsYUFBYSxrQkFBa0I7QUFBQSxVQUN6RCxhQUFhLENBQUMsMEJBQTBCLGlDQUFpQywwQkFBMEIsc0JBQXNCO0FBQUEsVUFDekgsZ0JBQWdCLENBQUMseUJBQXlCLHVCQUF1QjtBQUFBLFVBQ2pFLGdCQUFnQixDQUFDLFVBQVU7QUFBQSxVQUMzQixlQUFlLENBQUMsbUJBQW1CLHVCQUF1QixLQUFLO0FBQUEsVUFDL0QsZ0JBQWdCLENBQUMsWUFBWSxRQUFRLGtCQUFrQixjQUFjO0FBQUEsUUFDdkU7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsdUJBQXVCO0FBQUEsRUFDekI7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogWyJwYXRoIl0KfQo=
