import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const localBuild = process.env.NODE_ENV === "development";

export default defineConfig({
  // Allows serving the SPA from GH Pages
  base: localBuild ? "/" : "/ReactGameCollection/",
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
});
