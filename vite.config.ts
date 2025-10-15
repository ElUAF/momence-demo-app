import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "node:path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "server/public",
  },

  server: {
    proxy: {
      "/api/central-bank-proxy": {
        // 1. Set the target to the base host (the server)
        target: "https://www.cnb.cz",
        changeOrigin: true,
        secure: true,

        // 2. Rewrite the path: Replace '/api/central-bank-proxy' with the actual CNB path
        rewrite: (path) =>
          path.replace(
            "/api/central-bank-proxy",
            "/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt",
          ),
      },
      /* === use this to test it with local proxy ===
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },*/
    },
  },
})
