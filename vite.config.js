import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
      interval: 500,
      ignored: ['**/dist/**', '**/.git/**', '**/node_modules/**'],
    },
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("error", (err, req, res) => {
            if (res.headersSent) return;
            res.writeHead(503, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
              success: false,
              backendUnavailable: true,
              message: "Backend unavailable; using local fallback where supported.",
              error: err.code || err.message
            }));
          });
        }
      }
    }
  },
  optimizeDeps: {
    include: ["leaflet"]
  }
})
