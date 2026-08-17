import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        bypass: (req, res) => {
          // Handle /api calls gracefully when backend on port 3000 is not active
          res.setHeader("Content-Type", "application/json");
          if (req.url.includes("/processing/ceda")) {
            res.end(JSON.stringify({ success: true, serviceStatus: "OFFLINE", message: "CEDA Dev Mock Active" }));
            return false;
          }
          if (req.url.includes("/login")) {
            res.end(JSON.stringify({ success: false, error: "Mock login fallback active" }));
            return false;
          }
          res.end(JSON.stringify({ success: false, message: "Local mock API response" }));
          return false;
        }
      }
    }
  },
  optimizeDeps: {
    include: ["leaflet"]
  }
})
