import fs from "node:fs";
import path from "node:path";
import type { Connect } from "vite";
import type { Plugin } from "vite";

const MIME: Record<string, string> = {
  ".json": "application/json",
  ".js": "application/javascript",
};

/** Serves /data/* from src/data during Vite dev (mirrors production static copy). */
export function devDataPlugin(): Plugin {
  const dataDir = path.resolve("src/data");

  return {
    name: "fanready-dev-data",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = (req as Connect.IncomingMessage).url?.split("?")[0] ?? "";
        if (!pathname.startsWith("/data/")) {
          next();
          return;
        }

        const fileName = path.basename(pathname);
        const filePath = path.join(dataDir, fileName);
        if (!filePath.startsWith(dataDir) || !fs.existsSync(filePath)) {
          next();
          return;
        }

        const ext = path.extname(fileName);
        res.setHeader("Content-Type", MIME[ext] ?? "application/octet-stream");
        res.end(fs.readFileSync(filePath));
      });
    },
  };
}
