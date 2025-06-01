import react from "@vitejs/plugin-react";
import { defineConfig, type ViteUserConfig } from "vitest/config";
// import { configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/main.tsx",
        "src/App.tsx",
        "src/types/",
        "src/**/*.d.ts",
      ],
    },
  },
} satisfies ViteUserConfig);
