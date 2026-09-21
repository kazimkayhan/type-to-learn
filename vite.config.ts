import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { getLastCommit } from "git-last-commit";
import Icons from "unplugin-icons/vite";
import type { PluginOption } from "vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const latestCommitHash = await new Promise<string>((resolve) => {
    getLastCommit((_err, commit) => {
      resolve(commit.shortHash || "unknown");
    });
  });

  const plugins: PluginOption[] = [
    tailwindcss(),
    react(),
    Icons({
      compiler: "jsx",
      jsx: "react",
    }),
  ];

  if (mode === "production") {
    const { visualizer } = await import("rollup-plugin-visualizer");
    plugins.push(visualizer() as PluginOption);
  }

  return {
    base: "/type-to-learn/",
    build: {
      minify: true,
      outDir: "build",
      sourcemap: false,
    },
    css: {
      modules: {
        localsConvention: "camelCaseOnly",
      },
    },
    define: {
      LATEST_COMMIT_HASH: JSON.stringify(
        latestCommitHash +
          (process.env.NODE_ENV === "production" ? "" : " (dev)")
      ),
      REACT_APP_DEPLOY_ENV: JSON.stringify(process.env.REACT_APP_DEPLOY_ENV),
    },
    esbuild: {
      drop: mode === "development" ? [] : ["console", "debugger"],
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
        "@/hooks": path.resolve(import.meta.dirname, "src/hooks"),
        "@/lib": path.resolve(import.meta.dirname, "src/lib"),
      },
    },
  };
});
