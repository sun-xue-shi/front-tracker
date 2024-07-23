import { defineConfig } from "vite";
import { fileURLToPath, URL } from "url";

export default defineConfig({
  build: {
    outDir: "dist",
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      formats: ["es", "cjs", "umd"],
      name: "ZilongTracker",
      fileName: "ZilongTracker",
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "~": fileURLToPath(new URL("./", import.meta.url)),
      "@utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
    },
  },
});
