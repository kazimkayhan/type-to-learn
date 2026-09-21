import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { getLastCommit } from "git-last-commit";
import Icons from "unplugin-icons/vite";
import type { PluginOption } from "vite";
import { defineConfig } from "vite";

const REACT_VENDOR_RE = /node_modules[/\\](?:react|react-dom|scheduler)[/\\]/;
const ECHARTS_VENDOR_RE = /node_modules[/\\]echarts[/\\]/;
const HOWLER_VENDOR_RE = /node_modules[/\\]howler[/\\]/;
const DEXIE_VENDOR_RE = /node_modules[/\\]dexie[/\\]/;
// Keep @base-ui in one chunk — splitting it across maxSize vendor chunks
// breaks circular imports and crashes the app on load ("it is not iterable").
const BASE_UI_RE = /node_modules[/\\]@base-ui[/\\]/;
const NODE_MODULES_RE = /node_modules/;

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

  const isProduction = mode !== "development";

  return {
    base: "/type-to-learn/",
    build: {
      minify: true,
      outDir: "build",
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: "react-vendor",
                priority: 30,
                test: REACT_VENDOR_RE,
              },
              {
                name: "echarts",
                priority: 25,
                test: ECHARTS_VENDOR_RE,
              },
              {
                name: "howler",
                priority: 20,
                test: HOWLER_VENDOR_RE,
              },
              {
                name: "dexie",
                priority: 20,
                test: DEXIE_VENDOR_RE,
              },
              {
                name: "base-ui",
                priority: 15,
                test: BASE_UI_RE,
              },
              {
                name: "vendor",
                priority: 10,
                test: NODE_MODULES_RE,
              },
            ],
          },
          minify: isProduction
            ? {
                compress: {
                  dropConsole: true,
                  dropDebugger: true,
                },
                mangle: true,
              }
            : false,
        },
      },
      sourcemap: false,
    },
    css: {
      modules: {
        localsConvention: "camelCaseOnly",
      },
    },
    define: {
      LATEST_COMMIT_HASH: JSON.stringify(
        latestCommitHash + (isProduction ? "" : " (dev)")
      ),
      REACT_APP_DEPLOY_ENV: JSON.stringify(process.env.REACT_APP_DEPLOY_ENV),
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
