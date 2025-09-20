import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc"; // SWC plugin for faster builds
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // listen on all network interfaces
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Flask backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(), // run only in dev
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // import alias
    },
  },
}));
