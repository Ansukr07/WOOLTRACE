import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/market': {
          target: 'https://api.ceda.ashoka.edu.in/v1/agmarknet',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/market/, ''),
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              if (env.CEDA_API_TOKEN) {
                proxyReq.setHeader('Authorization', `Bearer ${env.CEDA_API_TOKEN}`)
              }
            })
          }
        }
      }
    }
  }
})
