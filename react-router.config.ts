import type { Config } from "@react-router/dev/config";

const localBuild = process.env.NODE_ENV === "development";

export default {
  ssr: false,

  // Allows serving the SPA from GH Pages
  basename: localBuild ? "/" :  "/ReactGameCollection/",
} satisfies Config;
