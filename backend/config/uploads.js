import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const uploadsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../uploads");
mkdirSync(uploadsDir, { recursive: true });
