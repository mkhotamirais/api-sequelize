import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const fileName = fileURLToPath(import.meta.url);
const dirName = dirname(fileName);
const rootPath = resolve(dirName, "..");

export { dirName, rootPath };
